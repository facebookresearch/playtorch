/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#pragma once

#include <jsi/jsi.h>

#include "../../torchlive.h"

namespace torchlive {
namespace torch {
namespace jit {

facebook::jsi::Object buildNamespace(
    facebook::jsi::Runtime& rt,
    torchlive::RuntimeExecutor rte);

} // namespace jit
} // namespace torch
} // namespace torchlive
