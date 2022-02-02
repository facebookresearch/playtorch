/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#pragma once

namespace facebook {
namespace jsi {

class Runtime;

} // namespace jsi
} // namespace facebook

namespace torchlive {

using namespace facebook;

void install(jsi::Runtime& runtime);

} // namespace torchlive
