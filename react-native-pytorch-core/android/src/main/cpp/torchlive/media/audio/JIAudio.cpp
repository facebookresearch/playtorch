/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include "JIAudio.h"

namespace torchlive {
namespace media {

void JIAudio::play() const noexcept {
  static const auto method = getClass()->getMethod<void()>("play");
  method(self());
}

void JIAudio::pause() const noexcept {
  static const auto method = getClass()->getMethod<void()>("pause");
  method(self());
}

void JIAudio::stop() const noexcept {
  static const auto method = getClass()->getMethod<void()>("stop");
  method(self());
}

int JIAudio::getDuration() const noexcept {
  static const auto method = getClass()->getMethod<jint()>("getDuration");
  return static_cast<int>(method(self()));
}

void JIAudio::close() const {
  static const auto method = getClass()->getMethod<void()>("close");
  method(self());
}

} // namespace media
} // namespace torchlive
