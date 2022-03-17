/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include "DictHostObject.h"
#include "IValueHostObject.h"

namespace torchlive {
namespace torch {

using namespace facebook;

// DictHostObject Method Name
// empty

// DictHostObject Methods
const std::vector<std::string> METHODS = {};

// DictHostObject Property Names
// empty

// DictHostObject Properties
static const std::vector<std::string> PROPERTIES = {};

DictHostObject::DictHostObject(c10::Dict<at::IValue, at::IValue> d)
    : dict_(d) {}

std::vector<jsi::PropNameID> DictHostObject::getPropertyNames(
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

jsi::Value DictHostObject::get(
    jsi::Runtime& runtime,
    const jsi::PropNameID& propName) {
  auto key = propName.utf8(runtime);
  auto it = this->dict_.find(key);
  if (it != this->dict_.end()) {
    auto valueHostObject = std::make_shared<torchlive::torch::IValueHostObject>(
        runtime, it->value());
    return jsi::Object::createFromHostObject(runtime, valueHostObject);
  }
  return jsi::Value::undefined();
}

} // namespace torch
} // namespace torchlive
