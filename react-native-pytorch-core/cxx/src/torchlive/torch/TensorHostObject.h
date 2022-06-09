/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#pragma once

#include <jsi/jsi.h>

#include <ATen/NativeFunctions.h>
#include <torch/script.h>
#include <string>
#include <vector>

#include "../common/BaseHostObject.h"

// Namespace alias for torch to avoid namespace conflicts with torchlive::torch
namespace torch_ = torch;

namespace torchlive {
namespace torch {

class JSI_EXPORT TensorHostObject : public common::BaseHostObject {
  facebook::jsi::Function permute_;
  facebook::jsi::Function size_;
  facebook::jsi::Function softmax_;
  facebook::jsi::Function squeeze_;
  facebook::jsi::Function topk_;
  facebook::jsi::Function toString_;
  facebook::jsi::Function unsqueeze_;

 public:
  explicit TensorHostObject(facebook::jsi::Runtime& runtime, torch_::Tensor t);
  ~TensorHostObject();

  facebook::jsi::Value get(
      facebook::jsi::Runtime&,
      const facebook::jsi::PropNameID& name) override;
  std::vector<facebook::jsi::PropNameID> getPropertyNames(
      facebook::jsi::Runtime& rt) override;

  torch_::Tensor tensor;

 private:
  facebook::jsi::Function createPermute(facebook::jsi::Runtime& runtime);
  facebook::jsi::Function createSize(facebook::jsi::Runtime& runtime);
  facebook::jsi::Function createSoftmax(facebook::jsi::Runtime& runtime);
  facebook::jsi::Function createToString(facebook::jsi::Runtime& runtime);
  facebook::jsi::Function createSqueeze(facebook::jsi::Runtime& runtime);
  facebook::jsi::Function createTopK(facebook::jsi::Runtime& runtime);
  facebook::jsi::Function createUnsqueeze(facebook::jsi::Runtime& runtime);
};

} // namespace torch
} // namespace torchlive
