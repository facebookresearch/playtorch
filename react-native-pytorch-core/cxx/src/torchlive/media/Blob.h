/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#pragma once

#include <memory>
#include <string>

namespace torchlive {
namespace media {

class Blob {
 public:
  // Keep blob type constants in sync with
  // iOS: ios/media/MediaToBlob.swift
  // Android: android/src/main/java/org/pytorch/rn/core/media/BlobUtils.java
  static constexpr const char* kBlobTypeImageGrayscale =
      "image/x-playtorch-grayscale";
  static constexpr const char* kBlobTypeImageRGB = "image/x-playtorch-rgb";
  static constexpr const char* kBlobTypeImageRGBA = "image/x-playtorch-rgba";
  static constexpr const char* kBlobTypeAudio = "audio/x-playtorch";

  Blob(
      std::unique_ptr<uint8_t[]>&& buffer,
      size_t byteLength,
      const std::string& type = "");

  uint8_t* getDirectBytes() const;
  size_t getDirectSize() const noexcept;
  const std::string& getType() const noexcept;

 private:
  std::unique_ptr<uint8_t[]> buffer_;
  size_t byteLength_;
  std::string type_;
};

} // namespace media
} // namespace torchlive
