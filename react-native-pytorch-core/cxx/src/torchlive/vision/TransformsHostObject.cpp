/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include <jsi/jsi.h>
#include <vector>

#include <ATen/NativeFunctions.h>
#include <torch/script.h>
#include <string>

#include "../torch/TensorHostObject.h"
#include "TransformsHostObject.h"

// Namespace alias for torch to avoid namespace conflicts with torchlive::torch
namespace torch_ = torch;

namespace torchlive {
namespace vision {
namespace transforms {

using namespace facebook;

// TransformsHostObject Method Name
// empty

// TransformsHostObject Property Names
// empty

// TransformsHostObject Properties
// empty
static const std::vector<std::string> PROPERTIES = {};

// TransformsHostObject Methods
// empty
const std::vector<std::string> METHODS = {};

TransformsHostObject::TransformsHostObject(jsi::Runtime& runtime) {}

std::vector<jsi::PropNameID> TransformsHostObject::getPropertyNames(
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

jsi::Value TransformsHostObject::get(
    jsi::Runtime& runtime,
    const jsi::PropNameID& propName) {
  return jsi::Value::undefined();
}

} // namespace transforms
} // namespace vision
} // namespace torchlive
