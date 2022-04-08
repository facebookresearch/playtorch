/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include "BaseHostObject.h"

#include <vector>

namespace torchlive {
namespace common {

using namespace facebook;

BaseHostObject::BaseHostObject(jsi::Runtime& rt) {}

BaseHostObject::~BaseHostObject() {}

jsi::Value BaseHostObject::get(jsi::Runtime& rt, const jsi::PropNameID& name) {
  auto it = propertyMap_.find(name.utf8(rt));
  return it != propertyMap_.end() ? jsi::Value(rt, it->second)
                                  : jsi::Value::undefined();
}

std::vector<jsi::PropNameID> BaseHostObject::getPropertyNames(
    jsi::Runtime& rt) {
  std::vector<jsi::PropNameID> result;
  for (const auto& it : propertyMap_) {
    result.push_back(jsi::PropNameID::forUtf8(rt, it.first));
  }
  return result;
}

void BaseHostObject::setProperty(
    jsi::Runtime& rt,
    const std::string& name,
    jsi::Value&& value) {
  propertyMap_.emplace(name, std::move(value));
}

void BaseHostObject::setPropertyHostFunction(
    jsi::Runtime& rt,
    const std::string& name,
    unsigned int paramCount,
    jsi::HostFunctionType func) {
  setProperty(
      rt,
      name,
      jsi::Function::createFromHostFunction(
          rt, jsi::PropNameID::forUtf8(rt, name), paramCount, std::move(func)));
}

} // namespace common
} // namespace torchlive
