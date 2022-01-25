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

#include "TensorHostObject.h"
#include "TorchHostObject.h"
#include "jit/JITHostObject.h"

// Namespace alias for torch to avoid namespace conflicts with torchlive::torch
namespace torch_ = torch;

namespace torchlive {
namespace torch {

std::vector<jsi::PropNameID> TorchHostObject::getPropertyNames(
    jsi::Runtime& rt) {
  std::vector<jsi::PropNameID> result;
  result.push_back(jsi::PropNameID::forUtf8(rt, std::string("argmax")));
  result.push_back(jsi::PropNameID::forUtf8(rt, std::string("rand")));
  return result;
}

jsi::Value TorchHostObject::get(
    jsi::Runtime& runtime,
    const jsi::PropNameID& propName) {
  auto name = propName.utf8(runtime);

  if (name == "jit") {
    auto jitHostObject =
        std::make_shared<torchlive::torch::jit::JITHostObject>();
    return jsi::Object::createFromHostObject(runtime, jitHostObject);
  } else if (name == "rand") {
    auto rand = [this](
                    jsi::Runtime& runtime,
                    const jsi::Value& thisValue,
                    const jsi::Value* arguments,
                    size_t count) -> jsi::Value {
      int x = arguments[0].getNumber();
      auto tensor = torch_::rand({x});
      auto tensorHostObject =
          std::make_shared<torchlive::torch::TensorHostObject>(tensor);
      return jsi::Object::createFromHostObject(runtime, tensorHostObject);
    };
    return jsi::Function::createFromHostFunction(
        runtime, jsi::PropNameID::forUtf8(runtime, "rand"), 1, rand);
  } else if (name == "argmax") {
    auto argmax = [this](
                      jsi::Runtime& runtime,
                      const jsi::Value& thisValue,
                      const jsi::Value* arguments,
                      size_t count) -> jsi::Value {
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
        runtime, jsi::PropNameID::forUtf8(runtime, "argmax"), 1, argmax);
  }

  return jsi::Value::undefined();
}

} // namespace torch
} // namespace torchlive
