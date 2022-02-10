/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include <jsi/jsi.h>

#include <torch/csrc/jit/mobile/module.h>
#include <torch/script.h>
#include <string>

#include "../../TensorHostObject.h"
#include "../../utils/helpers.h"
#include "ModuleHostObject.h"

// Namespace alias for torch to avoid namespace conflicts with torchlive::torch
namespace torch_ = torch;

namespace torchlive {
namespace torch {
namespace jit {
namespace mobile {

using namespace facebook;

// This construct is borrowed from:
// https://github.com/pytorch/pytorch/blob/master/android/pytorch_android/src/main/cpp/pytorch_jni_lite.cpp#L27-L38
struct LiteJITCallGuard {
  torch_::AutoNonVariableTypeMode non_var_guard;
};

// ModuleHostObject Method Name
static const std::string FORWARD = "forward";

// ModuleHostObject Methods
const std::vector<std::string> METHODS = {FORWARD};

// ModuleHostObject Property Names
// empty

// ModuleHostObject Properties
static const std::vector<std::string> PROPERTIES = {};

ModuleHostObject::ModuleHostObject(
    jsi::Runtime& runtime,
    torch_::jit::mobile::Module m)
    : forward_(createForward(runtime)), module_(m) {}

std::vector<jsi::PropNameID> ModuleHostObject::getPropertyNames(
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

jsi::Value ModuleHostObject::get(
    jsi::Runtime& runtime,
    const jsi::PropNameID& propName) {
  auto name = propName.utf8(runtime);

  if (name == FORWARD) {
    return jsi::Value(runtime, forward_);
  }

  return jsi::Value::undefined();
}

jsi::Function ModuleHostObject::createForward(jsi::Runtime& runtime) {
  auto forwardFunc = [this](
                         jsi::Runtime& runtime,
                         const jsi::Value& thisValue,
                         const jsi::Value* arguments,
                         size_t count) -> jsi::Value {
    if (count < 1) {
      throw jsi::JSError(runtime, "At least 1 arg is expected");
    }

    std::vector<torch_::jit::IValue> inputs;
    for (int i = 0; i < count; i++) {
      // TODO(T111480077) Allow at::IValue more generally
      auto tensorHostObject =
          utils::helpers::parseTensor(runtime, &arguments[i]);
      if (tensorHostObject == nullptr) {
        throw jsi::JSError(runtime, "Object is not a TensorHostObject");
      }

      auto tensor = tensorHostObject->tensor;
      inputs.push_back(tensor);
    }

    auto value = [&]() {
      LiteJITCallGuard guard;
      return this->module_.forward(inputs);
    }();

    return jsi::Value::undefined();
  };
  return jsi::Function::createFromHostFunction(
      runtime, jsi::PropNameID::forUtf8(runtime, FORWARD), 1, forwardFunc);
}

} // namespace mobile
} // namespace jit
} // namespace torch
} // namespace torchlive
