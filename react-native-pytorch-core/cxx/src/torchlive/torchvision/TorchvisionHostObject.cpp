/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include "TorchvisionHostObject.h"
#include "VisionTransformHostObject.h"

namespace torchlive {
namespace torchvision {

using namespace facebook;

// TorchvisionHostObject Method Name
// empty

// TorchvisionHostObject Property Name
static const std::string TRANSFORMS = "transforms";

// TorchvisionHostObject Properties
static const std::vector<std::string> PROPERTIES = {
    TRANSFORMS,
};

// TorchvisionHostObject Methods
const std::vector<std::string> METHODS = {};

TorchvisionHostObject::TorchvisionHostObject(jsi::Runtime& runtime) {}

std::vector<jsi::PropNameID> TorchvisionHostObject::getPropertyNames(
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

jsi::Value TorchvisionHostObject::get(
    jsi::Runtime& runtime,
    const jsi::PropNameID& propName) {
  auto name = propName.utf8(runtime);

  if (name == TRANSFORMS) {
    auto transformsHostObject =
        std::make_shared<transforms::VisionTransformHostObject>(runtime);
    return jsi::Object::createFromHostObject(runtime, transformsHostObject);
  }

  return jsi::Value::undefined();
}

} // namespace torchvision
} // namespace torchlive
