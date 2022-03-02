/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#pragma once

#include <jsi/jsi.h>

namespace torchlive {
namespace vision {
namespace transforms {

class JSI_EXPORT TransformsHostObject : public facebook::jsi::HostObject {
  facebook::jsi::Function centerCrop_;
  facebook::jsi::Function normalize_;
  facebook::jsi::Function resize_;

 public:
  TransformsHostObject(facebook::jsi::Runtime& runtime);

  facebook::jsi::Value get(
      facebook::jsi::Runtime&,
      const facebook::jsi::PropNameID& name) override;
  std::vector<facebook::jsi::PropNameID> getPropertyNames(
      facebook::jsi::Runtime& rt) override;

 private:
  static facebook::jsi::Function createCenterCrop(
      facebook::jsi::Runtime& runtime);
  static facebook::jsi::Function createNormalize(
      facebook::jsi::Runtime& runtime);
  static facebook::jsi::Function createResize(facebook::jsi::Runtime& runtime);
};

} // namespace transforms
} // namespace vision
} // namespace torchlive
