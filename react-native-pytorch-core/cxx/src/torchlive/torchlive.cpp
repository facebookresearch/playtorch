/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include <jsi/jsi.h>

#include "media/MediaNamespace.h"
#include "torch/TorchHostObject.h"
#include "torchlive.h"
#include "torchvision/TorchvisionHostObject.h"
#include "vision/VisionHostObject.h"

namespace torchlive {

using namespace facebook;

void install(jsi::Runtime& runtime, RuntimeExecutor runtimeExecutor) {
  jsi::Object torchliveObject(runtime);

  auto torchObject = std::make_shared<torchlive::torch::TorchHostObject>(
      runtime, runtimeExecutor);
  auto torch = jsi::Object::createFromHostObject(runtime, torchObject);
  torchliveObject.setProperty(runtime, "torch", std::move(torch));

  auto visionObject =
      std::make_shared<torchlive::vision::VisionHostObject>(runtime);
  auto vision = jsi::Object::createFromHostObject(runtime, visionObject);
  torchliveObject.setProperty(runtime, "vision", std::move(vision));

  auto torchvisionObject =
      std::make_shared<torchlive::torchvision::TorchvisionHostObject>(runtime);
  auto torchvision =
      jsi::Object::createFromHostObject(runtime, torchvisionObject);
  torchliveObject.setProperty(runtime, "torchvision", std::move(torchvision));

  auto media = media::buildNamespace(runtime, runtimeExecutor);
  torchliveObject.setProperty(runtime, "media", std::move(media));

  runtime.global().setProperty(
      runtime, "__torchlive__", std::move(torchliveObject));
}

} // namespace torchlive
