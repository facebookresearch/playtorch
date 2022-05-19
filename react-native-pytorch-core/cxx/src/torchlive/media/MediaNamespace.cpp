/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include "MediaNamespace.h"
#include "../torch/TensorHostObject.h"
#include "../torch/utils/ArgumentParser.h"
#include "../torch/utils/helpers.h"
#include "BlobHostObject.h"
#include "NativeJSRefBridge.h"

namespace torchlive {
namespace media {

using namespace facebook;

namespace {

jsi::Value imageFromBlobImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  auto args = utils::ArgumentParser(runtime, thisValue, arguments, count);
  args.requireNumArguments(3);
  const auto& blob = args.asHostObject<BlobHostObject>(0)->blob;
  auto width = args[1].asNumber();
  auto height = args[2].asNumber();

  return torchlive::media::imageFromBlob(runtime, *blob, width, height);
}

jsi::Value toBlobImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  if (count != 1) {
    throw jsi::JSError(runtime, "function requires 1 argument");
  }
  if (!arguments[0].isObject()) {
    throw jsi::JSError(runtime, "argument must be an object");
  }

  const auto& obj = arguments[0].asObject(runtime);

  std::unique_ptr<torchlive::media::Blob> blob;
  if (obj.isHostObject<torchlive::torch::TensorHostObject>(runtime)) {
    auto tensor =
        obj.asHostObject<torchlive::torch::TensorHostObject>(runtime)->tensor;
    auto size = tensor.numel();
    auto data = std::make_unique<uint8_t[]>(size);
    std::memcpy(data.get(), tensor.data_ptr(), size);
    blob = std::make_unique<torchlive::media::Blob>(std::move(data), size);
  } else {
    const auto ID_PROP = jsi::PropNameID::forUtf8(runtime, std::string("ID"));
    if (!obj.hasProperty(runtime, ID_PROP)) {
      throw jsi::JSError(runtime, "object must have ID property");
    }

    auto idValue = obj.getProperty(runtime, ID_PROP);
    if (!idValue.isString()) {
      throw jsi::JSError(runtime, "ID property must be a string");
    }

    auto id = idValue.asString(runtime).utf8(runtime);
    blob = torchlive::media::toBlob(id);
  }
  auto blobHostObject = std::make_shared<torchlive::media::BlobHostObject>(
      runtime, std::move(blob));
  return jsi::Object::createFromHostObject(runtime, std::move(blobHostObject));
}

} // namespace

jsi::Object buildNamespace(jsi::Runtime& rt, RuntimeExecutor rte) {
  using utils::helpers::setPropertyHostFunction;

  jsi::Object ns(rt);
  setPropertyHostFunction(rt, ns, "imageFromBlob", 3, imageFromBlobImpl);
  setPropertyHostFunction(rt, ns, "toBlob", 1, toBlobImpl);
  return ns;
}

} // namespace media
} // namespace torchlive
