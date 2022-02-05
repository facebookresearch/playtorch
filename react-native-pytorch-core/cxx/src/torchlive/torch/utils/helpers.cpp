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

ParseSizeResult parseSize(
    jsi::Runtime& runtime,
    const jsi::Value* arguments,
    int argIndex,
    size_t count) {
  int argCount = argIndex;
  std::vector<int64_t> dims = {};
  if (arguments[argIndex].isNumber()) {
    // For an input as a sequence of integers
    while (argCount < count && arguments[argCount].isNumber()) {
      dims.push_back((int)arguments[argCount].asNumber());
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
        dims.push_back(jsShape.getValueAtIndex(runtime, i).asNumber());
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
  ParseSizeResult result;
  result.nextArgumentIndex = argCount;
  result.dimensions = dims;
  return result;
}

} // namespace helpers
} // namespace utils
} // namespace torchlive
