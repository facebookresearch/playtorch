/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#pragma once

#include <fbjni/fbjni.h>
#include <torchlive/media/image/IImage.h>

namespace torchlive {
namespace media {

class JIImage : public facebook::jni::JavaClass<JIImage> {
 public:
  static constexpr auto kJavaDescriptor = "Lorg/pytorch/rn/core/image/IImage;";

  double getWidth() const noexcept;

  double getHeight() const noexcept;

  double getNaturalWidth() const noexcept;

  double getNaturalHeight() const noexcept;

  double getPixelDensity() const noexcept;

  std::shared_ptr<IImage> scale(double sx, double sy) const;

  void close() const;
};

} // namespace media
} // namespace torchlive
