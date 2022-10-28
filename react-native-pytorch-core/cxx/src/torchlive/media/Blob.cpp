/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include "Blob.h"

namespace torchlive {
namespace media {

Blob::Blob(
    std::unique_ptr<uint8_t[]>&& buffer,
    size_t byteLength,
    const std::string& type)
    : buffer_(std::move(buffer)), byteLength_(byteLength), type_(type) {}

uint8_t* Blob::getDirectBytes() const {
  return buffer_.get();
}

size_t Blob::getDirectSize() const noexcept {
  return byteLength_;
}

const std::string& Blob::getType() const noexcept {
  return type_;
}

} // namespace media
} // namespace torchlive
