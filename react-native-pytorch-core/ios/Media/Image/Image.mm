/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "Image.h"

#import <AVFoundation/AVFoundation.h>
#import "react_native_pytorch_core-Swift.h"

namespace torchlive {
namespace media {

Image::Image(UIImage *image) : image_(image) {
  NSString *refId = [ImageModule wrapImage:image];
  if (refId == nil) {
    throw "error on wrapImage";
  }
  id_ = std::string([refId UTF8String]);
}

std::string Image::getId() const {
  return id_;
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

void Image::close() const {
  // This is not needed once we fully migrate to JSI.
  NSError *error = nil;
  [PTLJSContext releaseWithJsRef:@{@"ID": [NSString stringWithUTF8String:id_.c_str()]} error:&error];
  if (error != nil) {
    throw [error.localizedDescription UTF8String];
  }
}

} // namespace media
} // namespace torchlive
