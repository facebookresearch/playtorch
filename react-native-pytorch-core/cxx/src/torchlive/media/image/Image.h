/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#pragma once

namespace torchlive {
namespace media {

class Image {
 public:
  double getWidth() const noexcept;

  double getHeight() const noexcept;

  double getNaturalWidth() const noexcept;

  double getNaturalHeight() const noexcept;

  double getPixelDensity() const noexcept;

  Image scale(double sx, double sy) const;

  void close() const;
};

} // namespace media
} // namespace torchlive
