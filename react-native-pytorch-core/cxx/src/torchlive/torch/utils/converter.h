/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#pragma once

#include <jsi/jsi.h>

#include <torch/script.h>

// Namespace alias for torch to avoid namespace conflicts with torchlive::torch
namespace torch_ = torch;

namespace torchlive {
namespace utils {
namespace converter {

/**
 * A helper method to unpack a IValue object into a jsi::Value
 */
facebook::jsi::Value ivalueToJSIValue(
    facebook::jsi::Runtime& runtime,
    const at::IValue&);

/*
 * A helper method used to pack a jsi::Value to an IValue
 */
torch_::jit::IValue jsiValuetoIValue(
    facebook::jsi::Runtime& runtime,
    const facebook::jsi::Value& jsValue);

} // namespace converter
} // namespace utils
} // namespace torchlive
