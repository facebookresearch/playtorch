/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#pragma once

#include <jsi/jsi.h>
#include <map>

#include "../common/BaseHostObject.h"
#include "../torchlive.h"

namespace torchlive {
namespace torch {

class JSI_EXPORT TorchHostObject : public common::BaseHostObject {
 public:
  TorchHostObject(
      facebook::jsi::Runtime& runtime,
      torchlive::RuntimeExecutor runtimeExecutor);

  facebook::jsi::Value get(
      facebook::jsi::Runtime&,
      const facebook::jsi::PropNameID& name) override;
  std::vector<facebook::jsi::PropNameID> getPropertyNames(
      facebook::jsi::Runtime& rt) override;

 private:
  torchlive::RuntimeExecutor runtimeExecutor_;
  std::map<std::string, std::string> properties;
  facebook::jsi::Object jit_;
};

} // namespace torch
} // namespace torchlive
