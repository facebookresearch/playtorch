/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include <torch/csrc/jit/mobile/import.h>

#include "../torch/utils/helpers.h"
#include "ATen/core/ivalue.h"
#include "CenterCropModule.h"
#include "scripted/center_crop_scriptmodule.h"

namespace torchlive {
namespace torchvision {
namespace transforms {
using namespace facebook;

const std::string CenterCropModule::moduleName = "centerCrop";
const int CenterCropModule::inputCount = 1;
const int CenterCropModule::parameterCount = 1;

CenterCropModule::CenterCropModule()
    : AbstractScriptModule(
          center_crop_scriptmodule_ptl,
          center_crop_scriptmodule_ptl_len) {}

AbstractScriptModule* CenterCropModule::getInstance() {
  static CenterCropModule instance;
  return &instance;
}

std::vector<torch_::jit::IValue> CenterCropModule::parseParameters(
    facebook::jsi::Runtime& runtime,
    const facebook::jsi::Value& thisValue,
    const facebook::jsi::Value* arguments,
    size_t count) {
  if (count != 1) {
    throw jsi::JSError(
        runtime,
        "Factory function resize expects 1 argument but " +
            std::to_string(count) + " are given.");
  }

  std::vector<double> shapeData =
      torchlive::utils::helpers::parseJSIArrayData(runtime, arguments[0]);

  auto ndims = shapeData.size();
  if (ndims < 1) {
    throw jsi::JSError(
        runtime,
        "Not enough values to unpack (expect 2, got " + std::to_string(ndims) +
            ")");
  }
  if (ndims > 2) {
    throw jsi::JSError(
        runtime,
        "Too many values to unpack (expect 2, got " + std::to_string(ndims) +
            ")");
  }
  std::vector<int64_t> shapeVector(shapeData.begin(), shapeData.end());

  c10::ArrayRef<int64_t> shapeArrayRef(shapeVector);
  std::vector<torch_::jit::IValue> params;
  params.push_back(shapeArrayRef);
  return params;
}

} // namespace transforms
} // namespace torchvision
} // namespace torchlive
