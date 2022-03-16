/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include <torch/csrc/jit/mobile/import.h>

#include "../torch/utils/helpers.h"
#include "ATen/core/ivalue.h"
#include "GrayscaleModule.h"
#include "scripted/grayscale_scriptmodule.h"

namespace torchlive {
namespace torchvision {
namespace transforms {
using namespace facebook;

const std::string GrayscaleModule::moduleName = "grayscale";
const int GrayscaleModule::inputCount = 1;
const int GrayscaleModule::parameterCount = 1;

GrayscaleModule::GrayscaleModule()
    : AbstractScriptModule(
          grayscale_scriptmodule_ptl,
          grayscale_scriptmodule_ptl_len) {}

AbstractScriptModule* GrayscaleModule::getInstance() {
  static GrayscaleModule instance;
  return &instance;
}

std::vector<torch_::jit::IValue> GrayscaleModule::parseParameters(
    facebook::jsi::Runtime& runtime,
    const facebook::jsi::Value& thisValue,
    const facebook::jsi::Value* arguments,
    size_t count) {
  if (count > 1) {
    throw jsi::JSError(
        runtime,
        "Factory function grayscale expects 0 or 1 argument but " +
            std::to_string(count) + " are given.");
  }

  int numChannels = 1;
  if (count == 1) {
    numChannels = (int)arguments[0].asNumber();
    if (numChannels != 1 && numChannels != 3) {
      throw jsi::JSError(
          runtime,
          "num_output_channels should be either 1 or 3 but " +
              std::to_string(numChannels) + " is given.");
    }
  }

  std::vector<torch_::jit::IValue> params;
  params.push_back(numChannels);
  return params;
}

} // namespace transforms
} // namespace torchvision
} // namespace torchlive
