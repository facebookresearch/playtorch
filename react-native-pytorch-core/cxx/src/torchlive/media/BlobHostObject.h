/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#pragma once

#include <jsi/jsi.h>

#include "Blob.h"

namespace torchlive {
namespace media {

class JSI_EXPORT BlobHostObject : public facebook::jsi::HostObject {
  facebook::jsi::Function arrayBuffer_;
  facebook::jsi::Function free_;

 public:
  explicit BlobHostObject(
      facebook::jsi::Runtime& runtime,
      torchlive::media::Blob b);

  facebook::jsi::Value get(
      facebook::jsi::Runtime&,
      const facebook::jsi::PropNameID& name) override;
  std::vector<facebook::jsi::PropNameID> getPropertyNames(
      facebook::jsi::Runtime& runtime) override;

  torchlive::media::Blob blob;

 private:
  facebook::jsi::Function createArrayBuffer(facebook::jsi::Runtime& runtime);
  facebook::jsi::Function createFree(facebook::jsi::Runtime& runtime);
};

} // namespace media
} // namespace torchlive
