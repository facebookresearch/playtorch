/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#pragma once

#include <jsi/jsi.h>

#include "../common/BaseHostObject.h"
#include "../torchlive.h"
#include "Blob.h"

namespace torchlive {
namespace media {

class JSI_EXPORT BlobHostObject : public torchlive::common::BaseHostObject {
 public:
  explicit BlobHostObject(
      facebook::jsi::Runtime& runtime,
      std::unique_ptr<torchlive::media::Blob>&& b);

  std::unique_ptr<torchlive::media::Blob> blob;
};

} // namespace media
} // namespace torchlive
