/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include <jsi/jsi.h>

#include <string>

#include "JITHostObject.h"

namespace torchlive {
namespace torch {
namespace jit {

std::vector<jsi::PropNameID> JITHostObject::getPropertyNames(
    jsi::Runtime& runtime) {
  std::vector<jsi::PropNameID> result;
  return result;
}

jsi::Value JITHostObject::get(
    jsi::Runtime& runtime,
    const jsi::PropNameID& propName) {
  return jsi::Value::undefined();
}

} // namespace jit
} // namespace torch
} // namespace torchlive
