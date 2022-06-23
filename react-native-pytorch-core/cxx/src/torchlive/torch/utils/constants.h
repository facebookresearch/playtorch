/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#pragma once

#include <torch/script.h>

// Namespace alias for torch to avoid namespace conflicts with torchlive::torch
namespace torch_ = torch;

namespace torchlive {
namespace utils {
namespace constants {

// Tensor Data Type
const std::string DOUBLE = "double";
const std::string FLOAT = "float";
const std::string FLOAT32 = "float32";
const std::string FLOAT64 = "float64";
const std::string INT = "int";
const std::string INT16 = "int16";
const std::string INT32 = "int32";
const std::string INT64 = "int64";
const std::string INT8 = "int8";
const std::string LONG = "long";
const std::string SHORT = "short";
const std::string UINT8 = "uint8";

// Memory Format
const std::string CHANNELS_LAST = "channelsLast";
const std::string CONTIGUOUS_FORMAT = "contiguousFormat";
const std::string PRESERVE_FORMAT = "preserveFormat";

torch_::Dtype getDtypeFromString(std::string dtypeStr);

std::string getStringFromDtype(torch_::Dtype dtype);

} // namespace constants
} // namespace utils
} // namespace torchlive
