/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#pragma once

#include <jsi/jsi.h>
#include <map>

#include "../torchlive.h"

namespace torchlive {
namespace torch {

class JSI_EXPORT TorchHostObject : public facebook::jsi::HostObject {
  facebook::jsi::Function arange_;
  facebook::jsi::Function empty_;
  facebook::jsi::Function eye_;
  facebook::jsi::Function fromBlob_;
  facebook::jsi::Function ones_;
  facebook::jsi::Function rand_;
  facebook::jsi::Function randint_;
  facebook::jsi::Function tensor_;
  facebook::jsi::Function zeros_;

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
  static facebook::jsi::Function createArange(facebook::jsi::Runtime& runtime);
  static facebook::jsi::Function createEmpty(facebook::jsi::Runtime& runtime);
  static facebook::jsi::Function createEye(facebook::jsi::Runtime& runtime);
  static facebook::jsi::Function createFromBlob(
      facebook::jsi::Runtime& runtime);
  static facebook::jsi::Function createOnes(facebook::jsi::Runtime& runtime);
  static facebook::jsi::Function createRand(facebook::jsi::Runtime& runtime);
  static facebook::jsi::Function createRandint(facebook::jsi::Runtime& runtime);
  static facebook::jsi::Function createTensor(facebook::jsi::Runtime& runtime);
  static facebook::jsi::Function createZeros(facebook::jsi::Runtime& runtime);
  std::map<std::string, facebook::jsi::Function*> methods;
  std::map<std::string, std::string> properties;
  facebook::jsi::Object jit_;
};

} // namespace torch
} // namespace torchlive
