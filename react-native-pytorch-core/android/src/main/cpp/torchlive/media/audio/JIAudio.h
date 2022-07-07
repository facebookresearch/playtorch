/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#pragma once

#include <fbjni/fbjni.h>
#include <torchlive/media/audio/IAudio.h>

namespace torchlive {
namespace media {

class JIAudio : public facebook::jni::JavaClass<JIAudio> {
 public:
  static constexpr auto kJavaDescriptor = "Lorg/pytorch/rn/core/audio/IAudio;";

  void play() const noexcept;

  void pause() const noexcept;

  void stop() const noexcept;

  int getDuration() const noexcept;

  void close() const;
};

} // namespace media
} // namespace torchlive
