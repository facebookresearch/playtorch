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
  facebook::jsi::Function size_;
  facebook::jsi::Function toString_;

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
  facebook::jsi::Function createSize(facebook::jsi::Runtime& runtime);
  facebook::jsi::Function createToString(facebook::jsi::Runtime& runtime);
};

} // namespace torch
} // namespace torchlive
