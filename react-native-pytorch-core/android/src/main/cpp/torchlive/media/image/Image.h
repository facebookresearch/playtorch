/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#pragma once

#include <fbjni/fbjni.h>
#include <torchlive/media/image/IImage.h>
#include <string>

#include "JIImage.h"

namespace torchlive {
namespace media {

class Image : public IImage {
 public:
  Image(facebook::jni::alias_ref<JIImage> image);
  ~Image() override = default;

  std::string getId() const override;

  double getWidth() const noexcept override;

  double getHeight() const noexcept override;

  double getNaturalWidth() const noexcept override;

  double getNaturalHeight() const noexcept override;

  double getPixelDensity() const noexcept override;

  std::shared_ptr<IImage> scale(double sx, double sy) const override;

  void close() const override;

 private:
  facebook::jni::global_ref<JIImage> image_;
  std::string id_;
};

} // namespace media
} // namespace torchlive
