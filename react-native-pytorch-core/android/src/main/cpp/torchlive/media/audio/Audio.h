/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#pragma once

#include <fbjni/fbjni.h>
#include <torchlive/media/audio/IAudio.h>
#include <string>

#include "JIAudio.h"

namespace torchlive {
namespace media {

class Audio : public IAudio {
 public:
  Audio(facebook::jni::alias_ref<JIAudio> audio);
  ~Audio() override;

  std::string getId() const override;

  void play() const noexcept override;

  void pause() const noexcept override;

  void stop() const noexcept override;

  int getDuration() const noexcept override;

  void close() const override;

 private:
  facebook::jni::global_ref<JIAudio> audio_;
  std::string id_;
};

} // namespace media
} // namespace torchlive
