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

torchlive::media::Blob toBlob(const std::string& refId) {
  torchlive::media::Blob blob(new uint8_t[0], 0);
  return blob;
}

} // namespace media
} // namespace torchlive

#endif
