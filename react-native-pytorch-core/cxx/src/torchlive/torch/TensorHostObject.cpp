/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include <jsi/jsi.h>

#include <ATen/NativeFunctions.h>
#include <torch/script.h>
#include <string>
#include <vector>

#include "TensorHostObject.h"
#include "utils/constants.h"

// Namespace alias for torch to avoid namespace conflicts with torchlive::torch
namespace torch_ = torch;

namespace torchlive {
namespace torch {

// TensorHostObject Method Names
static const std::string SIZE = "size";
static const std::string TOSTRING = "toString";

// TensorHostObject Property Names
static const std::string DATA = "data";
static const std::string DTYPE = "dtype";
static const std::string SHAPE = "shape";

// TensorHostObject Properties
static const std::vector<std::string> PROPERTIES = {DATA, DTYPE, SHAPE};

// TensorHostObject Methods
static const std::vector<std::string> METHODS = {SIZE, TOSTRING};

using namespace facebook;

TensorHostObject::TensorHostObject(jsi::Runtime& runtime, torch_::Tensor t)
    : size_(createSize(runtime)),
      toString_(createToString(runtime)),
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

  if (name == DATA) {
    auto tensor = this->tensor;
    int byteLength = tensor.nbytes();

    jsi::ArrayBuffer buffer = runtime.global()
                                  .getPropertyAsFunction(runtime, "ArrayBuffer")
                                  .callAsConstructor(runtime, byteLength)
                                  .asObject(runtime)
                                  .getArrayBuffer(runtime);

    std::memcpy(buffer.data(runtime), tensor.data_ptr(), byteLength);

    auto type = tensor.dtype();
    std::string typedArrayName;
    if (type == torch_::kUInt8) {
      typedArrayName = "Uint8Array";
    } else if (type == torch_::kInt8) {
      typedArrayName = "Int8Array";
    } else if (type == torch_::kInt16) {
      typedArrayName = "Int16Array";
    } else if (type == torch_::kInt32) {
      typedArrayName = "Int32Array";
    } else if (type == torch_::kInt64) {
      typedArrayName = "BigInt64Array";
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
  } else if (name == DTYPE) {
    return jsi::String::createFromUtf8(
        runtime,
        utils::constants::getStringFromDtype(
            caffe2::typeMetaToScalarType(this->tensor.dtype())));
  } else if (name == SHAPE) {
    return this->size_.call(runtime);
  } else if (name == SIZE) {
    return jsi::Value(runtime, size_);
  } else if (name == TOSTRING) {
    return jsi::Value(runtime, toString_);
  }

  return jsi::Value::undefined();
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
} // namespace torch
} // namespace torchlive
