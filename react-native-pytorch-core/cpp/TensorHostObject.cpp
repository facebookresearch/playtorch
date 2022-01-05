/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#ifdef ANDROID
#include <android/log.h>
#endif
#include <string>
#include <vector>
#include "TensorHostObject.h"

#include <ATen/NativeFunctions.h>
#include <torch/script.h>

namespace torchlive {
namespace core {

using namespace facebook;

TensorHostObject::TensorHostObject(torch::Tensor t) : tensor(t) {}

TensorHostObject::~TensorHostObject() {}

std::vector<jsi::PropNameID> TensorHostObject::getPropertyNames(
    jsi::Runtime& rt) {
  std::vector<jsi::PropNameID> result;
  result.push_back(jsi::PropNameID::forUtf8(rt, std::string("toString")));
  result.push_back(jsi::PropNameID::forUtf8(rt, std::string("data")));
  return result;
}

jsi::Value TensorHostObject::get(
    jsi::Runtime& runtime,
    const jsi::PropNameID& propNameId) {
  auto name = propNameId.utf8(runtime);

  if (name == "data") {
    torch::Tensor tensor = this->tensor;
    auto size = tensor.size(0);

    jsi::Array arr = jsi::Array(runtime, size);
    auto foo_a = tensor.accessor<float, 1>();
    for (int i = 0; i < foo_a.size(0); i++) {
      // use the accessor foo_a to get tensor data.
      arr.setValueAtIndex(runtime, i, foo_a[i]);
    }

    return arr;
  }

  return jsi::Value::undefined();
}

} // namespace core
} // namespace torchlive
