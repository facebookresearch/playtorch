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

// Namespace alias for torch to avoid namespace conflicts with torchlive::torch
namespace torch_ = torch;

namespace torchlive {
namespace torch {

using namespace facebook;

class JSI_EXPORT TensorHostObject : public jsi::HostObject {
  jsi::Function abs_;
  jsi::Function add_;
  jsi::Function argmax_;
  jsi::Function div_;
  jsi::Function mul_;
  jsi::Function size_;
  jsi::Function squeeze_;
  jsi::Function toString_;
  jsi::Function unsqueeze_;

 public:
  explicit TensorHostObject(jsi::Runtime& runtime, torch_::Tensor t);
  ~TensorHostObject();

  jsi::Value get(jsi::Runtime&, const jsi::PropNameID& name) override;
  std::vector<jsi::PropNameID> getPropertyNames(jsi::Runtime& rt) override;

  torch_::Tensor tensor;

 private:
  jsi::Function createAbs(jsi::Runtime& runtime);
  jsi::Function createAdd(jsi::Runtime& runtime);
  jsi::Function createArgmax(jsi::Runtime& runtime);
  jsi::Function createDiv(jsi::Runtime& runtime);
  jsi::Function createMul(jsi::Runtime& runtime);
  jsi::Function createSize(jsi::Runtime& runtime);
  jsi::Function createToString(jsi::Runtime& runtime);
  jsi::Function createSqueeze(jsi::Runtime& runtime);
  jsi::Function createUnsqueeze(jsi::Runtime& runtime);
};

} // namespace torch
} // namespace torchlive
