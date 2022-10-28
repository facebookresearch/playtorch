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
#include <torch/csrc/jit/mobile/module.h>
#include <torch/script.h>
#pragma clang diagnostic pop

#include "AbstractScriptModule.h"

// Namespace alias for torch to avoid namespace conflicts with torchlive::torch
namespace torch_ = torch;

namespace torchlive {
namespace torchvision {
namespace transforms {

class CenterCropModule : AbstractScriptModule {
  CenterCropModule(); // private constructor to avoid repeat loading

 public:
  static const std::string moduleName;
  static const int inputCount;
  static const int parameterCount;
  static AbstractScriptModule* getInstance();
  std::vector<torch_::jit::IValue> parseParameters(
      facebook::jsi::Runtime& runtime,
      const facebook::jsi::Value& thisValue,
      const facebook::jsi::Value* arguments,
      size_t count) override;
};

} // namespace transforms
} // namespace torchvision
} // namespace torchlive
