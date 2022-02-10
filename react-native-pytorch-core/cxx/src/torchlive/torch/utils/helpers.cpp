/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include "helpers.h"

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
    const jsi::Value* jsValue) {
  auto object = jsValue->asObject(runtime);
  if (object.isHostObject(runtime)) {
    auto hostObject = object.getHostObject(runtime);
    return dynamic_cast<torchlive::torch::TensorHostObject*>(hostObject.get());
  }
  return nullptr;
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
      double other = arguments[1].asNumber();
      *operand2Number = &other;
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

} // namespace helpers
} // namespace utils
} // namespace torchlive
