/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#pragma once

#include <jsi/jsi.h>

#include <torch/script.h>

namespace torchlive {
namespace utils {
namespace converter {

/**
 * A helper method to unpack a IValue object into a jsi::Value
 */
facebook::jsi::Value ivalueToJSIValue(
    facebook::jsi::Runtime& runtime,
    const at::IValue&);

} // namespace converter
} // namespace utils
} // namespace torchlive
