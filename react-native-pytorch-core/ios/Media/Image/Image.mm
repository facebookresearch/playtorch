/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "Image.h"

namespace torchlive {
namespace media {

//TODO(T116845603): update these with real image data

Image::Image(UIImage *image) noexcept {}

double Image::getWidth() const noexcept {
  return 11;
}

double Image::getHeight() const noexcept {
  return 10;
}

double Image::getNaturalWidth() const noexcept {
  return 10;
}

double Image::getNaturalHeight() const noexcept {
  return 10;
}

double Image::getPixelDensity() const noexcept {
  return 1;
}

std::shared_ptr<IImage> Image::scale(double sx, double sy) const {
  return nullptr;
}

void Image::close() const {
  // do nothing
}

} // namespace media
} // namespace torchlive
