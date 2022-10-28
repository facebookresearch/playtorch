/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#ifdef __ANDROID__
#elif __APPLE__
#else

#include "NativeJSRefBridge.h"

namespace torchlive {

namespace media {

std::shared_ptr<IImage>
imageFromBlob(const Blob& blob, double width, double height) {
  return nullptr;
}

std::unique_ptr<torchlive::media::Blob> toBlob(const std::string& refId) {
  size_t const size = 0;
  auto data = std::unique_ptr<uint8_t[]>(0);
  return std::make_unique<torchlive::media::Blob>(std::move(data), size);
}

std::unique_ptr<torchlive::media::Blob> toBlob(std::shared_ptr<IImage> image) {
  size_t const size = 0;
  auto data = std::unique_ptr<uint8_t[]>(0);
  return std::make_unique<torchlive::media::Blob>(std::move(data), size);
}

} // namespace media

namespace experimental {

std::shared_ptr<media::IAudio> audioFromBytes(
    const std::vector<uint8_t>& bytes,
    int sampleRate) {
  return nullptr;
}

} // namespace experimental

} // namespace torchlive

#endif
