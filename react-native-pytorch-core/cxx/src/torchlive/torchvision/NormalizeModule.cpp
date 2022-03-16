/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include <torch/csrc/jit/mobile/import.h>

#include "../torch/utils/helpers.h"
#include "ATen/core/ivalue.h"
#include "NormalizeModule.h"
#include "scripted/normalize_scriptmodule.h"

namespace torchlive {
namespace torchvision {
namespace transforms {
using namespace facebook;

const std::string NormalizeModule::moduleName = "normalize";
const int NormalizeModule::inputCount = 1;
const int NormalizeModule::parameterCount = 2;

NormalizeModule::NormalizeModule()
    : AbstractScriptModule(
          normalize_scriptmodule_ptl,
          normalize_scriptmodule_ptl_len) {}

AbstractScriptModule* NormalizeModule::getInstance() {
  static NormalizeModule instance;
  return &instance;
}

std::vector<torch_::jit::IValue> NormalizeModule::parseParameters(
    facebook::jsi::Runtime& runtime,
    const facebook::jsi::Value& thisValue,
    const facebook::jsi::Value* arguments,
    size_t count) {
  if (count != 2) {
    throw jsi::JSError(
        runtime,
        "Factory function normalize expects 2 argument but " +
            std::to_string(count) + " are given.");
  }
  std::vector<double> mean =
      torchlive::utils::helpers::parseJSIArrayData(runtime, arguments[0]);
  std::vector<double> std =
      torchlive::utils::helpers::parseJSIArrayData(runtime, arguments[1]);
  c10::ArrayRef<double> meanArrayRef(mean);
  c10::ArrayRef<double> stdArrayRef(std);
  std::vector<torch_::jit::IValue> params;
  params.push_back(meanArrayRef);
  params.push_back(stdArrayRef);
  return params;
}

} // namespace transforms
} // namespace torchvision
} // namespace torchlive
