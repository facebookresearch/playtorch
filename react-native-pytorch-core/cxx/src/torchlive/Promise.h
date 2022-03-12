/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#pragma once

#include <jsi/jsi.h>

#include <functional>
#include <memory>
#include <string>

namespace torchlive {

// Helper for Promises in JSI. This was taken from React Native except without
// subclassing LongLivedObject.
//
// https://github.com/facebook/react-native/blob/v0.67.3/ReactCommon/react/nativemodule/core/ReactCommon/TurboModuleUtils.h
struct Promise {
  Promise(
      facebook::jsi::Runtime& rt,
      facebook::jsi::Function resolve,
      facebook::jsi::Function reject);

  void resolve(const facebook::jsi::Value& result);
  void reject(const std::string& error);

  facebook::jsi::Runtime& runtime_;
  facebook::jsi::Function resolve_;
  facebook::jsi::Function reject_;
};

using PromiseSetupFunctionType =
    std::function<void(facebook::jsi::Runtime& rt, std::shared_ptr<Promise>)>;
facebook::jsi::Value createPromiseAsJSIValue(
    facebook::jsi::Runtime& rt,
    const PromiseSetupFunctionType func);

} // namespace torchlive
