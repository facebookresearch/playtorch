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
extern "C" const uint8_t* torchlive_media_getDirectBytes(const char*);
extern "C" const size_t torchlive_media_getDirectSize(const char*);

namespace torchlive {
namespace media {

torchlive::media::Blob toBlob(const std::string& refId) {
  auto idRef = refId.c_str();
  auto mediaDataRef = torchlive_media_beginReadData(idRef);
  const uint8_t* tmpBuffer = torchlive_media_getDirectBytes(mediaDataRef);
  const size_t size = torchlive_media_getDirectSize(mediaDataRef);
  uint8_t* buffer = new uint8_t[size];
  memcpy(buffer, tmpBuffer, size);
  torchlive_media_endReadData(mediaDataRef);
  torchlive::media::Blob blob(std::move(buffer), size);
  return blob;
}

} // namespace media
} // namespace torchlive
