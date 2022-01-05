/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include "torchlive.h"
#include <jsi/jsi.h>
#include "TorchHostObject.h"

namespace torchlive {
namespace core {

using namespace facebook;

void install(jsi::Runtime& jsiRuntime) {
  auto torchObject = std::make_shared<TorchHostObject>();
  auto torch = jsi::Object::createFromHostObject(jsiRuntime, torchObject);
  jsiRuntime.global().setProperty(jsiRuntime, "torch", std::move(torch));
}

} // namespace core
} // namespace torchlive
