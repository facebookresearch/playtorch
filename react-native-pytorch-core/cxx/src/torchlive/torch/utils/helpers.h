/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include <jsi/jsi.h>
#include <torch/script.h>

// Namespace alias for torch to avoid namespace conflicts with torchlive::torch
namespace torch_ = torch;

namespace torchlive {
namespace utils {
namespace helpers {

using namespace facebook;

struct ParseSizeResult {
  int nextArgumentIndex;
  std::vector<int64_t> dimensions;
};
/*
 * A helper method to parse input arguments if given as a collection, tuple or a
 * sequence of numbers
 */
ParseSizeResult parseSize(
    jsi::Runtime& runtime,
    const jsi::Value* arguments,
    int argIndex,
    size_t count);

} // namespace helpers
} // namespace utils
} // namespace torchlive
