/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include <torch/csrc/jit/mobile/import.h>

#include "../torch/utils/helpers.h"
#include "ATen/core/ivalue.h"
#include "AbstractScriptModule.h"

namespace torchlive {
namespace torchvision {
namespace transforms {

using namespace facebook;

AbstractScriptModule::AbstractScriptModule(
    unsigned char* scriptedModule,
    unsigned int scriptModuleLength)
    : scriptmodule_(loadScriptModule(scriptedModule, scriptModuleLength)) {}

torch_::jit::mobile::Module AbstractScriptModule::loadScriptModule(
    unsigned char* scriptedModule,
    unsigned int scriptModuleLength) {
  std::stringstream is;
  is.write((char*)scriptedModule, scriptModuleLength);
  return torch_::jit::_load_for_mobile(is, torch_::kCPU);
}

c10::IValue AbstractScriptModule::forward(
    std::vector<torch_::jit::IValue> inputs) {
  return this->scriptmodule_.forward(inputs);
}

std::vector<torch_::jit::IValue> AbstractScriptModule::parseInput(
    facebook::jsi::Runtime& runtime,
    const facebook::jsi::Value& thisValue,
    const facebook::jsi::Value* arguments,
    size_t count) {
  if (count != 1) {
    throw jsi::JSError(
        runtime,
        "Module expect 1 input but " + std::to_string(count) + " are given.");
  }
  auto tensorHostObject =
      torchlive::utils::helpers::parseTensor(runtime, &arguments[0]);
  auto tensor = tensorHostObject->tensor;
  std::vector<torch_::jit::IValue> inputs;
  inputs.push_back(tensor);
  return inputs;
}

} // namespace transforms
} // namespace torchvision
} // namespace torchlive
