/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include "BlobHostObject.h"

namespace torchlive {
namespace media {

using namespace facebook;

// BlobHostObject Method Name
static const std::string ARRAY_BUFFER = "arrayBuffer";

// BlobHostObject Property Names
// empty

// BlobHostObject Properties
static const std::vector<std::string> PROPERTIES = {};

// BlobHostObject Methods
const std::vector<std::string> METHODS = {ARRAY_BUFFER};

BlobHostObject::BlobHostObject(
    jsi::Runtime& runtime,
    std::unique_ptr<torchlive::media::Blob>&& b)
    : arrayBuffer_(createArrayBuffer(runtime)), blob(std::move(b)) {}

std::vector<jsi::PropNameID> BlobHostObject::getPropertyNames(
    jsi::Runtime& runtime) {
  std::vector<jsi::PropNameID> result;
  for (const auto& property : PROPERTIES) {
    result.push_back(jsi::PropNameID::forUtf8(runtime, property));
  }
  for (const auto& method : METHODS) {
    result.push_back(jsi::PropNameID::forUtf8(runtime, method));
  }
  return result;
}

jsi::Value BlobHostObject::get(
    jsi::Runtime& runtime,
    const jsi::PropNameID& propName) {
  auto name = propName.utf8(runtime);
  if (name == ARRAY_BUFFER) {
    return jsi::Value(runtime, arrayBuffer_);
  }
  return jsi::Value::undefined();
}

jsi::Function BlobHostObject::createArrayBuffer(jsi::Runtime& runtime) {
  auto arrayBufferFunc = [this](
                             jsi::Runtime& runtime,
                             const jsi::Value& thisValue,
                             const jsi::Value* arguments,
                             size_t count) -> jsi::Value {
    auto blob = this->blob.get();
    auto buffer = blob->getDirectBytes();
    auto size = blob->getDirectSize();

    jsi::ArrayBuffer arrayBuffer =
        runtime.global()
            .getPropertyAsFunction(runtime, "ArrayBuffer")
            .callAsConstructor(runtime, static_cast<int>(size))
            .asObject(runtime)
            .getArrayBuffer(runtime);

    std::memcpy(arrayBuffer.data(runtime), buffer, size);

    return runtime.global()
        .getPropertyAsFunction(runtime, "Uint8Array")
        .callAsConstructor(runtime, std::move(arrayBuffer))
        .asObject(runtime);
  };
  return jsi::Function::createFromHostFunction(
      runtime,
      jsi::PropNameID::forUtf8(runtime, ARRAY_BUFFER),
      0,
      std::move(arrayBufferFunc));
}

} // namespace media
} // namespace torchlive
