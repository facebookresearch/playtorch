/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include <jsi/jsi.h>

#include <ReactCommon/CallInvoker.h>
#include <ReactCommon/CallInvokerHolder.h>
#include <ReactCommon/RuntimeExecutor.h>
#include <fbjni/fbjni.h>
#include <jni.h>
#include <react/jni/JRuntimeExecutor.h>

#include "torchlive/torchlive.h"

using namespace facebook;

namespace {

class PyTorchCoreJSIModule : public jni::JavaClass<PyTorchCoreJSIModule> {
 public:
  static constexpr auto kJavaDescriptor =
      "Lorg/pytorch/rn/core/jsi/PyTorchCoreJSIModule;";

  static void registerNatives() {
    javaClassStatic()->registerNatives({
        makeNativeMethod("nativeInstall", PyTorchCoreJSIModule::nativeInstall),
    });
  }

 private:
  static void nativeInstall(
      jni::alias_ref<PyTorchCoreJSIModule>,
      jlong jsi,
      jni::alias_ref<
          react::JRuntimeExecutor::javaobject> /* jRuntimeExecutor */,
      jni::alias_ref<react::CallInvokerHolder::javaobject>
          jsCallInvokerHolder) {
    auto runtime = reinterpret_cast<jsi::Runtime*>(jsi);
    if (runtime) {
      // TODO(T113931827): we want RuntimeExecutor. However RN 0.64.3 on Android
      // does not flush the executor. iOS works. This workaround builds on
      // JSCallInvoker::invokeAsync which flushes. Remove after update to RN
      // 0.65, with an option to flush, or RN 0.66, which shes by default. See
      // https://github.com/facebook/react-native/commit/c0ec82e61eb464b38b912ce54f2678e308ad8d10
      // https://github.com/facebook/react-native/commit/281daf12222d3b5d92120b654d421e711d48fd0a
      //
      // auto runtimeExecutor = jRuntimeExecutor->cthis()->get();
      auto jsCallInvoker = jsCallInvokerHolder->cthis()->getCallInvoker();
      std::weak_ptr<react::CallInvoker> weakJsCallInvoker = jsCallInvoker;
      auto runtimeExecutor =
          [runtime, weakJsCallInvoker](
              std::function<void(jsi::Runtime & runtime)>&& callback) {
            if (auto strongJsCallInvoker = weakJsCallInvoker.lock()) {
              strongJsCallInvoker->invokeAsync(
                  [runtime, callback = std::move(callback)]() {
                    callback(*runtime);
                  });
            }
          };

      torchlive::install(*runtime, std::move(runtimeExecutor));
    }
  }
};

} // namespace

JNIEXPORT jint JNICALL JNI_OnLoad(JavaVM* vm, void* reserved) {
  return jni::initialize(vm, [] { PyTorchCoreJSIModule::registerNatives(); });
}
