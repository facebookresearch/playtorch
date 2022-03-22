/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#pragma once

#include <jsi/jsi.h>

#include <torch/csrc/jit/mobile/module.h>

#include "../../../../torchlive.h"

// Namespace alias for torch to avoid namespace conflicts with torchlive::torch
namespace torch_ = torch;

namespace torchlive {
namespace torch {
namespace jit {
namespace mobile {

class JSI_EXPORT ModuleHostObject : public facebook::jsi::HostObject {
  facebook::jsi::Function forward_;
  facebook::jsi::Function forwardSync_;

 public:
  explicit ModuleHostObject(
      facebook::jsi::Runtime& runtime,
      torchlive::RuntimeExecutor runtimeExecutor,
      torch_::jit::mobile::Module m);

  facebook::jsi::Value get(
      facebook::jsi::Runtime&,
      const facebook::jsi::PropNameID& name) override;
  std::vector<facebook::jsi::PropNameID> getPropertyNames(
      facebook::jsi::Runtime& rt) override;

 private:
  torchlive::RuntimeExecutor runtimeExecutor_;
  torch_::jit::mobile::Module module_;

  static std::vector<torch_::jit::IValue> forwardPreWork(
      facebook::jsi::Runtime& runtime,
      const facebook::jsi::Value& thisValue,
      const facebook::jsi::Value* arguments,
      size_t count);
  static torch_::jit::IValue forwardWork(
      torch_::jit::mobile::Module module,
      std::vector<torch_::jit::IValue> inputs);
  static facebook::jsi::Value forwardPostWork(
      facebook::jsi::Runtime& runtime,
      torch_::jit::IValue value);
  facebook::jsi::Function createForward(facebook::jsi::Runtime& runtime);
  facebook::jsi::Function createForwardSync(facebook::jsi::Runtime& runtime);
};

} // namespace mobile
} // namespace jit
} // namespace torch
} // namespace torchlive
