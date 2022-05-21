/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include "Blob.h"

namespace torchlive {
namespace media {

Blob::Blob(std::unique_ptr<uint8_t[]>&& b, size_t bl)
    : buffer(std::move(b)), byteLength(bl) {}

uint8_t* const Blob::getDirectBytes() const {
  return this->buffer.get();
}

size_t Blob::getDirectSize() const {
  return this->byteLength;
}

} // namespace media
} // namespace torchlive
