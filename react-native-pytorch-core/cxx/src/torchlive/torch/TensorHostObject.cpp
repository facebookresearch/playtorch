/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include <ATen/NativeFunctions.h>
#include <torch/script.h>
#include <string>
#include <vector>

#include "TensorHostObject.h"
#include "utils/constants.h"
#include "utils/helpers.h"

// Namespace alias for torch to avoid namespace conflicts with torchlive::torch
namespace torch_ = torch;

namespace torchlive {
namespace torch {

// TensorHostObject Method Names
static const std::string ABS = "abs";
static const std::string DIV = "div";
static const std::string SIZE = "size";
static const std::string SQUEEZE = "squeeze";
static const std::string TOSTRING = "toString";
static const std::string UNSQUEEZE = "unsqueeze";

// TensorHostObject Property Names
static const std::string DATA = "data";
static const std::string DTYPE = "dtype";
static const std::string SHAPE = "shape";

// TensorHostObject Properties
static const std::vector<std::string> PROPERTIES = {DATA, DTYPE, SHAPE};

// TensorHostObject Methods
static const std::vector<std::string> METHODS =
    {ABS, DIV, SIZE, SQUEEZE, TOSTRING, UNSQUEEZE};

using namespace facebook;

TensorHostObject::TensorHostObject(jsi::Runtime& runtime, torch_::Tensor t)
    : abs_(createAbs(runtime)),
      div_(createDiv(runtime)),
      size_(createSize(runtime)),
      squeeze_(createSqueeze(runtime)),
      toString_(createToString(runtime)),
      unsqueeze_(createUnsqueeze(runtime)),
      tensor(t) {}

TensorHostObject::~TensorHostObject() {}

std::vector<jsi::PropNameID> TensorHostObject::getPropertyNames(
    jsi::Runtime& runtime) {
  std::vector<jsi::PropNameID> result;
  for (std::string property : PROPERTIES) {
    result.push_back(jsi::PropNameID::forUtf8(runtime, property));
  }
  for (std::string method : METHODS) {
    result.push_back(jsi::PropNameID::forUtf8(runtime, method));
  }
  return result;
}

jsi::Value TensorHostObject::get(
    jsi::Runtime& runtime,
    const jsi::PropNameID& propNameId) {
  auto name = propNameId.utf8(runtime);

  if (name == ABS) {
    return jsi::Value(runtime, abs_);
  } else if (name == DATA) {
    auto tensor = this->tensor;
    int byteLength = tensor.nbytes();
    auto type = tensor.dtype();

    // TODO(T113480543): enable BigInt data view once Hermes support the
    // BigIntArray
    if (type == torch_::kInt64) {
      throw jsi::JSError(
          runtime, "the property 'data' of BigInt Tensor is not supported.");
    }

    jsi::ArrayBuffer buffer = runtime.global()
                                  .getPropertyAsFunction(runtime, "ArrayBuffer")
                                  .callAsConstructor(runtime, byteLength)
                                  .asObject(runtime)
                                  .getArrayBuffer(runtime);

    std::memcpy(buffer.data(runtime), tensor.data_ptr(), byteLength);

    std::string typedArrayName;
    if (type == torch_::kUInt8) {
      typedArrayName = "Uint8Array";
    } else if (type == torch_::kInt8) {
      typedArrayName = "Int8Array";
    } else if (type == torch_::kInt16) {
      typedArrayName = "Int16Array";
    } else if (type == torch_::kInt32) {
      typedArrayName = "Int32Array";
    } else if (type == torch_::kFloat32) {
      typedArrayName = "Float32Array";
    } else if (type == torch_::kFloat64) {
      typedArrayName = "Float64Array";
    } else {
      throw jsi::JSError(runtime, "tensor data dtype is not supported");
    }

    return runtime.global()
        .getPropertyAsFunction(runtime, typedArrayName.c_str())
        .callAsConstructor(runtime, buffer)
        .asObject(runtime);
  } else if (name == DIV) {
    return jsi::Value(runtime, div_);
  } else if (name == DTYPE) {
    return jsi::String::createFromUtf8(
        runtime,
        utils::constants::getStringFromDtype(
            caffe2::typeMetaToScalarType(this->tensor.dtype())));
  } else if (name == SHAPE) {
    return this->size_.call(runtime);
  } else if (name == SIZE) {
    return jsi::Value(runtime, size_);
  } else if (name == SQUEEZE) {
    return jsi::Value(runtime, squeeze_);
  } else if (name == TOSTRING) {
    return jsi::Value(runtime, toString_);
  } else if (name == UNSQUEEZE) {
    return jsi::Value(runtime, unsqueeze_);
  }

  int idx = -1;
  try {
    idx = std::stoi(name.c_str());
  } catch (const std::exception& e) {
    // Cannot parse name value to int. This can happen when the name in bracket
    // or dot notion is not an int (e.g., tensor['foo']).
    // Let's ignore this exception here since this function will return
    // undefined if it reaches the function end.
  }
  if (idx >= 0 && idx < this->tensor.ndimension()) {
    auto outputTensor = this->tensor[idx];
    auto tensorHostObject =
        std::make_shared<torchlive::torch::TensorHostObject>(
            runtime, std::move(outputTensor));
    return jsi::Object::createFromHostObject(runtime, tensorHostObject);
  }

  return jsi::Value::undefined();
}

jsi::Function TensorHostObject::createAbs(jsi::Runtime& runtime) {
  auto absFunc = [this](
                     jsi::Runtime& runtime,
                     const jsi::Value& thisValue,
                     const jsi::Value* arguments,
                     size_t count) -> jsi::Value {
    if (count > 0) {
      throw jsi::JSError(
          runtime,
          "0 argument is expected but " + std::to_string(count) +
              " are given.");
    }
    auto outputTensor = this->tensor.abs();
    auto tensorHostObject =
        std::make_shared<torchlive::torch::TensorHostObject>(
            runtime, outputTensor);
    return jsi::Object::createFromHostObject(runtime, tensorHostObject);
  };
  return jsi::Function::createFromHostFunction(
      runtime, jsi::PropNameID::forUtf8(runtime, TOSTRING), 0, absFunc);
}

jsi::Function TensorHostObject::createToString(jsi::Runtime& runtime) {
  auto toStringFunc = [this](
                          jsi::Runtime& runtime,
                          const jsi::Value& thisValue,
                          const jsi::Value* arguments,
                          size_t count) -> jsi::Value {
    auto tensor = this->tensor;
    std::ostringstream stream;
    stream << tensor;
    std::string tensor_string = stream.str();
    auto val = jsi::String::createFromUtf8(runtime, tensor_string);
    return jsi::Value(std::move(val));
  };
  return jsi::Function::createFromHostFunction(
      runtime, jsi::PropNameID::forUtf8(runtime, TOSTRING), 0, toStringFunc);
}

jsi::Function TensorHostObject::createDiv(jsi::Runtime& runtime) {
  auto divFunc = [this](
                     jsi::Runtime& runtime,
                     const jsi::Value& thisValue,
                     const jsi::Value* arguments,
                     size_t count) -> jsi::Value {
    if (count < 1) {
      throw jsi::JSError(runtime, "At least 1 arg required");
    }
    auto tensor = this->tensor;
    if (arguments[0].isNumber()) {
      auto value = arguments[0].asNumber();
      tensor = tensor.div(value);
    } else {
      auto otherTensorHostObject =
          utils::helpers::parseTensor(runtime, &arguments[0]);
      auto otherTensor = otherTensorHostObject->tensor;
      tensor = tensor.div(otherTensor);
    }
    auto tensorHostObject =
        std::make_shared<torchlive::torch::TensorHostObject>(runtime, tensor);
    return jsi::Object::createFromHostObject(runtime, tensorHostObject);
  };
  return jsi::Function::createFromHostFunction(
      runtime, jsi::PropNameID::forUtf8(runtime, DIV), 1, divFunc);
}

jsi::Function TensorHostObject::createSize(jsi::Runtime& runtime) {
  auto sizeFunc = [this](
                      jsi::Runtime& runtime,
                      const jsi::Value& thisValue,
                      const jsi::Value* arguments,
                      size_t count) -> jsi::Value {
    auto tensor = this->tensor;
    torch_::IntArrayRef dims = tensor.sizes();
    jsi::Array jsShape = jsi::Array(runtime, dims.size());
    for (int i = 0; i < dims.size(); i++) {
      jsShape.setValueAtIndex(runtime, i, jsi::Value((int)dims[i]));
    }

    return jsShape;
  };
  return jsi::Function::createFromHostFunction(
      runtime, jsi::PropNameID::forUtf8(runtime, SIZE), 0, sizeFunc);
}

jsi::Function TensorHostObject::createSqueeze(jsi::Runtime& runtime) {
  auto squeezeFunc = [this](
                         jsi::Runtime& runtime,
                         const jsi::Value& thisValue,
                         const jsi::Value* arguments,
                         size_t count) -> jsi::Value {
    if (!((count == 1 && arguments[0].isNumber()) || count == 0)) {
      throw jsi::JSError(
          runtime, "Please enter an empty argument list or a single number.");
    }
    auto tensor = this->tensor;
    at::Tensor reshapedTensor;
    if (count == 0) {
      reshapedTensor = tensor.squeeze();
    } else if (count == 1) {
      int dim = arguments[0].asNumber();
      reshapedTensor = tensor.squeeze(dim);
    }

    auto tensorHostObject =
        std::make_shared<torchlive::torch::TensorHostObject>(
            runtime, reshapedTensor);
    return jsi::Object::createFromHostObject(runtime, tensorHostObject);
  };
  return jsi::Function::createFromHostFunction(
      runtime, jsi::PropNameID::forUtf8(runtime, SQUEEZE), 1, squeezeFunc);
}

jsi::Function TensorHostObject::createUnsqueeze(jsi::Runtime& runtime) {
  auto unsqueezeFunc = [this](
                           jsi::Runtime& runtime,
                           const jsi::Value& thisValue,
                           const jsi::Value* arguments,
                           size_t count) -> jsi::Value {
    auto tensor = this->tensor;
    int nDims = tensor.sizes().size();

    bool augumentCheck = (count == 1) && (arguments[0].isNumber()) &&
        ((int)arguments[0].asNumber() >= 0) &&
        ((int)arguments[0].asNumber() <= nDims);
    if (!augumentCheck) {
      throw jsi::JSError(
          runtime,
          "argument for squeeze() must be in range [0, " +
              std::to_string(nDims) + "]. " +
              std::to_string((int)arguments[0].asNumber()) + " is provided.\n");
    }

    at::Tensor reshapedTensor = tensor.unsqueeze(arguments[0].asNumber());

    auto tensorHostObject =
        std::make_shared<torchlive::torch::TensorHostObject>(
            runtime, reshapedTensor);
    return jsi::Object::createFromHostObject(runtime, tensorHostObject);
  };
  return jsi::Function::createFromHostFunction(
      runtime, jsi::PropNameID::forUtf8(runtime, UNSQUEEZE), 1, unsqueezeFunc);
}

} // namespace torch
} // namespace torchlive
