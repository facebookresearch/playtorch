/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include "constants.h"

// Namespace alias for torch to avoid namespace conflicts with torchlive::torch
namespace torch_ = torch;

namespace torchlive {
namespace utils {
namespace constants {

// using namespace facebook

torch_::Dtype getDtypeFromString(std::string dtypeStr) {
  if (dtypeStr == constants::UINT8) {
    return torch_::kUInt8;
  } else if (dtypeStr == constants::INT8) {
    return torch_::kInt8;
  } else if (dtypeStr == constants::INT16 || dtypeStr == constants::SHORT) {
    return torch_::kInt16;
  } else if (dtypeStr == constants::INT32 || dtypeStr == constants::INT) {
    return torch_::kInt32;
  } else if (dtypeStr == constants::INT64 || dtypeStr == constants::LONG) {
    return torch_::kInt64;
  } else if (dtypeStr == constants::FLOAT32 || dtypeStr == constants::FLOAT) {
    return torch_::kFloat32;
  } else if (dtypeStr == constants::FLOAT64 || dtypeStr == constants::DOUBLE) {
    return torch_::kFloat64;
  } else {
    throw std::runtime_error("Cannot convert String to tensor dtype");
  }
}

std::string getStringFromDtype(torch_::Dtype dtype) {
  if (dtype == torch_::kUInt8) {
    return constants::UINT8;
  } else if (dtype == torch_::kInt8) {
    return constants::INT8;
  } else if (dtype == torch_::kInt16) {
    return constants::INT16;
  } else if (dtype == torch_::kInt32) {
    return constants::INT32;
  } else if (dtype == torch_::kInt64) {
    return constants::INT64;
  } else if (dtype == torch_::kFloat32) {
    return constants::FLOAT32;
  } else if (dtype == torch_::kFloat64) {
    return constants::FLOAT64;
  } else {
    throw std::runtime_error("Cannot convert tensor dtype to String");
  }
}

} // namespace constants
} // namespace utils
} // namespace torchlive
