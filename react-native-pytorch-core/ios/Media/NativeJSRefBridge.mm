/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <memory>
#import <string>

#import "../../cxx/src/torchlive/media/Blob.h"
#import "../../cxx/src/torchlive/media/NativeJSRefBridge.h"
#import "../../cxx/src/torchlive/media/image/ImageHostObject.h"
#import "Image/Image.h"
#import "MediaUtils.h"

extern "C" const char* torchlive_media_beginReadData(const char*);
extern "C" void torchlive_media_endReadData(const char*);
extern "C" uint8_t* const torchlive_media_getDirectBytes(const char*);
extern "C" size_t torchlive_media_getDirectSize(const char*);

namespace torchlive {
namespace media {

std::shared_ptr<IImage> imageFromBlob(
    const Blob& blob,
    double width,
    double height) {
  auto image = MediaUtilsImageFromBlob(blob, width, height);
  if (image == nil) {
    return nullptr;
  }
  
  try {
    return std::make_shared<Image>(image);
  } catch (...) {
    return nullptr;
  }
}

std::unique_ptr<torchlive::media::Blob> toBlob(const std::string& refId) {
  auto idRef = refId.c_str();
  auto mediaDataRef = torchlive_media_beginReadData(idRef);
  uint8_t* const tmpBuffer = torchlive_media_getDirectBytes(mediaDataRef);
  size_t size = torchlive_media_getDirectSize(mediaDataRef);
  auto data = std::unique_ptr<uint8_t[]>(new uint8_t[size]);
  std::memcpy(data.get(), tmpBuffer, size);
  torchlive_media_endReadData(mediaDataRef);
  return std::make_unique<torchlive::media::Blob>(std::move(data), size);
}

} // namespace media
} // namespace torchlive
