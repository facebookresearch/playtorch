/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include <jsi/jsi.h>

#include <ATen/NativeFunctions.h>
#include <torch/script.h>
#include <string>
#include <vector>

#include "TensorHostObject.h"

// Namespace alias for torch to avoid namespace conflicts with torchlive::torch
namespace torch_ = torch;

namespace torchlive {
namespace torch {

using namespace facebook;

TensorHostObject::TensorHostObject(torch_::Tensor t) : tensor(t) {}

TensorHostObject::~TensorHostObject() {}

std::vector<jsi::PropNameID> TensorHostObject::getPropertyNames(
    jsi::Runtime& runtime) {
  std::vector<jsi::PropNameID> result;
  result.push_back(jsi::PropNameID::forUtf8(runtime, std::string("data")));
  result.push_back(jsi::PropNameID::forUtf8(runtime, std::string("toString")));
  return result;
}

jsi::Value TensorHostObject::get(
    jsi::Runtime& runtime,
    const jsi::PropNameID& propNameId) {
  auto name = propNameId.utf8(runtime);

  if (name == "data") {
    throw jsi::JSError(runtime, "Tensor.data not implemented");
  } else if (name == "toString") {
    auto toStringFunc = [this](
                            jsi::Runtime& runtime,
                            const jsi::Value& thisValue,
                            const jsi::Value* arguments,
                            size_t count) -> jsi::Value {
      auto tensor = this->tensor;
      std::ostringstream stream;
      stream << tensor;
      std::string tensor_string = stream.str();
      auto val = jsi::String::createFromUtf8(runtime, tensor_string);
      return jsi::Value(std::move(val));
    };
    return jsi::Function::createFromHostFunction(
        runtime,
        jsi::PropNameID::forUtf8(runtime, "toString"),
        0,
        toStringFunc);
  }

  return jsi::Value::undefined();
}

} // namespace torch
} // namespace torchlive
