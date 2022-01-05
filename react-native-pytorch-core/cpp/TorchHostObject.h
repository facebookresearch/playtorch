/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#pragma once

#import <jsi/jsi.h>

namespace torchlive {
namespace core {

using namespace facebook;

class JSI_EXPORT TorchHostObject : public jsi::HostObject {
 public:
  explicit TorchHostObject() {}

 public:
  jsi::Value get(jsi::Runtime&, const jsi::PropNameID& name) override;
  std::vector<jsi::PropNameID> getPropertyNames(jsi::Runtime& rt) override;
};

} // namespace core
} // namespace torchlive
