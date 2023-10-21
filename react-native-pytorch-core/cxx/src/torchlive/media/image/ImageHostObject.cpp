/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include "ImageHostObject.h"

#include "../../Promise.h"
#include "../../torch/utils/ArgumentParser.h"
#include "../../torch/utils/helpers.h"

namespace torchlive {
namespace media {

using namespace facebook;

namespace {

jsi::Value getWidthImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  const auto& image = thisValue.asObject(runtime)
                          .asHostObject<ImageHostObject>(runtime)
                          ->getImage();
  return image->getWidth();
};

jsi::Value getHeightImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  const auto& image = thisValue.asObject(runtime)
                          .asHostObject<ImageHostObject>(runtime)
                          ->getImage();
  return image->getHeight();
};

jsi::Value getNaturalWidthImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  const auto& image = thisValue.asObject(runtime)
                          .asHostObject<ImageHostObject>(runtime)
                          ->getImage();
  return image->getNaturalWidth();
};

jsi::Value getNaturalHeightImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  const auto& image = thisValue.asObject(runtime)
                          .asHostObject<ImageHostObject>(runtime)
                          ->getImage();
  return image->getNaturalHeight();
};

jsi::Value getPixelDensityImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  const auto& image = thisValue.asObject(runtime)
                          .asHostObject<ImageHostObject>(runtime)
                          ->getImage();
  return image->getPixelDensity();
};

jsi::Value scaleImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(2);
  const auto& image = args.thisAsHostObject<ImageHostObject>()->getImage();
  double sx = args[0].asNumber();
  double sy = args[1].asNumber();
  auto scaledImage = image->scale(sx, sy);
  return utils::helpers::createFromHostObject<ImageHostObject>(runtime, std::move(scaledImage));
};

jsi::Value releaseImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
    auto image = thisValue.asObject(runtime).asHostObject<ImageHostObject>(runtime);
    image->release();
    return jsi::Value::undefined();
};

} // namespace

ImageHostObject::ImageHostObject(
    jsi::Runtime& runtime,
    std::shared_ptr<IImage> image)
    : BaseHostObject(runtime), image_(std::move(image)) {
  // Properties
  setProperty(
      runtime, "ID", jsi::String::createFromUtf8(runtime, image_->getId()));

  // Functions
  setPropertyHostFunction(runtime, "getHeight", 0, getHeightImpl);
  setPropertyHostFunction(runtime, "getNaturalHeight", 0, getNaturalHeightImpl);
  setPropertyHostFunction(runtime, "getNaturalWidth", 0, getNaturalWidthImpl);
  setPropertyHostFunction(runtime, "getPixelDensity", 0, getPixelDensityImpl);
  setPropertyHostFunction(runtime, "getWidth", 0, getWidthImpl);
  setPropertyHostFunction(runtime, "release", 0, releaseImpl);
  setPropertyHostFunction(runtime, "scale", 2, scaleImpl);
}

std::shared_ptr<IImage> ImageHostObject::getImage() const noexcept {
  return image_;
}

void ImageHostObject::release() noexcept {
  image_ = nullptr;
}

} // namespace media
} // namespace torchlive
