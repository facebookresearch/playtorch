/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include <jsi/jsi.h>
#include <vector>

#include <ATen/NativeFunctions.h>
#include <torch/script.h>
#include <string>

#include "../media/BlobHostObject.h"
#include "TensorHostObject.h"
#include "TorchHostObject.h"
#include "jit/JITHostObject.h"
#include "utils/constants.h"
#include "utils/helpers.h"

// Namespace alias for torch to avoid namespace conflicts with torchlive::torch
namespace torch_ = torch;

namespace torchlive {
namespace torch {

using namespace facebook;

// TorchHostObject Method Name
static const std::string ADD = "add";
static const std::string ARANGE = "arange";
static const std::string ARGMAX = "argmax";
static const std::string EMPTY = "empty";
static const std::string FROM_BLOB = "fromBlob";
static const std::string RAND = "rand";
static const std::string RANDINT = "randint";
static const std::string SUB = "sub";

// TorchHostObject Property Names
static const std::string JIT = "jit";

// TorchHostObject Properties
static const std::vector<std::string> PROPERTIES = {
    utils::constants::FLOAT32,
    utils::constants::FLOAT64,
    utils::constants::FLOAT64,
    utils::constants::FLOAT64,
    utils::constants::FLOAT64,
    utils::constants::FLOAT64,
    utils::constants::FLOAT64,
    utils::constants::INT16,
    utils::constants::INT32,
    utils::constants::INT64,
    utils::constants::INT8,
    utils::constants::UINT8,
    JIT,
};

// TorchHostObject Methods
const std::vector<std::string> METHODS =
    {ARGMAX, EMPTY, FROM_BLOB, RAND, RANDINT};

TorchHostObject::TorchHostObject(jsi::Runtime& runtime)
    : add_(createAdd(runtime)),
      arange_(createArange(runtime)),
      argmax_(createArgmax(runtime)),
      empty_(createEmpty(runtime)),
      fromBlob_(createFromBlob(runtime)),
      rand_(createRand(runtime)),
      randint_(createRandint(runtime)),
      sub_(createSub(runtime)) {}

std::vector<jsi::PropNameID> TorchHostObject::getPropertyNames(
    jsi::Runtime& rt) {
  std::vector<jsi::PropNameID> result;
  for (std::string property : PROPERTIES) {
    result.push_back(jsi::PropNameID::forUtf8(rt, property));
  }

  for (std::string method : METHODS) {
    result.push_back(jsi::PropNameID::forUtf8(rt, method));
  }
  return result;
}

jsi::Value TorchHostObject::get(
    jsi::Runtime& runtime,
    const jsi::PropNameID& propName) {
  auto name = propName.utf8(runtime);

  if (name == ADD) {
    return jsi::Value(runtime, add_);
  } else if (name == ARANGE) {
    return jsi::Value(runtime, arange_);
  } else if (name == ARGMAX) {
    return jsi::Value(runtime, argmax_);
  } else if (name == EMPTY) {
    return jsi::Value(runtime, empty_);
  } else if (
      name == utils::constants::FLOAT32 || name == utils::constants::FLOAT32) {
    return jsi::String::createFromAscii(runtime, utils::constants::FLOAT32);
  } else if (
      name == utils::constants::FLOAT64 || name == utils::constants::DOUBLE) {
    return jsi::String::createFromAscii(runtime, utils::constants::FLOAT64);
  } else if (name == utils::constants::INT8) {
    return jsi::String::createFromAscii(runtime, utils::constants::INT8);
  } else if (name == FROM_BLOB) {
    return jsi::Value(runtime, fromBlob_);
  } else if (
      name == utils::constants::INT16 || name == utils::constants::SHORT) {
    return jsi::String::createFromAscii(runtime, utils::constants::INT16);
  } else if (name == utils::constants::INT32 || name == utils::constants::INT) {
    return jsi::String::createFromAscii(runtime, utils::constants::INT32);
  } else if (
      name == utils::constants::INT64 || name == utils::constants::LONG) {
    return jsi::String::createFromAscii(runtime, utils::constants::INT64);
  } else if (name == JIT) {
    auto jitHostObject =
        std::make_shared<torchlive::torch::jit::JITHostObject>();
    return jsi::Object::createFromHostObject(runtime, jitHostObject);
  } else if (name == RAND) {
    return jsi::Value(runtime, rand_);
  } else if (name == RANDINT) {
    return jsi::Value(runtime, randint_);
  } else if (name == SUB) {
    return jsi::Value(runtime, sub_);
  } else if (name == utils::constants::UINT8) {
    return jsi::String::createFromAscii(runtime, utils::constants::UINT8);
  }

  return jsi::Value::undefined();
}

jsi::Function TorchHostObject::createAdd(jsi::Runtime& runtime) {
  auto addFunc = [](jsi::Runtime& runtime,
                    const jsi::Value& thisValue,
                    const jsi::Value* arguments,
                    size_t count) {
    torchlive::torch::TensorHostObject* operand1Tensor = nullptr;
    torchlive::torch::TensorHostObject* operand2Tensor = nullptr;
    double* operand2Number = nullptr;
    utils::helpers::parseArithmeticOperands(
        runtime,
        arguments,
        count,
        &operand1Tensor,
        &operand2Tensor,
        &operand2Number);

    torch_::Tensor resultTensor;
    if (operand2Number != nullptr) {
      resultTensor = torch_::add(operand1Tensor->tensor, *operand2Number);
    } else {
      resultTensor =
          torch_::add(operand1Tensor->tensor, operand2Tensor->tensor);
    }
    auto tensorHostObject =
        std::make_shared<torchlive::torch::TensorHostObject>(
            runtime, resultTensor);

    return jsi::Object::createFromHostObject(runtime, tensorHostObject);
  };

  return jsi::Function::createFromHostFunction(
      runtime, jsi::PropNameID::forUtf8(runtime, ADD), 1, addFunc);
}

jsi::Function TorchHostObject::createArange(jsi::Runtime& runtime) {
  auto arangeImpl = [](jsi::Runtime& runtime,
                       const jsi::Value& thisValue,
                       const jsi::Value* arguments,
                       size_t count) {
    if (count == 0) {
      throw jsi::JSError(runtime, "This function requires at least 1 argument");
    }

    auto end = (count > 1) ? arguments[1].asNumber() : arguments[0].asNumber();
    auto start = (count > 1) ? arguments[0].asNumber() : 0;
    auto step = (count > 2) ? arguments[2].asNumber() : 1;

    auto tensor = torch_::arange(start, end, step);

    auto tensorHostObject =
        std::make_shared<torchlive::torch::TensorHostObject>(runtime, tensor);
    return jsi::Object::createFromHostObject(runtime, tensorHostObject);
  };
  return jsi::Function::createFromHostFunction(
      runtime, jsi::PropNameID::forUtf8(runtime, ARANGE), 1, arangeImpl);
}

jsi::Function TorchHostObject::createRand(jsi::Runtime& runtime) {
  auto randImpl = [](jsi::Runtime& runtime,
                     const jsi::Value& thisValue,
                     const jsi::Value* arguments,
                     size_t count) {
    jsi::Array jsShape = arguments[0].asObject(runtime).asArray(runtime);
    auto shapeLength = jsShape.size(runtime);
    std::vector<int64_t> dims = {};
    for (int i = 0; i < shapeLength; i++) {
      int x = jsShape.getValueAtIndex(runtime, i).asNumber();
      dims.push_back(x);
    }

    torch_::TensorOptions tensorOptions =
        utils::helpers::parseTensorOptions(runtime, arguments, 1, count);

    auto tensor = torch_::rand(c10::ArrayRef<int64_t>(dims), tensorOptions);

    auto tensorHostObject =
        std::make_shared<torchlive::torch::TensorHostObject>(runtime, tensor);

    return jsi::Object::createFromHostObject(runtime, tensorHostObject);
  };

  return jsi::Function::createFromHostFunction(
      runtime, jsi::PropNameID::forUtf8(runtime, RAND), 2, randImpl);
}

jsi::Function TorchHostObject::createArgmax(jsi::Runtime& runtime) {
  auto argmaxImpl = [](jsi::Runtime& runtime,
                       const jsi::Value& thisValue,
                       const jsi::Value* arguments,
                       size_t count) {
    auto object = arguments[0].asObject(runtime);
    if (!object.isHostObject(runtime)) {
      throw std::runtime_error("first argument must be a tensor");
    }

    auto hostObject = object.getHostObject(runtime);
    auto tensorHostObject =
        dynamic_cast<torchlive::torch::TensorHostObject*>(hostObject.get());
    if (tensorHostObject != nullptr) {
      auto tensor = tensorHostObject->tensor;
      auto max = torch_::argmax(tensor);
      return jsi::Value(max.item<int>());
    } else {
      // It's a different kind of HostObject, which is not supported.
      throw std::runtime_error("unkown HostObject");
    }
  };

  return jsi::Function::createFromHostFunction(
      runtime, jsi::PropNameID::forUtf8(runtime, ARGMAX), 1, argmaxImpl);
}

jsi::Function TorchHostObject::createEmpty(jsi::Runtime& runtime) {
  auto emptyFunc = [](jsi::Runtime& runtime,
                      const jsi::Value& thisValue,
                      const jsi::Value* arguments,
                      size_t count) {
    if (count == 0) {
      throw jsi::JSError(
          runtime, "This function requires at least one argument.");
    }
    std::vector<int64_t> dimensions = {};
    int nextArgumentIndex =
        utils::helpers::parseSize(runtime, arguments, 0, count, &dimensions);

    torch_::TensorOptions tensorOptions = utils::helpers::parseTensorOptions(
        runtime, arguments, nextArgumentIndex, count);
    auto tensor =
        torch_::empty(c10::ArrayRef<int64_t>(dimensions), tensorOptions);
    auto tensorHostObject =
        std::make_shared<torchlive::torch::TensorHostObject>(runtime, tensor);
    return jsi::Object::createFromHostObject(runtime, tensorHostObject);
  };

  return jsi::Function::createFromHostFunction(
      runtime, jsi::PropNameID::forUtf8(runtime, EMPTY), 1, emptyFunc);
}

jsi::Function TorchHostObject::createFromBlob(jsi::Runtime& runtime) {
  auto fromBlobImpl = [](jsi::Runtime& runtime,
                         const jsi::Value& thisValue,
                         const jsi::Value* arguments,
                         size_t count) {
    if (count < 2) {
      throw jsi::JSError(
          runtime, "This function requires at least 2 arguments");
    }

    if (!arguments[1].isObject() ||
        !arguments[1].asObject(runtime).isArray(runtime)) {
      throw jsi::JSError(runtime, "Arg 2 should be an array of numbers");
    }

    // We are not using utils::helpers::parseSize here because the
    // torch::from_blob is only available in C++ and doesn't support sizes as
    // variadics.
    jsi::Array jsSizes = arguments[1].asObject(runtime).asArray(runtime);
    auto sizesLength = jsSizes.size(runtime);
    std::vector<int64_t> sizes;
    sizes.reserve(sizesLength);
    for (int i = 0; i < sizesLength; i++) {
      auto value = jsSizes.getValueAtIndex(runtime, i);
      if (value.isNumber()) {
        sizes.push_back(value.asNumber());
      } else {
        throw jsi::JSError(runtime, "Input should be an array of numbers");
      }
    }

    torch_::TensorOptions tensorOptions =
        torch_::TensorOptions().dtype(torch_::kUInt8);

    auto hostObject = arguments[0].asObject(runtime).asHostObject(runtime);
    auto blobHostObject =
        dynamic_cast<torchlive::media::BlobHostObject*>(hostObject.get());
    if (blobHostObject != nullptr) {
      auto blob = blobHostObject->blob;

      uint8_t* const buffer = blob.getDirectBytes();
      auto size = blob.getDirectSize();
      // TODO(T111718110) Check if blob sizes exceed buffer size and if so throw
      // an error

      auto options = torch_::TensorOptions().dtype(torch_::kUInt8);
      auto tensor = torch_::from_blob(buffer, sizes, options).clone();

      auto tensorHostObject =
          std::make_shared<torchlive::torch::TensorHostObject>(runtime, tensor);
      return jsi::Object::createFromHostObject(runtime, tensorHostObject);
    } else {
      throw jsi::JSError(
          runtime, "The fromBlob function only works with BlobHostObject");
    }
  };
  return jsi::Function::createFromHostFunction(
      runtime, jsi::PropNameID::forUtf8(runtime, FROM_BLOB), 1, fromBlobImpl);
}

jsi::Function TorchHostObject::createRandint(jsi::Runtime& runtime) {
  auto randintImpl = [](jsi::Runtime& runtime,
                        const jsi::Value& thisValue,
                        const jsi::Value* arguments,
                        size_t count) {
    if (count < 2) {
      throw jsi::JSError(
          runtime, "This function requires at least 2 arguments");
    }

    auto low = 0;
    auto high = 0;
    jsi::Array size = jsi::Array::createWithElements(runtime, {});
    if (count == 2) {
      high = arguments[0].asNumber();
      size = arguments[1].asObject(runtime).asArray(runtime);
    } else {
      low = arguments[0].asNumber();
      high = arguments[1].asNumber();
      size = arguments[2].asObject(runtime).asArray(runtime);
    }

    auto shapeLength = size.size(runtime);
    std::vector<int64_t> dims = {};
    for (int i = 0; i < shapeLength; i++) {
      int x = size.getValueAtIndex(runtime, i).asNumber();
      dims.push_back(x);
    }
    auto tensor = torch_::randint(low, high, dims);

    auto tensorHostObject =
        std::make_shared<torchlive::torch::TensorHostObject>(runtime, tensor);
    return jsi::Object::createFromHostObject(runtime, tensorHostObject);
  };
  return jsi::Function::createFromHostFunction(
      runtime, jsi::PropNameID::forUtf8(runtime, RANDINT), 1, randintImpl);
}

jsi::Function TorchHostObject::createSub(jsi::Runtime& runtime) {
  auto subFunc = [](jsi::Runtime& runtime,
                    const jsi::Value& thisValue,
                    const jsi::Value* arguments,
                    size_t count) {
    torchlive::torch::TensorHostObject* operand1 = nullptr;
    torchlive::torch::TensorHostObject* operand2Tensor = nullptr;
    double* operand2Number = nullptr;
    utils::helpers::parseArithmeticOperands(
        runtime, arguments, count, &operand1, &operand2Tensor, &operand2Number);

    torch_::Tensor resultTensor;
    if (operand2Number != nullptr) {
      resultTensor = torch_::sub(operand1->tensor, *operand2Number);
    } else {
      resultTensor = torch_::sub(operand1->tensor, operand2Tensor->tensor);
    }
    auto tensorHostObject =
        std::make_shared<torchlive::torch::TensorHostObject>(
            runtime, resultTensor);

    return jsi::Object::createFromHostObject(runtime, tensorHostObject);
  };

  return jsi::Function::createFromHostFunction(
      runtime, jsi::PropNameID::forUtf8(runtime, SUB), 1, subFunc);
}

} // namespace torch
} // namespace torchlive
