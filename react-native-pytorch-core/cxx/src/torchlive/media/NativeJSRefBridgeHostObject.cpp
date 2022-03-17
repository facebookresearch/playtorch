/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include "NativeJSRefBridgeHostObject.h"
#include "BlobHostObject.h"
#include "NativeJSRefBridge.h"

namespace torchlive {
namespace media {

using namespace facebook;

// NativeJSRefBridgeHostObject Method Name
static const std::string TO_BLOB = "toBlob";

// NativeJSRefBridgeHostObject Property Names
// empty

// NativeJSRefBridgeHostObject Properties
static const std::vector<std::string> PROPERTIES = {};

// NativeJSRefBridgeHostObject Methods
const std::vector<std::string> METHODS = {TO_BLOB};

NativeJSRefBridgeHostObject::NativeJSRefBridgeHostObject(jsi::Runtime& runtime)
    : toBlob_(createToBlob(runtime)) {}

std::vector<jsi::PropNameID> NativeJSRefBridgeHostObject::getPropertyNames(
    jsi::Runtime& runtime) {
  std::vector<jsi::PropNameID> result;
  for (std::string property : PROPERTIES) {
    result.push_back(jsi::PropNameID::forUtf8(runtime, property));
  }
  for (std::string method : METHODS) {
    result.push_back(jsi::PropNameID::forUtf8(runtime, method));
  }
  return result;
}

jsi::Value NativeJSRefBridgeHostObject::get(
    jsi::Runtime& runtime,
    const jsi::PropNameID& propName) {
  auto name = propName.utf8(runtime);

  if (name == TO_BLOB) {
    return jsi::Value(runtime, toBlob_);
  }

  return jsi::Value::undefined();
}

jsi::Function NativeJSRefBridgeHostObject::createToBlob(jsi::Runtime& runtime) {
  auto toBlobFunc = [](jsi::Runtime& runtime,
                       const jsi::Value& thisValue,
                       const jsi::Value* arguments,
                       size_t count) -> jsi::Value {
    if (count != 1) {
      throw jsi::JSError(runtime, "function requires 1 argument");
    }
    if (!arguments[0].isObject()) {
      throw jsi::JSError(runtime, "argument must be a NativeJSRef");
    }

    const auto ID_PROP = jsi::PropNameID::forUtf8(runtime, std::string("ID"));

    auto obj = arguments[0].asObject(runtime);
    if (!obj.hasProperty(runtime, ID_PROP)) {
      throw jsi::JSError(runtime, "object must have ID property");
    }

    auto idValue = obj.getProperty(runtime, ID_PROP);
    if (!idValue.isString()) {
      throw jsi::JSError(runtime, "ID property must be a string");
    }

    auto id = idValue.asString(runtime).utf8(runtime);
    auto blob = torchlive::media::toBlob(id);
    auto blobHostObject =
        std::make_shared<torchlive::media::BlobHostObject>(runtime, blob);
    return jsi::Object::createFromHostObject(runtime, blobHostObject);
  };
  return jsi::Function::createFromHostFunction(
      runtime, jsi::PropNameID::forUtf8(runtime, TO_BLOB), 1, toBlobFunc);
}

} // namespace media
} // namespace torchlive
