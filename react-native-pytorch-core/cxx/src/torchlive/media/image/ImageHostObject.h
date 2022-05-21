/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#pragma once

#include <jsi/jsi.h>
#include "../../common/BaseHostObject.h"
#include "IImage.h"

namespace torchlive {
namespace media {

class JSI_EXPORT ImageHostObject : public common::BaseHostObject {
 public:
  explicit ImageHostObject(
      facebook::jsi::Runtime& runtime,
      std::shared_ptr<IImage> image);

  std::shared_ptr<IImage> getImage() const noexcept;

 private:
  std::shared_ptr<IImage> image_;
};

} // namespace media
} // namespace torchlive
