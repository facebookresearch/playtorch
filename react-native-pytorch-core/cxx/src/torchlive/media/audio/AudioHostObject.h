/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#pragma once

#include <jsi/jsi.h>
#include "../../common/BaseHostObject.h"
#include "IAudio.h"

namespace torchlive {
namespace media {

class JSI_EXPORT AudioHostObject : public common::BaseHostObject {
 public:
  explicit AudioHostObject(
      facebook::jsi::Runtime& runtime,
      std::shared_ptr<IAudio> audio);

  std::shared_ptr<IAudio> getAudio() const noexcept;

 private:
  std::shared_ptr<IAudio> audio_;
};

} // namespace media
} // namespace torchlive
