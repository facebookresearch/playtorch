/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include <string>

#include "../../cxx/src/torchlive/media/NativeJSRefBridge.h"

extern "C" const char* torchlive_media_beginReadData(const char*);
extern "C" void torchlive_media_endReadData(const char*);
extern "C" uint8_t* const torchlive_media_getDirectBytes(const char*);
extern "C" size_t torchlive_media_getDirectSize(const char*);

namespace torchlive {
namespace media {

facebook::jsi::Object imageFromBlob(
    facebook::jsi::Runtime& runtime,
    const Blob& blob,
    double width,
    double height) {
  return facebook::jsi::Object::createFromHostObject(runtime, nullptr);
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
