/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include <jsi/jsi.h>

#include "torchlive.h"
#include "torchlive/media/NativeJSRefBridgeHostObject.h"
#include "torchlive/torch/TorchHostObject.h"

namespace torchlive {

using namespace facebook;

void install(jsi::Runtime& runtime) {
  auto torchObject =
      std::make_shared<torchlive::torch::TorchHostObject>(runtime);
  auto torch = jsi::Object::createFromHostObject(runtime, torchObject);
  runtime.global().setProperty(runtime, "torch", std::move(torch));

  auto nativeJSRefBridgeObject =
      std::make_shared<torchlive::media::NativeJSRefBridgeHostObject>(runtime);
  auto nativeJSRefBridge =
      jsi::Object::createFromHostObject(runtime, nativeJSRefBridgeObject);
  runtime.global().setProperty(
      runtime,
      "__torchlive__NativeJSRefBridge__",
      std::move(nativeJSRefBridge));
}

} // namespace torchlive
