/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#pragma once

#include <jsi/jsi.h>

#include <torch/csrc/jit/mobile/module.h>

#include "../../../common/BaseHostObject.h"
#include "../../../torchlive.h"

// Namespace alias for torch to avoid namespace conflicts with torchlive::torch
namespace torch_ = torch;

namespace torchlive {
namespace torch {
namespace jit {
namespace mobile {

class JSI_EXPORT ModuleHostObject : public common::BaseHostObject {
 public:
  explicit ModuleHostObject(
      facebook::jsi::Runtime& runtime,
      torchlive::RuntimeExecutor runtimeExecutor,
      torch_::jit::mobile::Module m);

  torch_::jit::mobile::Module mobileModule;
};

} // namespace mobile
} // namespace jit
} // namespace torch
} // namespace torchlive
