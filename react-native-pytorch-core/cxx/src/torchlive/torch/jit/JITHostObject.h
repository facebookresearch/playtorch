/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#pragma once

#include <jsi/jsi.h>

namespace torchlive {
namespace torch {
namespace jit {

using namespace facebook;

class JSI_EXPORT JITHostObject : public jsi::HostObject {
 public:
  explicit JITHostObject() {}

 public:
  jsi::Value get(jsi::Runtime&, const jsi::PropNameID& name) override;
  std::vector<jsi::PropNameID> getPropertyNames(jsi::Runtime& rt) override;
};

} // namespace jit
} // namespace torch
} // namespace torchlive
