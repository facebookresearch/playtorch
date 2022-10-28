/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// Suppress deprecated-declarations error to support Clang/C++17
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"
#include <torch/script.h>
#pragma clang diagnostic pop

#include <cmath>

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

void throwUnexpectedTypeError(
    jsi::Runtime& runtime,
    const std::string& expected,
    const std::string& given) {
  throw jsi::JSError(
      runtime,
      "Unexpected Input Type: " + expected + " is expected, but " + given +
          " is given.");
}

void throwUnsupportedTypeError(
    jsi::Runtime& runtime,
    const std::string& expected,
    const std::string& given) {
  throw jsi::JSError(
      runtime,
      "Unsupported Input Type: " + expected + " is expected, but " + given +
          " is given.");
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
    const jsi::Value& jsValue,
    const c10::DynamicType& dynamicType) {
  torch_::jit::IValue iValue;
  auto kind = dynamicType.dynamicKind();
  switch (kind) {
    case c10::TypeKind::IntType: {
      auto n = jsValue.asNumber();
      if (fmod(n, 1) != 0) {
        throwUnexpectedTypeError(
            runtime, c10::typeKindToString(kind), "a float");
      }
      return static_cast<int>(n);
    }
    case c10::TypeKind::FloatType:
      return jsValue.asNumber();
    case c10::TypeKind::BoolType:
      if (!jsValue.isBool()) {
        throwUnexpectedTypeError(
            runtime,
            c10::typeKindToString(kind),
            helpers::jsValueKindToString(jsValue));
      }
      return jsValue.getBool(); // jsi does not have asBool() method
    case c10::TypeKind::StringType:
      return jsValue.asString(runtime).utf8(runtime);
    case c10::TypeKind::NoneType:
      if (!jsValue.isNull() && !jsValue.isUndefined()) {
        throwUnexpectedTypeError(
            runtime,
            c10::typeKindToString(kind),
            helpers::jsValueKindToString(jsValue));
      }
      return c10::nullopt;
    case c10::TypeKind::TensorType: {
      auto tensorHostObject = utils::helpers::parseTensor(runtime, &jsValue);
      if (tensorHostObject == nullptr) {
        throwUnexpectedTypeError(
            runtime,
            c10::typeKindToString(kind),
            helpers::jsValueKindToString(jsValue));
      }
      return tensorHostObject->tensor;
    }
    case c10::TypeKind::ListType: {
      if (!jsValue.isObject()) {
        throwUnexpectedTypeError(
            runtime,
            c10::typeKindToString(kind),
            helpers::jsValueKindToString(jsValue));
      } else if (!jsValue.asObject(runtime).isArray(runtime)) {
        throwUnexpectedTypeError(
            runtime, c10::typeKindToString(kind), "unknown object");
      }
      auto& childType =
          dynamicType.containedType(0)->expectRef<c10::DynamicType>();
      auto jsArray = jsValue.asObject(runtime).asArray(runtime);
      auto length = jsArray.length(runtime);
      c10::impl::GenericList list =
          c10::impl::GenericList(dynamicType.containedType(0));
      for (int i = 0; i < length; i++) {
        list.push_back(jsiValuetoIValue(
            runtime, jsArray.getValueAtIndex(runtime, i), childType));
      }
      return list;
    }
    case c10::TypeKind::TupleType: {
      // A tuple is represented as Array in JS
      if (!jsValue.isObject()) {
        throwUnexpectedTypeError(
            runtime,
            c10::typeKindToString(kind),
            helpers::jsValueKindToString(jsValue));
      } else if (!jsValue.asObject(runtime).isArray(runtime)) {
        throwUnexpectedTypeError(
            runtime, c10::typeKindToString(kind), "unknown object");
      }
      auto jsTuple = jsValue.asObject(runtime).asArray(runtime);
      auto expectedSize = dynamicType.containedTypeSize();
      auto initializerVector = std::vector<c10::IValue>();
      for (int i = 0; i < expectedSize; i++) {
        auto& childType =
            dynamicType.containedType(i)->expectRef<c10::DynamicType>();
        initializerVector.emplace_back(jsiValuetoIValue(
            runtime, jsTuple.getValueAtIndex(runtime, i), childType));
      }
      return c10::ivalue::Tuple::create(std::move(initializerVector));
    }
    case c10::TypeKind::DictType: {
      if (!jsValue.isObject()) {
        throwUnexpectedTypeError(
            runtime,
            c10::typeKindToString(kind),
            helpers::jsValueKindToString(jsValue));
      }
      auto& keyType =
          dynamicType.containedType(0)->expectRef<c10::DynamicType>();
      auto& valueType =
          dynamicType.containedType(1)->expectRef<c10::DynamicType>();
      auto jsObject = jsValue.asObject(runtime);
      auto dict = c10::impl::GenericDict(
          dynamicType.containedType(0), dynamicType.containedType(1));
      auto keys = jsObject.getPropertyNames(runtime);
      auto keysLength = keys.length(runtime);
      for (int i = 0; i < keysLength; i++) {
        auto key = keys.getValueAtIndex(runtime, i);
        dict.insert(
            jsiValuetoIValue(runtime, key, keyType),
            jsiValuetoIValue(
                runtime,
                jsObject.getProperty(runtime, key.asString(runtime)),
                valueType));
      }
      return dict;
    }
    default:
      throwUnsupportedTypeError(
          runtime,
          c10::typeKindToString(kind),
          helpers::jsValueKindToString(jsValue));
      // explicily return to avoid linter complaint
      return iValue;
  }
}
} // namespace converter
} // namespace utils
} // namespace torchlive
