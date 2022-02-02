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

#include "../constants.h"
#include "TensorHostObject.h"
#include "TorchHostObject.h"
#include "jit/JITHostObject.h"

// Namespace alias for torch to avoid namespace conflicts with torchlive::torch
namespace torch_ = torch;

namespace torchlive {
namespace torch {

// TorchHostObject Method Name
const std::string ARGMAX = "argmax";
const std::string RAND = "rand";

// TorchHostObject Property Names
const std::string JIT = "jit";

// TorchHostObject Properties
const std::vector<std::string> PROPERTIES = {
    constants::FLOAT32,
    constants::FLOAT64,
    constants::FLOAT64,
    constants::FLOAT64,
    constants::FLOAT64,
    constants::FLOAT64,
    constants::FLOAT64,
    constants::INT16,
    constants::INT32,
    constants::INT64,
    constants::INT8,
    constants::UINT8,
    JIT,
};

// TorchHostObject Methods
const std::vector<std::string> METHODS = {ARGMAX, RAND};

TorchHostObject::TorchHostObject(jsi::Runtime& runtime)
    : rand(createRand(runtime)), argmax(createArgmax(runtime)) {}

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

  if (name == ARGMAX) {
    return jsi::Value(runtime, argmax);
  } else if (name == constants::FLOAT32 || name == constants::FLOAT32) {
    return jsi::String::createFromAscii(runtime, constants::FLOAT32);
  } else if (name == constants::FLOAT64 || name == constants::DOUBLE) {
    return jsi::String::createFromAscii(runtime, constants::FLOAT64);
  } else if (name == constants::INT8) {
    return jsi::String::createFromAscii(runtime, constants::INT8);
  } else if (name == constants::INT16 || name == constants::SHORT) {
    return jsi::String::createFromAscii(runtime, constants::INT16);
  } else if (name == constants::INT32 || name == constants::INT) {
    return jsi::String::createFromAscii(runtime, constants::INT32);
  } else if (name == constants::INT64 || name == constants::LONG) {
    return jsi::String::createFromAscii(runtime, constants::INT64);
  } else if (name == JIT) {
    auto jitHostObject =
        std::make_shared<torchlive::torch::jit::JITHostObject>();
    return jsi::Object::createFromHostObject(runtime, jitHostObject);
  } else if (name == RAND) {
    return jsi::Value(runtime, rand);
  } else if (name == constants::UINT8) {
    return jsi::String::createFromAscii(runtime, constants::UINT8);
  }

  return jsi::Value::undefined();
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

    torch_::TensorOptions tensorOptions = torch_::TensorOptions();
    if (count == 2) {
      jsi::Object jsTensorOptions = arguments[1].asObject(runtime);
      std::string dtypeStr = jsTensorOptions.getProperty(runtime, "dtype")
                                 .asString(runtime)
                                 .utf8(runtime);

      tensorOptions =
          tensorOptions.dtype(constants::getDtypeFromString(dtypeStr));
    }

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

} // namespace torch
} // namespace torchlive
