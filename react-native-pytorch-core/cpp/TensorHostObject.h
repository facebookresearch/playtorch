/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#pragma once

#include <jsi/jsi.h>
#include <string>
#include <vector>

#include <ATen/NativeFunctions.h>
#include <torch/script.h>

namespace torchlive {
namespace core {

using namespace facebook;

class JSI_EXPORT TensorHostObject : public jsi::HostObject {
 public:
  explicit TensorHostObject(torch::Tensor t);
  ~TensorHostObject();

 public:
  jsi::Value get(jsi::Runtime&, const jsi::PropNameID& name) override;
  std::vector<jsi::PropNameID> getPropertyNames(jsi::Runtime& rt) override;

 public:
  torch::Tensor tensor;
};

} // namespace core
} // namespace torchlive
