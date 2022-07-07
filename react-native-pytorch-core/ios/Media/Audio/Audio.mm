/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "Audio.h"

namespace torchlive {
namespace media {

Audio::Audio(PTLAudio *audio) : audio_(audio) {
  NSString *refId = [AudioModule wrapAudio:audio];
  id_ = std::string([refId UTF8String]);
}

std::string Audio::getId() const {
  return id_;
}

void Audio::play() const noexcept {
  [audio_ play];
}

void Audio::pause() const noexcept {
  [audio_ pause];
}

void Audio::stop() const noexcept {
  [audio_ stop];
}

int Audio::getDuration() const noexcept {
  return static_cast<int>([audio_ getDuration]);
}

void Audio::close() const {
  // This is not needed once we fully migrate to JSI.
  NSError *error = nil;
  [PTLJSContext releaseWithJsRef:@{@"ID": [NSString stringWithUTF8String:id_.c_str()]} error:&error];
  if (error != nil) {
    throw [error.localizedDescription UTF8String];
  }
}

} // namespace media
} // namespace torchlive
