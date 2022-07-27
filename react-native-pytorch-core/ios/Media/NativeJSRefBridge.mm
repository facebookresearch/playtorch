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
#import "Audio/Audio.h"
#import "Image/Image.h"
#import "MediaUtils.h"
#import "PyTorchCore-Swift-Header.h"

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
  auto mediaDataRef = [PTLBlobUtils torchlive_media_beginReadDataWithCRefId:idRef];
  uint8_t* const tmpBuffer = [PTLBlobUtils torchlive_media_getDirectBytesWithCRefId:mediaDataRef];
  size_t size = [PTLBlobUtils torchlive_media_getDirectSizeWithCRefId:mediaDataRef];
  auto data = std::unique_ptr<uint8_t[]>(new uint8_t[size]);
  std::memcpy(data.get(), tmpBuffer, size);
  [PTLBlobUtils torchlive_media_endReadDataWithCRefId:mediaDataRef];
  return std::make_unique<torchlive::media::Blob>(std::move(data), size);
}

} // namespace media

namespace experimental {

std::shared_ptr<media::IAudio> audioFromBytes(
    const std::vector<uint8_t>& bytes,
    int sampleRate) {
  auto dataWithHeader = MediaUtilsPrependWAVHeader(bytes, sampleRate);
  auto audio = [[PTLAudio alloc] initWithAudioData:dataWithHeader];
  return std::make_shared<media::Audio>(audio);
}

} // namespace experimental

} // namespace torchlive
