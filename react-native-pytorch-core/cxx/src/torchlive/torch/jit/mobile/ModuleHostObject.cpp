/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include <torch/csrc/jit/mobile/module.h>
#include <utility>

#include "../../../Promise.h"
#include "../../IValueHostObject.h"
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
static const std::string FORWARD_SYNC = "forwardSync";

// ModuleHostObject Methods
const std::vector<std::string> METHODS = {FORWARD, FORWARD_SYNC};

// ModuleHostObject Property Names
// empty

// ModuleHostObject Properties
static const std::vector<std::string> PROPERTIES = {};

ModuleHostObject::ModuleHostObject(
    jsi::Runtime& runtime,
    torchlive::RuntimeExecutor runtimeExecutor,
    torch_::jit::mobile::Module m)
    : forward_(createForward(runtime)),
      forwardSync_(createForwardSync(runtime)),
      runtimeExecutor_(runtimeExecutor),
      module_(m) {}

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
  } else if (name == FORWARD_SYNC) {
    return jsi::Value(runtime, forwardSync_);
  }

  return jsi::Value::undefined();
}

std::vector<torch_::jit::IValue> ModuleHostObject::forwardPreWork(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  if (count < 1) {
    throw jsi::JSError(runtime, "At least 1 arg is expected");
  }

  std::vector<torch_::jit::IValue> inputs;
  for (int i = 0; i < count; i++) {
    // TODO(T111480077) Allow at::IValue more generally
    auto tensorHostObject = utils::helpers::parseTensor(runtime, &arguments[i]);
    if (tensorHostObject == nullptr) {
      throw jsi::JSError(runtime, "Object is not a TensorHostObject");
    }

    auto tensor = tensorHostObject->tensor;
    inputs.push_back(tensor);
  }

  return inputs;
}

torch_::jit::IValue ModuleHostObject::forwardWork(
    torch_::jit::mobile::Module m,
    std::vector<torch_::jit::IValue> inputs) {
  LiteJITCallGuard guard;
  return m.forward(inputs);
}

jsi::Value ModuleHostObject::forwardPostWork(
    jsi::Runtime& runtime,
    torch_::jit::IValue value) {
  auto valueHostObject =
      std::make_shared<torchlive::torch::IValueHostObject>(runtime, value);
  return jsi::Object::createFromHostObject(runtime, valueHostObject);
}

jsi::Function ModuleHostObject::createForward(jsi::Runtime& runtime) {
  auto forwardFunc = [this](
                         jsi::Runtime& rt,
                         const jsi::Value& thisValue,
                         const jsi::Value* arguments,
                         size_t count) -> jsi::Value {
    return createPromiseAsJSIValue(
        rt, [&](jsi::Runtime& rt2, std::shared_ptr<Promise> promise) {
          auto inputs = forwardPreWork(rt2, thisValue, arguments, count);
          auto fn = [runtimeExecutor = runtimeExecutor_,
                     m = module_,
                     inputs = std::move(inputs),
                     promise = std::move(promise)]() {
            auto outputs = forwardWork(m, std::move(inputs));
            runtimeExecutor([outputs = std::move(outputs),
                             promise = std::move(promise)](jsi::Runtime& rt3) {
              auto result = forwardPostWork(rt3, std::move(outputs));
              promise->resolve(result);
            });
          };
          std::thread t(fn);
          t.detach();
        });
  };
  return jsi::Function::createFromHostFunction(
      runtime, jsi::PropNameID::forUtf8(runtime, FORWARD), 1, forwardFunc);
}

jsi::Function ModuleHostObject::createForwardSync(jsi::Runtime& runtime) {
  auto forwardSyncFunc = [this](
                             jsi::Runtime& runtime,
                             const jsi::Value& thisValue,
                             const jsi::Value* arguments,
                             size_t count) -> jsi::Value {
    auto inputs = forwardPreWork(runtime, thisValue, arguments, count);
    auto outputs = forwardWork(module_, std::move(inputs));
    auto result = forwardPostWork(runtime, std::move(outputs));
    return result;
  };
  return jsi::Function::createFromHostFunction(
      runtime,
      jsi::PropNameID::forUtf8(runtime, FORWARD_SYNC),
      1,
      forwardSyncFunc);
}

} // namespace mobile
} // namespace jit
} // namespace torch
} // namespace torchlive
