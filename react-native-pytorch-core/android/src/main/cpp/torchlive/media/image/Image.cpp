/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include "Image.h"

namespace torchlive {
namespace media {

using namespace facebook;
using namespace jni;

namespace {

alias_ref<JClass> getMediaUtilsClass() {
  static const auto MediaUtilsClass =
      findClassStatic("org/pytorch/rn/core/media/MediaUtils");
  return MediaUtilsClass;
}

} // namespace

Image::Image(facebook::jni::alias_ref<JIImage> image)
    : image_(facebook::jni::make_global(image)) {
  // This is not needed once we fully migrate to JSI.
  auto mediaUtilsClass = getMediaUtilsClass();
  auto wrapObjectMethod =
      mediaUtilsClass->getStaticMethod<std::string(alias_ref<JObject>)>(
          "wrapObject");
  id_ = wrapObjectMethod(mediaUtilsClass, image)->toStdString();
}

std::string Image::getId() const {
  return id_;
}

double Image::getWidth() const noexcept {
  return image_->getWidth();
}

double Image::getHeight() const noexcept {
  return image_->getHeight();
}

double Image::getNaturalWidth() const noexcept {
  return image_->getNaturalWidth();
}

double Image::getNaturalHeight() const noexcept {
  return image_->getNaturalHeight();
}

double Image::getPixelDensity() const noexcept {
  return image_->getPixelDensity();
}

std::shared_ptr<IImage> Image::scale(double sx, double sy) const {
  return image_->scale(sx, sy);
}

void Image::close() const {
  image_->close();

  // This is not needed once we fully migrate to JSI.
  auto mediaUtilsClass = getMediaUtilsClass();
  auto releaseMethod =
      mediaUtilsClass->getStaticMethod<void(std::string)>("releaseObject");
  try {
    releaseMethod(mediaUtilsClass, id_);
  } catch (JniException& e) {
    // JniException extends std::exception, so "catch (std::exception& exn)"
    // also works.
    throw std::runtime_error(e.what());
  }
}

} // namespace media
} // namespace torchlive
