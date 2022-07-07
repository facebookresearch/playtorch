/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#pragma once

#import <Foundation/Foundation.h>
#import <string>
#import "PyTorchCore-Swift-Header.h"
#import "cxx/src/torchlive/media/audio/IAudio.h"

namespace torchlive {
namespace media {

class Audio : public IAudio {
 public:
  Audio(PTLAudio* audio);
  ~Audio() override = default;

  std::string getId() const override;

  void play() const noexcept override;

  void pause() const noexcept override;

  void stop() const noexcept override;

  int getDuration() const noexcept override;

  void close() const override;

 private:
  PTLAudio* audio_;
  std::string id_;
};

} // namespace media
} // namespace torchlive
