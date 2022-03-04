/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include <jsi/jsi.h>

#include <ATen/NativeFunctions.h>
#include <torch/csrc/jit/mobile/import.h>
#include <torch/csrc/jit/mobile/module.h>
#include <torch/script.h>
#include <string>
#include <vector>

#include "../torch/TensorHostObject.h"
#include "CenterCropHostObject.h"
#include "VisionTransformHostObject.h"

// Namespace alias for torch to avoid namespace conflicts with torchlive::torch
namespace torch_ = torch;

namespace torchlive {
namespace torchvision {
namespace transforms {

using namespace facebook;

// TransformsHostObject Method Name
static const std::string CENTER_CROP = "centerCrop";

// TransformsHostObject Property Names
// empty

// TransformsHostObject Properties
static const std::vector<std::string> PROPERTIES = {};

// TransformsHostObject Methods
const std::vector<std::string> METHODS = {CENTER_CROP};

VisionTransformHostObject::VisionTransformHostObject(jsi::Runtime& runtime)
    : centerCrop_(createCenterCrop(runtime)) {}

std::vector<jsi::PropNameID> VisionTransformHostObject::getPropertyNames(
    jsi::Runtime& rt) {
  std::vector<jsi::PropNameID> result;
  for (std::string property : PROPERTIES) {
    result.push_back(jsi::PropNameID::forUtf8(rt, property));
  }
  for (std::string method : METHODS) {
    result.push_back(jsi::PropNameID::forUtf8(rt, method));
  }
  return result;
}

jsi::Value VisionTransformHostObject::get(
    jsi::Runtime& runtime,
    const jsi::PropNameID& propName) {
  auto name = propName.utf8(runtime);

  if (name == CENTER_CROP) {
    return jsi::Value(runtime, centerCrop_);
  }

  return jsi::Value::undefined();
}

jsi::Function VisionTransformHostObject::createCenterCrop(
    jsi::Runtime& runtime) {
  auto centerCropFactoryFunc = [](jsi::Runtime& runtime,
                                  const jsi::Value& thisValue,
                                  const jsi::Value* arguments,
                                  size_t count) -> jsi::Value {
    if (count != 1) {
      throw jsi::JSError(
          runtime,
          "Factory function centerCrop expects 1 argument but " +
              std::to_string(count) + " are given.");
    }
    auto centerCropHostObject =
        std::make_shared<CenterCropHostObject>(runtime, arguments[0]);
    return jsi::Object::createFromHostObject(runtime, centerCropHostObject);
  };

  return jsi::Function::createFromHostFunction(
      runtime,
      jsi::PropNameID::forUtf8(runtime, CENTER_CROP),
      1,
      centerCropFactoryFunc);
}

} // namespace transforms
} // namespace torchvision
} // namespace torchlive
