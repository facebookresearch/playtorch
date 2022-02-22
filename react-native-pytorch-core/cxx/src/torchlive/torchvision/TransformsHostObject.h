/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#pragma once

#include <jsi/jsi.h>

namespace torchlive {
namespace torchvision {
namespace transforms {

class JSI_EXPORT TransformsHostObject : public facebook::jsi::HostObject {
 public:
  TransformsHostObject(facebook::jsi::Runtime& runtime);

  facebook::jsi::Value get(
      facebook::jsi::Runtime&,
      const facebook::jsi::PropNameID& name) override;
  std::vector<facebook::jsi::PropNameID> getPropertyNames(
      facebook::jsi::Runtime& rt) override;
};

} // namespace transforms
} // namespace torchvision
} // namespace torchlive
