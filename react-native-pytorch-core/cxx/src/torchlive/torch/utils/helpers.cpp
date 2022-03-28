/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include "helpers.h"
#include "constants.h"

// Namespace alias for torch to avoid namespace conflicts with torchlive::torch
namespace torch_ = torch;

namespace torchlive {
namespace utils {
namespace helpers {

using namespace facebook;

int parseSize(
    jsi::Runtime& runtime,
    const jsi::Value* arguments,
    int argIndex,
    size_t count,
    std::vector<int64_t>* dimensions) {
  int argCount = argIndex;
  if (arguments[argIndex].isNumber()) {
    // For an input as a sequence of integers
    while (argCount < count && arguments[argCount].isNumber()) {
      dimensions->push_back((int)arguments[argCount].asNumber());
      argCount++;
    }
  } else if (
      arguments[argIndex].isObject() &&
      arguments[argIndex].asObject(runtime).isArray(runtime)) {
    // For an input as a collection like a list or a tuple
    jsi::Array jsShape =
        arguments[argCount++].asObject(runtime).asArray(runtime);
    for (int i = 0; i < jsShape.size(runtime); i++) {
      jsi::Value inputValue = jsShape.getValueAtIndex(runtime, i);
      if (inputValue.isNumber()) {
        dimensions->push_back(jsShape.getValueAtIndex(runtime, i).asNumber());
      } else {
        jsi::JSError(
            runtime,
            "Input should be a sequence, collection or a tuple of numbers.");
      }
    }
  } else {
    throw jsi::JSError(
        runtime,
        "Please specify the first input as a sequence of numbers or a collection like a list or a tuple.");
  }
  return argCount;
}

torchlive::torch::TensorHostObject* parseTensor(
    jsi::Runtime& runtime,
    const jsi::Value* value) {
  if (!value->isObject()) {
    throw jsi::JSError(runtime, "Value must be a tensor");
  }
  auto object = value->asObject(runtime);
  if (!object.isHostObject(runtime)) {
    throw jsi::JSError(runtime, "Value must be a tensor");
  }
  auto hostObject = object.getHostObject(runtime);
  auto tensorHostObject =
      dynamic_cast<torchlive::torch::TensorHostObject*>(hostObject.get());
  if (tensorHostObject == nullptr) {
    throw jsi::JSError(runtime, "Value must be a tensor");
  }
  return tensorHostObject;
}

void parseArithmeticOperands(
    facebook::jsi::Runtime& runtime,
    const facebook::jsi::Value* arguments,
    size_t count,
    torchlive::torch::TensorHostObject** operand1Tensor,
    torchlive::torch::TensorHostObject** operand2Tensor,
    double** operand2Number) {
  if (count < 2) {
    throw jsi::JSError(runtime, "This function requires at least 2 arguments.");
  }
  auto operand1 = parseTensor(runtime, &arguments[0]);
  if (operand1 == nullptr) {
    throw jsi::JSError(runtime, "First argument must be a tensor.");
  } else {
    *operand1Tensor = operand1;
    if (arguments[1].isNumber()) {
      double* other = new double[1];
      other[0] = arguments[1].asNumber();
      *operand2Number = other;
    } else {
      auto operand2 = parseTensor(runtime, &arguments[1]);
      if (operand2 == nullptr) {
        throw jsi::JSError(
            runtime, "Second argument must be a tensor or a number.");
      }
      *operand2Tensor = operand2;
    }
  }
}

torch_::TensorOptions parseTensorOptions(
    facebook::jsi::Runtime& runtime,
    const jsi::Value* arguments,
    int argIndex,
    size_t count) {
  torch_::TensorOptions tensorOptions = torch_::TensorOptions();
  if (argIndex >= count) {
    return tensorOptions;
  }

  if (!arguments[argIndex].isObject()) {
    throw jsi::JSError(runtime, "Argument must be an object");
  }

  jsi::Object jsTensorOptions = arguments[argIndex].asObject(runtime);
  std::string dtypeStr = jsTensorOptions.getProperty(runtime, "dtype")
                             .asString(runtime)
                             .utf8(runtime);

  tensorOptions =
      tensorOptions.dtype(utils::constants::getDtypeFromString(dtypeStr));

  return tensorOptions;
}

facebook::jsi::Value parseKeywordArgument(
    facebook::jsi::Runtime& runtime,
    const facebook::jsi::Value* arguments,
    int argIndex,
    size_t count,
    const char* key) {
  auto defaultValue = jsi::Value();
  if (argIndex >= count || !arguments[argIndex].isObject()) {
    return defaultValue;
  }

  jsi::Object keywordOptions = arguments[argIndex].asObject(runtime);
  if (!keywordOptions.hasProperty(runtime, key)) {
    return defaultValue;
  }

  return keywordOptions.getProperty(runtime, key);
}

std::vector<double> parseJSIArrayData(
    jsi::Runtime& runtime,
    const jsi::Value& val) {
  auto parseJSIArrayDataHelper = [&](jsi::Runtime& runtime,
                                     const jsi::Value& val,
                                     std::vector<double>& data,
                                     auto&& parseJSIArrayDataHelper) -> void {
    if (val.isNumber()) {
      data.push_back(val.asNumber());
    } else if (val.isObject() && val.asObject(runtime).isArray(runtime)) {
      auto jsiArray = val.asObject(runtime).asArray(runtime);
      for (int i = 0; i < jsiArray.size(runtime); i++) {
        parseJSIArrayDataHelper(
            runtime,
            jsiArray.getValueAtIndex(runtime, i),
            data,
            parseJSIArrayDataHelper);
      }
    } else {
      throw jsi::JSError(
          runtime,
          "Expect jsi::Number or jsi::Array, but another type is given");
    }
  };
  std::vector<double> result = {};
  parseJSIArrayDataHelper(runtime, val, result, parseJSIArrayDataHelper);
  return result;
}

std::vector<int64_t> parseJSIArrayShape(
    jsi::Runtime& runtime,
    const jsi::Value& val) {
  std::vector<int64_t> shape = {};
  auto parseJSIArrayShapeHelper = [&](jsi::Runtime& runtime,
                                      const jsi::Value& val,
                                      std::vector<int64_t>& shape,
                                      auto&& parseJSIArrayShapeHelper) -> void {
    if (val.isNumber()) {
      return;
    } else if (val.isObject() && val.asObject(runtime).isArray(runtime)) {
      jsi::Array jsiArray = val.asObject(runtime).asArray(runtime);
      int64_t arrSize = jsiArray.size(runtime);
      shape.push_back(arrSize);
      parseJSIArrayShapeHelper(
          runtime,
          jsiArray.getValueAtIndex(runtime, 0),
          shape,
          parseJSIArrayShapeHelper);
      return;
    } else {
      throw jsi::JSError(
          runtime,
          "Expect jsi::Number or jsi::Array, but another type is given");
    }
  };
  parseJSIArrayShapeHelper(runtime, val, shape, parseJSIArrayShapeHelper);
  return shape;
}

void setPropertyHostFunction(
    jsi::Runtime& runtime,
    jsi::Object& obj,
    const std ::string& name,
    size_t paramCount,
    jsi::HostFunctionType hostFunc) {
  auto propNameId = jsi::PropNameID::forUtf8(runtime, name);
  auto func = jsi::Function::createFromHostFunction(
      runtime, propNameId, paramCount, hostFunc);
  obj.setProperty(runtime, propNameId, std::move(func));
}

} // namespace helpers
} // namespace utils
} // namespace torchlive
