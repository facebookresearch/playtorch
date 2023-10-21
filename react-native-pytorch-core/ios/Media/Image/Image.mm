/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "Image.h"

#import "PyTorchCore-Swift-Header.h"

namespace torchlive {
namespace media {

Image::Image(UIImage *image) : image_(image) {}

std::string Image::getId() const {
  return "LEGACY_VALUE_DO_NOT_USE";
}

double Image::getWidth() const noexcept {
  return image_.size.width;
}

double Image::getHeight() const noexcept {
  return image_.size.height;
}

double Image::getNaturalWidth() const noexcept {
  // Note: on Android, returns the width in device pixels so that it can be properly redrawn back to the canvas
  // Since iOS always uses points (density independent), this will return the same as getWidth so that it can be
  // properly redrawn back to the canvas
  return image_.size.width;
}

double Image::getNaturalHeight() const noexcept {
  // Note: on Android, returns the width in device pixels so that it can be properly redrawn back to the canvas
  // Since iOS always uses points (density independent), this will return the same as getWidth so that it can be
  // properly redrawn back to the canvas
  return image_.size.height;
}

double Image::getPixelDensity() const noexcept {
  return 1.0;
}

std::shared_ptr<IImage> Image::scale(double sx, double sy) const {
  CGFloat width = image_.size.width * sx;
  CGFloat height = image_.size.height * sy;

  CGSize size = CGSizeMake(NSUInteger(width), NSUInteger(height));
  CGRect rect = CGRectMake(0, 0, size.width, size.height);

  UIGraphicsBeginImageContextWithOptions(size, NO, 1);
  [image_ drawInRect:rect];
  UIImage *scaledImage = UIGraphicsGetImageFromCurrentImageContext();
  UIGraphicsEndImageContext();

  return std::make_shared<Image>(scaledImage);
}

void Image::close() const {}

} // namespace media
} // namespace torchlive
