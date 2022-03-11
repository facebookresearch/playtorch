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

} // namespace transforms
} // namespace torchvision
} // namespace torchlive
