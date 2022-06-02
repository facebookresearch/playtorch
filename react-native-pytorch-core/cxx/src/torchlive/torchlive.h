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

// Match definition in ReactCommon/RuntimeExecutor.h to avoid React Native
// dependency in JSI bindings.
using RuntimeExecutor =
    std::function<void(std::function<void(jsi::Runtime& runtime)>&& callback)>;

// Use runtime to run JS now. Use runtimeExecutor to run JS later from any
// thread, such as an asynchronous callback.
void install(jsi::Runtime& runtime, RuntimeExecutor runtimeExecutor);

} // namespace torchlive
