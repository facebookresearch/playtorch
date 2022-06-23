/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#pragma once

#include <jsi/jsi.h>

#include <functional>

#include "../Promise.h"
#include "../ThreadPool.h"
#include "../torchlive.h"

namespace torchlive {
namespace common {

// This class template describes a type that can perform work on a separate
// thread, as well as default implementations for both a synchronous and
// asynchronous Promise-based implementation of jsi::HostFunctionType. Note that
// setupFunc and resolveFunc are passed a jsi::Runtime reference and run on
// React Native's JavaScript thread, but workFunc runs on a separate thread and
// can not safely access jsi::Runtime.
template <class TSetupResultType, class TWorkResultType>
class AsyncTask {
 public:
  using SetupResultType = TSetupResultType;

  using WorkResultType = TWorkResultType;

  using SetupFunctionType = std::function<SetupResultType(
      facebook::jsi::Runtime& runtime,
      const facebook::jsi::Value& thisValue,
      const facebook::jsi::Value* arguments,
      size_t count)>;

  using WorkFunctionType =
      std::function<WorkResultType(SetupResultType&& inputs)>;

  using ResolveFunctionType = std::function<facebook::jsi::Value(
      facebook::jsi::Runtime& runtime,
      RuntimeExecutor runtimeExecutor,
      WorkResultType&& inputs)>;

  AsyncTask(
      SetupFunctionType setupFunc,
      WorkFunctionType workFunc,
      ResolveFunctionType resolveFunc)
      : setupFunc_(setupFunc), workFunc_(workFunc), resolveFunc_(resolveFunc) {}

  facebook::jsi::HostFunctionType syncFunc(RuntimeExecutor runtimeExecutor);

  facebook::jsi::HostFunctionType asyncPromiseFunc(
      RuntimeExecutor runtimeExecutor) {
    return createPromiseFunction(
        runtimeExecutor, setupFunc_, workFunc_, resolveFunc_);
  }

  static facebook::jsi::HostFunctionType createPromiseFunction(
      RuntimeExecutor runtimeExecutor,
      SetupFunctionType setupFunc,
      WorkFunctionType workFunc,
      ResolveFunctionType resolveFunc);

 private:
  SetupFunctionType setupFunc_;
  WorkFunctionType workFunc_;
  ResolveFunctionType resolveFunc_;
};

template <class TSetupResultType, class TWorkResultType>
facebook::jsi::HostFunctionType
AsyncTask<TSetupResultType, TWorkResultType>::syncFunc(
    RuntimeExecutor runtimeExecutor) {
  return [=](facebook::jsi::Runtime& runtime,
             const facebook::jsi::Value& thisValue,
             const facebook::jsi::Value* arguments,
             size_t count) -> facebook::jsi::Value {
    auto setupResult = setupFunc_(runtime, thisValue, arguments, count);
    auto workResult = workFunc_(std::move(setupResult));
    return resolveFunc_(runtime, runtimeExecutor, std::move(workResult));
  };
}

template <class TSetupResultType, class TWorkResultType>
facebook::jsi::HostFunctionType
AsyncTask<TSetupResultType, TWorkResultType>::createPromiseFunction(
    RuntimeExecutor runtimeExecutor,
    SetupFunctionType setupFunc,
    WorkFunctionType workFunc,
    ResolveFunctionType resolveFunc) {
  return [=](facebook::jsi::Runtime& runtime,
             const facebook::jsi::Value& thisValue,
             const facebook::jsi::Value* arguments,
             size_t count) {
    SetupResultType setupResult;
    std::shared_ptr<Promise> promise;
    // Perform setupFunc within the Promise constructor so errors are captured
    // like they would be in an "async" JavaScript function.
    auto promiseValue = createPromiseAsJSIValue(
        runtime,
        [&](facebook::jsi::Runtime& promiseRuntime,
            std::shared_ptr<Promise> p) {
          setupResult = setupFunc(promiseRuntime, thisValue, arguments, count);
          promise = std::move(p);
        });

    if (promise == nullptr) {
      // The JS Promise would have been rejected if exception thrown in
      // setupFunc, thus lead to exception thrown in the JS Thread.
      return promiseValue;
    }

    // Start work on a separate thread.
    auto threadFunc = [=, setupResult = std::move(setupResult)]() mutable {
      WorkResultType workResult;
      bool error = false;

      try {
        workResult = workFunc(std::move(setupResult));
      } catch (std::exception& e) {
        error = true;
        // Report the error on the JavaScript thread.
        runtimeExecutor(
            [=, m = e.what()](facebook::jsi::Runtime&) { promise->reject(m); });
      }

      if (!error) {
        // Resolve promise on the JavaScript thread.
        runtimeExecutor([=, workResult = std::move(workResult)](
                            facebook::jsi::Runtime& runtime) mutable {
          try {
            auto resolveResult =
                resolveFunc(runtime, runtimeExecutor, std::move(workResult));
            promise->resolve(std::move(resolveResult));
          } catch (std::exception& e) {
            promise->reject(e.what());
          }
        });
      }
    };

    torchlive::ThreadPool::pool()->run(threadFunc);

    return promiseValue;
  };
}

} // namespace common
} // namespace torchlive
