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

class IAudio {
 public:
  virtual ~IAudio() = default;

  // ID is needed and that it is a temp solution until NativeJSRef is
  // deprecated.
  // TODO(T120733560): Remove ID for IAudio once NativeJSRef is deprecated
  virtual std::string getId() const = 0;

  virtual void play() const noexcept = 0;

  virtual void pause() const noexcept = 0;

  virtual void stop() const noexcept = 0;

  virtual int getDuration() const noexcept = 0;

  virtual void close() const = 0;
};

} // namespace media
} // namespace torchlive
