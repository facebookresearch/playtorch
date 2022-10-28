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
#include "image/ImageHostObject.h"

namespace torchlive {
namespace media {

using namespace facebook;

namespace {

std::unique_ptr<Blob> tensorToBlob(
    const ::torch::Tensor& tensor,
    const std::string& type = "") {
  auto size = tensor.numel();
  auto data = std::make_unique<uint8_t[]>(size);
  std::memcpy(data.get(), tensor.data_ptr(), size);
  return std::make_unique<torchlive::media::Blob>(std::move(data), size, type);
}

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

  std::shared_ptr<IImage> image;
  try {
    image = torchlive::media::imageFromBlob(*blob, width, height);
  } catch (const std::exception& e) {
    throw jsi::JSError(
        runtime,
        "error on converting blob to image with width: " +
            std::to_string(width) + ", height: " + std::to_string(height) +
            "\n" + e.what());
  }
  return utils::helpers::createFromHostObject<ImageHostObject>(
      runtime, std::move(image));
}

jsi::Value imageFromTensorImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  auto args = utils::ArgumentParser(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);

  const auto& tensor = args.asHostObject<torch::TensorHostObject>(0)->tensor;
  auto sizes = tensor.sizes();
  if (sizes.size() != 3 || tensor.dtype() != torch_::kUInt8) {
    throw jsi::JSError(
        runtime,
        "input tensor must be of shape (channels, height, width) with dtype uint8");
  }
  auto channels = sizes.at(0);
  auto height = sizes.at(1);
  auto width = sizes.at(2);
  std::string blobType;

  if (channels == 1) {
    blobType = Blob::kBlobTypeImageGrayscale;
  } else if (channels == 3) {
    blobType = Blob::kBlobTypeImageRGB;
  } else if (channels == 4) {
    blobType = Blob::kBlobTypeImageRGBA;
  } else {
    throw jsi::JSError(
        runtime,
        "input tensor must be of shape (1, height, width) or (3, height, width) or (4, height, width)");
  }

  // Switch to MemoryFormat::ChannelsLast, it requires a rank 4 tensor to work
  // https://pytorch.org/tutorials/intermediate/memory_format_tutorial.html#what-is-channels-last
  auto tensorOptions = torch_::TensorOptions()
                           .dtype(tensor.dtype())
                           .memory_format(c10::MemoryFormat::ChannelsLast);
  auto updatedTensor = tensor.unsqueeze(0).to(tensorOptions).squeeze(0);

  auto blob = tensorToBlob(updatedTensor, blobType);
  std::shared_ptr<IImage> image;
  try {
    image = torchlive::media::imageFromBlob(*blob, width, height);
  } catch (const std::exception& e) {
    throw jsi::JSError(
        runtime,
        "error on converting blob to image with width: " +
            std::to_string(width) + ", height: " + std::to_string(height) +
            "\n" + e.what());
  }
  return utils::helpers::createFromHostObject<ImageHostObject>(
      runtime, std::move(image));
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
    const auto& tensor =
        obj.asHostObject<torchlive::torch::TensorHostObject>(runtime)->tensor;
    blob = tensorToBlob(tensor);
  } else if (obj.isHostObject<torchlive::media::ImageHostObject>(runtime)) {
    const auto& image =
        obj.asHostObject<torchlive::media::ImageHostObject>(runtime)
            ->getImage();
    blob = torchlive::media::toBlob(image);
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
    try {
      blob = torchlive::media::toBlob(id);
    } catch (const std::runtime_error& e) {
      throw jsi::JSError(runtime, e.what());
    }
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
  setPropertyHostFunction(rt, ns, "imageFromTensor", 1, imageFromTensorImpl);
  setPropertyHostFunction(rt, ns, "toBlob", 1, toBlobImpl);
  return ns;
}

} // namespace media
} // namespace torchlive
