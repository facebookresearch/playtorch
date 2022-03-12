/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#pragma once

#include <jsi/jsi.h>

#include <torch/csrc/jit/mobile/module.h>

#include "../../../torchlive.h"

// Namespace alias for torch to avoid namespace conflicts with torchlive::torch
namespace torch_ = torch;

namespace torchlive {
namespace torch {
namespace jit {

class JSI_EXPORT JITHostObject : public facebook::jsi::HostObject {
  facebook::jsi::Function _loadForMobile_;
  facebook::jsi::Function _loadForMobileAsync_;

 public:
  explicit JITHostObject(
      facebook::jsi::Runtime& runtime,
      torchlive::RuntimeExecutor runtimeExecutor);

  facebook::jsi::Value get(
      facebook::jsi::Runtime&,
      const facebook::jsi::PropNameID& name) override;
  std::vector<facebook::jsi::PropNameID> getPropertyNames(
      facebook::jsi::Runtime& rt) override;

 private:
  static std::string _loadForMobilePreWork(
      facebook::jsi::Runtime& runtime,
      const facebook::jsi::Value& thisValue,
      const facebook::jsi::Value* arguments,
      size_t count);
  static torch_::jit::mobile::Module _loadForMobileWork(
      const std::string& modelPath);
  static jsi::Value _loadForMobilePostWork(
      jsi::Runtime& runtime,
      torchlive::RuntimeExecutor runtimeExecutor,
      torch_::jit::mobile::Module m);
  static facebook::jsi::Function create_LoadForMobile(
      facebook::jsi::Runtime& runtime,
      torchlive::RuntimeExecutor runtimeExecutor);
  static facebook::jsi::Function create_LoadForMobileAsync(
      facebook::jsi::Runtime& runtime,
      torchlive::RuntimeExecutor runtimeExecutor);
};

} // namespace jit
} // namespace torch
} // namespace torchlive
