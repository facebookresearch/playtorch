/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include <jsi/jsi.h>

#include <torch/script.h>

#include "../TensorHostObject.h"

namespace torchlive {
namespace utils {
namespace helpers {

/*
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

/*
 * A helper method to parse the tensor provided as an input argument and
 * convert it to a reference which holds a torch::Tensor
 */
torchlive::torch::TensorHostObject* parseTensor(
    facebook::jsi::Runtime& runtime,
    const facebook::jsi::Value* jsValue);

} // namespace helpers
} // namespace utils
} // namespace torchlive
