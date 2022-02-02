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

TensorHostObject::TensorHostObject(jsi::Runtime& runtime, torch_::Tensor t)
    : tensor(t), toString(createToString(runtime)), size(createSize(runtime)) {}

TensorHostObject::~TensorHostObject() {}

std::vector<jsi::PropNameID> TensorHostObject::getPropertyNames(
    jsi::Runtime& runtime) {
  std::vector<jsi::PropNameID> result;
  result.push_back(jsi::PropNameID::forUtf8(runtime, std::string("data")));
  result.push_back(jsi::PropNameID::forUtf8(runtime, std::string("toString")));
  result.push_back(jsi::PropNameID::forUtf8(runtime, std::string("size")));
  result.push_back(jsi::PropNameID::forUtf8(runtime, std::string("shape")));
  return result;
}

jsi::Value TensorHostObject::get(
    jsi::Runtime& runtime,
    const jsi::PropNameID& propNameId) {
  auto name = propNameId.utf8(runtime);

  if (name == "data") {
    auto tensor = this->tensor;
    int byteLength = tensor.nbytes();

    jsi::ArrayBuffer buffer = runtime.global()
                                  .getPropertyAsFunction(runtime, "ArrayBuffer")
                                  .callAsConstructor(runtime, byteLength)
                                  .asObject(runtime)
                                  .getArrayBuffer(runtime);

    std::memcpy(
        buffer.data(runtime),
        tensor.data_ptr(), // we don't specify the dtype here but let it figure
                           // out itself.
        byteLength);
    return buffer;
  } else if (name == "shape") {
    return this->size.call(runtime);
  } else if (name == "toString") {
    return jsi::Value(runtime, toString);
  } else if (name == "size") {
    return jsi::Value(runtime, size);
  }

  return jsi::Value::undefined();
}

jsi::Function TensorHostObject::createToString(jsi::Runtime& runtime) {
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
      runtime, jsi::PropNameID::forUtf8(runtime, "toString"), 0, toStringFunc);
}

jsi::Function TensorHostObject::createSize(jsi::Runtime& runtime) {
  auto sizeFunc = [this](
                      jsi::Runtime& runtime,
                      const jsi::Value& thisValue,
                      const jsi::Value* arguments,
                      size_t count) -> jsi::Value {
    auto tensor = this->tensor;
    torch_::IntArrayRef dims = tensor.sizes();
    jsi::Array jsShape = jsi::Array(runtime, dims.size());
    for (int i = 0; i < dims.size(); i++) {
      jsShape.setValueAtIndex(runtime, i, jsi::Value((int)dims[i]));
    }

    return jsShape;
  };
  return jsi::Function::createFromHostFunction(
      runtime, jsi::PropNameID::forUtf8(runtime, "size"), 0, sizeFunc);
}
} // namespace torch
} // namespace torchlive
