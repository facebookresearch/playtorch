/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include "BlobHostObject.h"
#include <cmath>
#include "../Promise.h"
#include "../torch/utils/ArgumentParser.h"
#include "../torch/utils/helpers.h"

namespace torchlive {
namespace media {

using namespace facebook;

namespace {

jsi::Value BlobObjectWithNoData(jsi::Runtime& runtime) {
  // `Blob` has size 0 and contains no data.
  auto buffer = std::unique_ptr<uint8_t[]>(new uint8_t[0]);
  auto blobHostObject = std::make_shared<BlobHostObject>(
      runtime, std::make_unique<Blob>(std::move(buffer), 0));
  return jsi::Object::createFromHostObject(runtime, std::move(blobHostObject));
}

} // namespace

static jsi::Value arrayBufferImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  const auto& blob = args.thisAsHostObject<BlobHostObject>()->blob;
  auto promiseValue = torchlive::createPromiseAsJSIValue(
      runtime,
      [&blob](jsi::Runtime& rt, std::shared_ptr<torchlive::Promise> promise) {
        auto buffer = blob->getDirectBytes();
        auto size = blob->getDirectSize();
        jsi::ArrayBuffer arrayBuffer =
            rt.global()
                .getPropertyAsFunction(rt, "ArrayBuffer")
                .callAsConstructor(rt, static_cast<int>(size))
                .asObject(rt)
                .getArrayBuffer(rt);
        std::memcpy(arrayBuffer.data(rt), buffer, size);
        auto typedArray = rt.global()
                              .getPropertyAsFunction(rt, "Uint8Array")
                              .callAsConstructor(rt, std::move(arrayBuffer))
                              .asObject(rt);
        promise->resolve(std::move(typedArray));
      });
  return promiseValue;
}

static jsi::Value sliceImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  const auto& blob = args.thisAsHostObject<BlobHostObject>()->blob;
  auto blobSize = static_cast<int>(blob->getDirectSize());

  // Default values
  int start = 0;
  int end = blobSize;

  // Optinal inputs
  if (args.count() > 0) {
    start = args.asInteger(0);
  }
  if (args.count() > 1) {
    end = args.asInteger(1);
  }

  // Invalid cases
  if (std::abs(start) > blobSize || std::abs(end) > blobSize) {
    return BlobObjectWithNoData(runtime);
  }

  if (start < 0) {
    start = blobSize + start;
  }
  if (end < 0) {
    end = blobSize + end;
  }

  // More invalid cases
  if (start >= end) {
    return BlobObjectWithNoData(runtime);
  }

  // Implement slice(start, end)
  auto size = end - start;
  auto buffer = std::unique_ptr<uint8_t[]>(new uint8_t[size]);
  std::memcpy(buffer.get(), blob->getDirectBytes() + start, size);

  auto blobHostObject = std::make_shared<BlobHostObject>(
      runtime, std::make_unique<Blob>(std::move(buffer), size));
  return jsi::Object::createFromHostObject(runtime, std::move(blobHostObject));
}

BlobHostObject::BlobHostObject(
    jsi::Runtime& runtime,
    std::unique_ptr<torchlive::media::Blob>&& b)
    : BaseHostObject(runtime), blob(std::move(b)) {
  // Properties
  setProperty(runtime, "size", static_cast<int>(blob->getDirectSize()));
  setProperty(
      runtime, "type", jsi::String::createFromUtf8(runtime, blob->getType()));

  // Functions
  setPropertyHostFunction(runtime, "arrayBuffer", 0, arrayBufferImpl);
  setPropertyHostFunction(runtime, "slice", 0, sliceImpl);
}

} // namespace media
} // namespace torchlive
