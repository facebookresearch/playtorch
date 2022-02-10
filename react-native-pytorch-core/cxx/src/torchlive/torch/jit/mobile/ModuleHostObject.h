/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#pragma once

#include <jsi/jsi.h>

#include <torch/csrc/jit/mobile/module.h>

// Namespace alias for torch to avoid namespace conflicts with torchlive::torch
namespace torch_ = torch;

namespace torchlive {
namespace torch {
namespace jit {
namespace mobile {

class JSI_EXPORT ModuleHostObject : public facebook::jsi::HostObject {
  facebook::jsi::Function forward_;

 public:
  explicit ModuleHostObject(
      facebook::jsi::Runtime& runtime,
      torch_::jit::mobile::Module m);

  facebook::jsi::Value get(
      facebook::jsi::Runtime&,
      const facebook::jsi::PropNameID& name) override;
  std::vector<facebook::jsi::PropNameID> getPropertyNames(
      facebook::jsi::Runtime& rt) override;

 private:
  torch_::jit::mobile::Module module_;
  facebook::jsi::Function createForward(facebook::jsi::Runtime& runtime);
};

} // namespace mobile
} // namespace jit
} // namespace torch
} // namespace torchlive
