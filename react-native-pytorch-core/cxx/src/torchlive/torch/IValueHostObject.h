/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#pragma once

#include <jsi/jsi.h>

// Suppress deprecated-declarations error to support Clang/C++17
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"
#include <torch/script.h>
#pragma clang diagnostic pop

#include "../common/BaseHostObject.h"

namespace torchlive {
namespace torch {

class JSI_EXPORT IValueHostObject : public common::BaseHostObject {
 public:
  explicit IValueHostObject(facebook::jsi::Runtime& runtime, at::IValue v);

  at::IValue value;
};

} // namespace torch
} // namespace torchlive
