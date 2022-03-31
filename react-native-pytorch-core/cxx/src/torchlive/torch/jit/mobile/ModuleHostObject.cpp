/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include <torch/csrc/jit/mobile/module.h>
#include <utility>

#include "../../../Promise.h"
#include "../../../ThreadPool.h"
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

std::vector<torch_::jit::IValue> forwardPreWork(
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

torch_::jit::IValue forwardWork(
    torch_::jit::mobile::Module m,
    std::vector<torch_::jit::IValue> inputs) {
  LiteJITCallGuard guard;
  return m.forward(inputs);
}

jsi::Value forwardPostWork(jsi::Runtime& runtime, torch_::jit::IValue value) {
  auto valueHostObject =
      std::make_shared<torchlive::torch::IValueHostObject>(runtime, value);
  return jsi::Object::createFromHostObject(runtime, valueHostObject);
}

jsi::HostFunctionType forwardImpl(
    jsi::Runtime& runtime,
    RuntimeExecutor runtimeExecutor) {
  return [runtimeExecutor](
             jsi::Runtime& rt,
             const jsi::Value& thisValue,
             const jsi::Value* arguments,
             size_t count) -> jsi::Value {
    // Called by JavaScript on the JS thread.
    auto thiz = thisValue.asObject(rt).asHostObject<ModuleHostObject>(rt);
    return createPromiseAsJSIValue(
        rt, [&](jsi::Runtime& rt2, std::shared_ptr<Promise> promise) {
          // Called immediately to create the promise on the JS thread.
          auto inputs = forwardPreWork(rt2, thisValue, arguments, count);
          auto fn = [runtimeExecutor,
                     thiz,
                     inputs = std::move(inputs),
                     promise = std::move(promise)]() {
            // Called from within the new thread. No runtime available.
            auto outputs = forwardWork(thiz->mobileModule, std::move(inputs));
            runtimeExecutor([outputs = std::move(outputs),
                             promise = std::move(promise)](jsi::Runtime& rt3) {
              // Called sometime later, again on the JS thread.
              auto result = forwardPostWork(rt3, std::move(outputs));
              promise->resolve(result);
            });
          };
          torchlive::ThreadPool::pool()->run(fn);
        });
  };
}

jsi::Value forwardSyncImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  auto thiz =
      thisValue.asObject(runtime).asHostObject<ModuleHostObject>(runtime);
  auto inputs = forwardPreWork(runtime, thisValue, arguments, count);
  auto outputs = forwardWork(thiz->mobileModule, std::move(inputs));
  auto result = forwardPostWork(runtime, std::move(outputs));
  return result;
}

ModuleHostObject::ModuleHostObject(
    jsi::Runtime& rt,
    torchlive::RuntimeExecutor rte,
    torch_::jit::mobile::Module m)
    : BaseHostObject(rt), mobileModule(m) {
  setPropertyHostFunction(rt, "forward", 1, forwardImpl(rt, rte));
  setPropertyHostFunction(rt, "forwardSync", 1, forwardSyncImpl);
}

} // namespace mobile
} // namespace jit
} // namespace torch
} // namespace torchlive
