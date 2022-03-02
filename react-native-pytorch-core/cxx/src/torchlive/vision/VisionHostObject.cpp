/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include "VisionHostObject.h"
#include "TransformsHostObject.h"

namespace torchlive {
namespace vision {

using namespace facebook;

// VisionHostObject Method Name
// empty

// VisionHostObject Property Name
static const std::string TRANSFORMS = "transforms";

// VisionHostObject Properties
static const std::vector<std::string> PROPERTIES = {
    TRANSFORMS,
};

// VisionHostObject Methods
// empty
const std::vector<std::string> METHODS = {};

VisionHostObject::VisionHostObject(jsi::Runtime& runtime) {}

std::vector<jsi::PropNameID> VisionHostObject::getPropertyNames(
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

jsi::Value VisionHostObject::get(
    jsi::Runtime& runtime,
    const jsi::PropNameID& propName) {
  auto name = propName.utf8(runtime);

  if (name == TRANSFORMS) {
    auto transformsHostObject =
        std::make_shared<transforms::TransformsHostObject>(runtime);
    return jsi::Object::createFromHostObject(runtime, transformsHostObject);
  }

  return jsi::Value::undefined();
}

} // namespace vision
} // namespace torchlive
