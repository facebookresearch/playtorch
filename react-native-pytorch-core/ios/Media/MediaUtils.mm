/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "MediaUtils.h"

#import <vector>
#import "cxx/src/torchlive/media/Blob.h"

UIImage *MediaUtilsImageFromBlob(const torchlive::media::Blob& blob,
                                 double width,
                                 double height)
{
  // blob data format should be RGB
  if (blob.getDirectSize() != static_cast<int>(width * height * 3)) {
    return nil;
  }

  // Add alpha
  std::vector<uint8_t> buffer;
  buffer.reserve(width * height * 4);
  auto p = blob.getDirectBytes();
  for (auto i = 0; i < width * height; i++) {
    buffer.push_back(*(p++));  // R
    buffer.push_back(*(p++));  // G
    buffer.push_back(*(p++));  // B
    buffer.push_back(255);     // A
  }

  CGColorSpaceRef colorSpace = CGColorSpaceCreateDeviceRGB();
  CGContextRef bitmapContext = CGBitmapContextCreate(buffer.data(),
                                                     width,
                                                     height,
                                                     8,
                                                     4 * width,
                                                     colorSpace,
                                                     kCGImageAlphaNoneSkipLast | kCGBitmapByteOrderDefault);
  CFRelease(colorSpace);
  CGImageRef cgImage = CGBitmapContextCreateImage(bitmapContext);
  CGContextRelease(bitmapContext);

  UIImage *image = [UIImage imageWithCGImage:cgImage];
  CGImageRelease(cgImage);

  return image;;
}
