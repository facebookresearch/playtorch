/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#pragma once

#include <jsi/jsi.h>

#include <torch/script.h>

namespace torchlive {
namespace torch {

class JSI_EXPORT IValueHostObject : public facebook::jsi::HostObject {
  facebook::jsi::Function toTensor_;

 public:
  explicit IValueHostObject(facebook::jsi::Runtime& runtime, at::IValue v);

  facebook::jsi::Value get(
      facebook::jsi::Runtime&,
      const facebook::jsi::PropNameID& name) override;
  std::vector<facebook::jsi::PropNameID> getPropertyNames(
      facebook::jsi::Runtime& rt) override;

 private:
  at::IValue value_;
  facebook::jsi::Function createToTensor(facebook::jsi::Runtime& runtime);
};

} // namespace torch
} // namespace torchlive
