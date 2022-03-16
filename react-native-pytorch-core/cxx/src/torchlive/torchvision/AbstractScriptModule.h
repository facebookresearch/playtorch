/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#pragma once

#include <jsi/jsi.h>

#include <torch/csrc/jit/mobile/module.h>
#include <torch/script.h>

// Namespace alias for torch to avoid namespace conflicts with torchlive::torch
namespace torch_ = torch;

namespace torchlive {
namespace torchvision {
namespace transforms {

class AbstractScriptModule {
 protected:
  torch_::jit::mobile::Module scriptmodule_;

  /**
   * This function loads the operator module from its JIT Script binary.
   * It runs at the first time when the operator is called.
   */
  torch_::jit::mobile::Module loadScriptModule(
      unsigned char* scriptModule,
      unsigned int length);

 public:
  AbstractScriptModule(
      unsigned char* scriptedModule,
      unsigned int scriptModuleLength);

  // prevent implicit construction of subclasses.
  AbstractScriptModule(const AbstractScriptModule&) = delete;
  AbstractScriptModule& operator=(const AbstractScriptModule&) = delete;

  virtual ~AbstractScriptModule() = default;

  /**
   * This overriden function parse the parameters for each operator.
   * The params will be used everytime it is applied on new input (i.e. tensor)
   */
  virtual std::vector<torch_::jit::IValue> parseParameters(
      facebook::jsi::Runtime& runtime,
      const facebook::jsi::Value& thisValue,
      const facebook::jsi::Value* arguments,
      size_t count) = 0;

  /**
   * This function, if not overriden, parses the input to the operator.
   * Most of the time if will be a tensor
   */
  std::vector<torch_::jit::IValue> parseInput(
      facebook::jsi::Runtime& runtime,
      const facebook::jsi::Value& thisValue,
      const facebook::jsi::Value* arguments,
      size_t count);

  /**
   * This function apply the operator on the inputs.
   */
  c10::IValue forward(std::vector<torch_::jit::IValue> inputs);
};

} // namespace transforms
} // namespace torchvision
} // namespace torchlive
