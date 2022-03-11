/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#pragma once

#include <gtest/gtest.h>
#include <hermes/hermes.h>
#include <torchlive/torchlive.h>
#include <string>

namespace torchlive {
namespace test {

class HermesRuntimeTestBase : public ::testing::Test {
 public:
  HermesRuntimeTestBase(::hermes::vm::RuntimeConfig runtimeConfig)
      : rt(facebook::hermes::makeHermesRuntime(runtimeConfig)) {}

 protected:
  std::shared_ptr<facebook::hermes::HermesRuntime> rt;
};

class HermesRuntimeTest : public HermesRuntimeTestBase {
 public:
  HermesRuntimeTest()
      : HermesRuntimeTestBase(::hermes::vm::RuntimeConfig::Builder()
                                  .withES6Proxy(true)
                                  .withES6Promise(true)
                                  .build()) {}
};

// Base class for torchlive tests
class TorchliveTestBase : public HermesRuntimeTest {
 protected:
  facebook::jsi::Value eval(const std::string& code) {
    return rt->global().getPropertyAsFunction(*rt, "eval").call(*rt, code);
  }
};

// Base class for torchlive tests that installs JSI bindings
class TorchliveBindingsTestBase : public TorchliveTestBase {
 public:
  TorchliveBindingsTestBase() : TorchliveTestBase() {
    torchlive::install(*rt);
  }
};

} // namespace test
} // namespace torchlive
