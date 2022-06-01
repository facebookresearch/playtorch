/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include "JIImage.h"
#include "Image.h"

namespace torchlive {
namespace media {

double JIImage::getWidth() const noexcept {
  static const auto method = getClass()->getMethod<jint()>("getWidth");
  return static_cast<double>(method(self()));
}

double JIImage::getHeight() const noexcept {
  static const auto method = getClass()->getMethod<jint()>("getHeight");
  return static_cast<double>(method(self()));
}

double JIImage::getNaturalWidth() const noexcept {
  static const auto method = getClass()->getMethod<jfloat()>("getNaturalWidth");
  return static_cast<double>(method(self()));
}

double JIImage::getNaturalHeight() const noexcept {
  static const auto method =
      getClass()->getMethod<jfloat()>("getNaturalHeight");
  return static_cast<double>(method(self()));
}

double JIImage::getPixelDensity() const noexcept {
  static const auto method = getClass()->getMethod<jfloat()>("getPixelDensity");
  return static_cast<double>(method(self()));
}

std::shared_ptr<IImage> JIImage::scale(double sx, double sy) const {
  static const auto method =
      getClass()->getMethod<facebook::jni::local_ref<JIImage>(jfloat, jfloat)>(
          "scale");
  auto image = method(self(), static_cast<float>(sx), static_cast<float>(sy));
  return std::make_shared<Image>(facebook::jni::make_global(image));
}

void JIImage::close() const {
  static const auto method = getClass()->getMethod<void()>("close");
  method(self());
}

} // namespace media
} // namespace torchlive
