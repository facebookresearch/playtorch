/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#pragma once

#include <jsi/jsi.h>

namespace torchlive {
namespace media {

class JSI_EXPORT NativeJSRefBridgeHostObject
    : public facebook::jsi::HostObject {
  facebook::jsi::Function toBlob_;

 public:
  explicit NativeJSRefBridgeHostObject(facebook::jsi::Runtime& runtime);

  facebook::jsi::Value get(
      facebook::jsi::Runtime&,
      const facebook::jsi::PropNameID& name) override;
  std::vector<facebook::jsi::PropNameID> getPropertyNames(
      facebook::jsi::Runtime& runtime) override;

 private:
  static facebook::jsi::Function createToBlob(facebook::jsi::Runtime& runtime);
};

} // namespace media
} // namespace torchlive
