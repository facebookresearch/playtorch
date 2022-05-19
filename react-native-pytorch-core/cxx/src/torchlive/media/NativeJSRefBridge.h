/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#pragma once

#include <jsi/jsi.h>
#include <string>

#include "Blob.h"

namespace torchlive {
namespace media {

facebook::jsi::Object imageFromBlob(
    facebook::jsi::Runtime& runtime,
    const Blob& blob,
    double width,
    double height);

std::unique_ptr<torchlive::media::Blob> toBlob(const std::string& refId);

} // namespace media
} // namespace torchlive
