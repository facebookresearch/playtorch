/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include <jsi/jsi.h>

#include "BlobHostObject.h"

namespace torchlive {
namespace media {

using namespace facebook;

// BlobHostObject Method Name
static const std::string ARRAY_BUFFER = "arrayBuffer";
static const std::string FREE = "free";

// BlobHostObject Property Names
// empty

// BlobHostObject Properties
static const std::vector<std::string> PROPERTIES = {};

// BlobHostObject Methods
const std::vector<std::string> METHODS = {ARRAY_BUFFER, FREE};

BlobHostObject::BlobHostObject(jsi::Runtime& runtime, torchlive::media::Blob b)
    : arrayBuffer_(createArrayBuffer(runtime)),
      free_(createFree(runtime)),
      blob(b) {}

BlobHostObject::~BlobHostObject() {
#ifdef __APPLE__
  delete this->blob.getDirectBytes();
#endif
}

std::vector<jsi::PropNameID> BlobHostObject::getPropertyNames(
    jsi::Runtime& runtime) {
  std::vector<jsi::PropNameID> result;
  for (std::string property : PROPERTIES) {
    result.push_back(jsi::PropNameID::forUtf8(runtime, property));
  }
  for (std::string method : METHODS) {
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
  } else if (name == FREE) {
    return jsi::Value(runtime, free_);
  }
  return jsi::Value::undefined();
}

jsi::Function BlobHostObject::createArrayBuffer(jsi::Runtime& runtime) {
  auto arrayBufferFunc = [this](
                             jsi::Runtime& runtime,
                             const jsi::Value& thisValue,
                             const jsi::Value* arguments,
                             size_t count) {
    auto blob = this->blob;
    const uint8_t* buffer = blob.getDirectBytes();
    int size = (int)blob.getDirectSize();

    jsi::ArrayBuffer arrayBuffer =
        runtime.global()
            .getPropertyAsFunction(runtime, "ArrayBuffer")
            .callAsConstructor(runtime, size)
            .asObject(runtime)
            .getArrayBuffer(runtime);

    std::memcpy(arrayBuffer.data(runtime), buffer, size);

    return runtime.global()
        .getPropertyAsFunction(runtime, "Uint8Array")
        .callAsConstructor(runtime, arrayBuffer)
        .asObject(runtime);
  };
  return jsi::Function::createFromHostFunction(
      runtime,
      jsi::PropNameID::forUtf8(runtime, ARRAY_BUFFER),
      0,
      arrayBufferFunc);
}

jsi::Function BlobHostObject::createFree(jsi::Runtime& runtime) {
  auto freeFunc = [this](
                      jsi::Runtime& runtime,
                      const jsi::Value& thisValue,
                      const jsi::Value* arguments,
                      size_t count) {
    auto buffer = this->blob.getDirectBytes();
    delete buffer;
    return jsi::Value::undefined();
  };
  return jsi::Function::createFromHostFunction(
      runtime, jsi::PropNameID::forUtf8(runtime, FREE), 0, freeFunc);
}

} // namespace media
} // namespace torchlive
