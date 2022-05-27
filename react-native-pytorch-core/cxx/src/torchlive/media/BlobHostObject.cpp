/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include "BlobHostObject.h"
#include "../Promise.h"
#include "../torch/utils/ArgumentParser.h"
#include "../torch/utils/helpers.h"

namespace torchlive {
namespace media {

using namespace facebook;

jsi::Value arrayBufferImpl(
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

BlobHostObject::BlobHostObject(
    jsi::Runtime& runtime,
    std::unique_ptr<torchlive::media::Blob>&& b)
    : BaseHostObject(runtime), blob(std::move(b)) {
  // Functions
  setPropertyHostFunction(runtime, "arrayBuffer", 0, arrayBufferImpl);

  // Properties
  setProperty(runtime, "size", static_cast<int>(blob->getDirectSize()));
}

} // namespace media
} // namespace torchlive
