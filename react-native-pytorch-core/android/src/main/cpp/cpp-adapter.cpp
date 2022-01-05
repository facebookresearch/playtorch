/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include <jni.h>
#include <jsi/jsi.h>
#include "torchlive.h"

using namespace facebook;
using namespace std;

extern "C" JNIEXPORT void JNICALL
Java_org_pytorch_rn_core_jsi_PyTorchCoreJSIModule_nativeInstall(
    JNIEnv* env,
    jobject thiz,
    jlong jsi) {
  auto runtime = reinterpret_cast<jsi::Runtime*>(jsi);

  if (runtime) {
    torchlive::core::install(*runtime);
  }
}
