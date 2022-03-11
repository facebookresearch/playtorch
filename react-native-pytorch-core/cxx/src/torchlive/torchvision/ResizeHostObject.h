/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#pragma once

#include <jsi/jsi.h>

#include <torch/csrc/jit/mobile/module.h>
#include <torch/script.h>

// Namespace alias for torch to avoid namespace conflicts with torchlive::torch
namespace torch_ = torch;

namespace torchlive {
namespace torchvision {
namespace transforms {

class JSI_EXPORT ResizeHostObject : public facebook::jsi::HostObject {
  facebook::jsi::Function forward_;
  std::vector<int64_t> shape_;
  torch_::jit::mobile::Module module_;

 public:
  facebook::jsi::Value size;

  explicit ResizeHostObject(
      facebook::jsi::Runtime& runtime,
      const facebook::jsi::Value& size);

  facebook::jsi::Value get(
      facebook::jsi::Runtime&,
      const facebook::jsi::PropNameID& name) override;

  std::vector<facebook::jsi::PropNameID> getPropertyNames(
      facebook::jsi::Runtime& rt) override;

 private:
  facebook::jsi::Function createForward(facebook::jsi::Runtime& runtime);
};

} // namespace transforms
} // namespace torchvision
} // namespace torchlive
