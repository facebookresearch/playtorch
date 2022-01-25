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
 public:
  explicit TensorHostObject(torch_::Tensor t);
  ~TensorHostObject();

 public:
  jsi::Value get(jsi::Runtime&, const jsi::PropNameID& name) override;
  std::vector<jsi::PropNameID> getPropertyNames(jsi::Runtime& rt) override;

 public:
  torch_::Tensor tensor;
};

} // namespace torch
} // namespace torchlive
