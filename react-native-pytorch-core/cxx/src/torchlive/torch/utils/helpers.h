/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#pragma once

#include <jsi/jsi.h>

#include <torch/script.h>

#include "../TensorHostObject.h"

namespace torchlive {
namespace utils {
namespace helpers {

/**
 * A helper method to parse input arguments if given as a collection, tuple or a
 * sequence of numbers. Modifies the input vector of integers with the size
 * dimensions parsed from arguments and returns the next argument index to be
 * processed.
 */
int parseSize(
    facebook::jsi::Runtime& runtime,
    const facebook::jsi::Value* arguments,
    int argIndex,
    size_t count,
    std::vector<int64_t>* dimensions);

/**
 * A helper method to parse the tensor provided as an input argument and
 * convert it to a reference which holds a torch::Tensor
 */
torchlive::torch::TensorHostObject* parseTensor(
    facebook::jsi::Runtime& runtime,
    const facebook::jsi::Value* jsValue);

/**
 * A helper method to parse the operands for torch operations which require 2
 * operands and sets the references passed in with the parsed results.
 */
void parseArithmeticOperands(
    facebook::jsi::Runtime& runtime,
    const facebook::jsi::Value* arguments,
    size_t count,
    torchlive::torch::TensorHostObject** operand1Tensor,
    torchlive::torch::TensorHostObject** operand2Tensor,
    double** operand2Number);

/*
 * A helper method used to parse tensor options from the input arguments.
 */
torch_::TensorOptions parseTensorOptions(
    facebook::jsi::Runtime& runtime,
    const facebook::jsi::Value* arguments,
    int argIndex,
    size_t count);

/*
 * A helper method used to parse a keyword argument.
 */
facebook::jsi::Value parseKeywordArgument(
    facebook::jsi::Runtime& runtime,
    const facebook::jsi::Value* arguments,
    int argIndex,
    size_t count,
    const char* key);

/**
 * A helper method to parse the data of a nested JSI Array of number
 * as a vector of double.
 */
std::vector<double> parseJSIArrayData(
    facebook::jsi::Runtime& runtime,
    const facebook::jsi::Value& val);

/**
 * A helper method to parse the shape of a nested JSI Array of number
 * as a vector of 64-bit integer.
 */
std::vector<int64_t> parseJSIArrayShape(
    facebook::jsi::Runtime& runtime,
    const facebook::jsi::Value& val);

/**
 * A helper method to assign a HostFunction to an Object property.
 */
void setPropertyHostFunction(
    facebook::jsi::Runtime& runtime,
    facebook::jsi::Object& obj,
    const std ::string& name,
    size_t paramCount,
    facebook::jsi::HostFunctionType hostFunc);

/**
 * A helper method for the common pattern of creating and wrapping a HostObject
 * instance to return as a jsi::Value.
 */
template <typename T, typename... Args>
inline facebook::jsi::Object createFromHostObject(
    facebook::jsi::Runtime& runtime,
    Args&&... args) {
  auto hostObject = std::make_shared<T>(runtime, std::forward<Args>(args)...);
  return facebook::jsi::Object::createFromHostObject(
      runtime, std::move(hostObject));
}

} // namespace helpers
} // namespace utils
} // namespace torchlive
