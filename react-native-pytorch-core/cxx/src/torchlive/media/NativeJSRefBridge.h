/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#pragma once

#include <string>

#include "Blob.h"

namespace torchlive {
namespace media {

std::unique_ptr<torchlive::media::Blob> toBlob(const std::string& refId);

} // namespace media
} // namespace torchlive
