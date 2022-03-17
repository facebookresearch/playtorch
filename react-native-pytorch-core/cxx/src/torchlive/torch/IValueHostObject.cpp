/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include "IValueHostObject.h"
#include "DictHostObject.h"
#include "TensorHostObject.h"

namespace torchlive {
namespace torch {

using namespace facebook;

// IValueHostObject Method Name
static const std::string TO_GENERIC_DICT = "toGenericDict";
static const std::string TO_TENSOR = "toTensor";
static const std::string TO_TUPLE = "toTuple";

// IValueHostObject Methods
const std::vector<std::string> METHODS = {TO_GENERIC_DICT, TO_TENSOR};

// IValueHostObject Property Names
// empty

// IValueHostObject Properties
static const std::vector<std::string> PROPERTIES = {};

IValueHostObject::IValueHostObject(jsi::Runtime& runtime, at::IValue v)
    : toGenericDict_(createToGenericDict(runtime)),
      toTensor_(createToTensor(runtime)),
      value_(v) {}

std::vector<jsi::PropNameID> IValueHostObject::getPropertyNames(
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

jsi::Value IValueHostObject::get(
    jsi::Runtime& runtime,
    const jsi::PropNameID& propNameId) {
  auto name = propNameId.utf8(runtime);

  if (name == TO_GENERIC_DICT) {
    return jsi::Value(runtime, toGenericDict_);
  } else if (name == TO_TENSOR) {
    return jsi::Value(runtime, toTensor_);
  } else if (name == TO_TUPLE) {
    throw jsi::JSError(runtime, "IValue.toTuple not implemented");
  }

  return jsi::Value::undefined();
}

jsi::Function IValueHostObject::createToGenericDict(jsi::Runtime& runtime) {
  auto toGenericDictFunc = [this](
                               jsi::Runtime& runtime,
                               const jsi::Value& thisValue,
                               const jsi::Value* arguments,
                               size_t count) -> jsi::Value {
    // c10::Dict<IValue, IValue>
    auto dict = this->value_.toGenericDict();
    auto dictHostObject =
        std::make_shared<torchlive::torch::DictHostObject>(dict);
    return jsi::Object::createFromHostObject(runtime, dictHostObject);
  };
  return jsi::Function::createFromHostFunction(
      runtime,
      jsi::PropNameID::forUtf8(runtime, TO_GENERIC_DICT),
      0,
      toGenericDictFunc);
}

jsi::Function IValueHostObject::createToTensor(jsi::Runtime& runtime) {
  auto toTensorFunc = [this](
                          jsi::Runtime& runtime,
                          const jsi::Value& thisValue,
                          const jsi::Value* arguments,
                          size_t count) -> jsi::Value {
    auto tensor = this->value_.toTensor();
    auto tensorHostObject =
        std::make_shared<torchlive::torch::TensorHostObject>(runtime, tensor);
    return jsi::Object::createFromHostObject(runtime, tensorHostObject);
  };
  return jsi::Function::createFromHostFunction(
      runtime, jsi::PropNameID::forUtf8(runtime, TO_TENSOR), 0, toTensorFunc);
}

} // namespace torch
} // namespace torchlive
