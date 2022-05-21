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

class IImage {
 public:
  virtual ~IImage() = default;

  virtual double getWidth() const noexcept = 0;

  virtual double getHeight() const noexcept = 0;

  virtual double getNaturalWidth() const noexcept = 0;

  virtual double getNaturalHeight() const noexcept = 0;

  virtual double getPixelDensity() const noexcept = 0;

  virtual std::shared_ptr<IImage> scale(double sx, double sy) const = 0;

  virtual void close() const = 0;
};

} // namespace media
} // namespace torchlive
