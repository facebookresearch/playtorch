/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include <torch/script.h>

#include "../TensorHostObject.h"
#include "converter.h"
#include "helpers.h"

using namespace facebook;

namespace torchlive {
namespace utils {
namespace converter {

namespace {

std::string ivalueToObjectKey(jsi::Runtime& runtime, const at::IValue& ivalue) {
  if (ivalue.isString()) {
    return ivalue.toString()->string();
  } else if (ivalue.isDouble()) {
    return std::to_string(ivalue.toDouble());
  } else if (ivalue.isInt()) {
    return std::to_string(ivalue.toInt());
  } else {
    throw jsi::JSError(
        runtime, ivalue.tagKind() + " can't convert to object key.");
  }
}
} // namespace

/**
 * A helper method to unpack a IValue object into a jsi::Value
 */
jsi::Value ivalueToJSIValue(jsi::Runtime& runtime, const at::IValue& ivalue) {
  // use isX over tagKind() to align with
  // https://github.com/pytorch/pytorch/blob/69e048b090ab06103e5be0e6c0774126bcff4b9b/aten/src/ATen/core/ivalue.h#L1006-L1011

  if (ivalue.isNone()) {
    return jsi::Value::null();
  } else if (ivalue.isTensor()) {
    auto t = ivalue.toTensor();
    return utils::helpers::createFromHostObject<torch::TensorHostObject>(
        runtime, std::move(t));
  } else if (ivalue.isDouble()) {
    return jsi::Value(ivalue.toDouble());
  } else if (ivalue.isInt()) {
    return jsi::Value(static_cast<int>(ivalue.toInt()));
  } else if (ivalue.isBool()) {
    return jsi::Value(ivalue.toBool());
  } else if (ivalue.isString()) {
    auto val =
        jsi::String::createFromUtf8(runtime, ivalue.toString()->string());
    return jsi::Value(std::move(val));
  } else if (ivalue.isGenericDict()) {
    const auto& dict = ivalue.toGenericDict();
    auto jsObject = jsi::Object(runtime);
    for (auto it = dict.begin(); it != dict.end(); it++) {
      auto&& key = it->key();
      auto&& val = it->value();
      jsObject.setProperty(
          runtime,
          ivalueToObjectKey(runtime, key).c_str(),
          ivalueToJSIValue(runtime, val));
    }
    return jsObject;
  } else if (ivalue.isList()) {
    const auto& list = ivalue.toList();
    auto jsArray = jsi::Array(runtime, list.size());
    for (size_t i = 0; i < list.size(); i++) {
      jsArray.setValueAtIndex(
          runtime, i, ivalueToJSIValue(runtime, list.get(i)));
    }
    return jsArray;
  } else if (ivalue.isTuple()) {
    const auto& tuple = ivalue.toTuple()->elements();
    auto jsArray = jsi::Array(runtime, tuple.size());
    for (size_t i = 0; i < tuple.size(); i++) {
      jsArray.setValueAtIndex(
          runtime, i, ivalueToJSIValue(runtime, tuple.at(i)));
    }
    return jsArray;
  }
  throw jsi::JSError(
      runtime, ivalue.tagKind() + " can't convert to jsi::Value.");
}

/**
 * A helper method to pack a JSValue object into an IValue
 */
torch_::jit::IValue jsiValuetoIValue(
    facebook::jsi::Runtime& runtime,
    const jsi::Value& jsValue) {
  torch_::jit::IValue iValue;
  if (jsValue.isNumber()) {
    iValue = jsValue.asNumber();
  } else if (jsValue.isBool()) {
    iValue = jsValue.getBool(); // jsi does not have asBool() method
  } else if (jsValue.isString()) {
    iValue = jsValue.asString(runtime).utf8(runtime);
  } else {
    auto tensorHostObject = utils::helpers::parseTensor(runtime, &jsValue);
    if (tensorHostObject != nullptr) {
      iValue = tensorHostObject->tensor;
    } else {
      throw jsi::JSError(runtime, "Unrecognized JSValue format.");
    }
  }
  return iValue;
}

} // namespace converter
} // namespace utils
} // namespace torchlive
