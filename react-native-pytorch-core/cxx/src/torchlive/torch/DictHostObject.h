/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#pragma once

#include <jsi/jsi.h>

// Suppress deprecated-declarations error to support Clang/C++17
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"
#include <torch/script.h>
#pragma clang diagnostic pop

namespace torchlive {
namespace torch {

class JSI_EXPORT DictHostObject : public facebook::jsi::HostObject {
 public:
  explicit DictHostObject(c10::Dict<at::IValue, at::IValue> d);

  facebook::jsi::Value get(
      facebook::jsi::Runtime&,
      const facebook::jsi::PropNameID& name) override;
  std::vector<facebook::jsi::PropNameID> getPropertyNames(
      facebook::jsi::Runtime& rt) override;

 private:
  c10::Dict<at::IValue, at::IValue> dict_;
};

} // namespace torch
} // namespace torchlive
