/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#pragma once

#include <memory>

namespace torchlive {
namespace media {

class Blob {
 public:
  Blob(std::unique_ptr<uint8_t[]>&& b, size_t bl);

  uint8_t* const getDirectBytes() const;
  size_t getDirectSize() const;

 private:
  std::unique_ptr<uint8_t[]> buffer;
  size_t byteLength;
};

} // namespace media
} // namespace torchlive
