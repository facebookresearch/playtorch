/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include <fmt/core.h>
#include <fmt/format.h>
#include <gtest/gtest.h>
#include <hermes/hermes.h>
#include <string>

using namespace facebook::jsi;
using namespace facebook::hermes;

namespace torchlive {
void install(Runtime& runtime);
}

namespace {

class HermesRuntimeTestBase : public ::testing::Test {
 public:
  HermesRuntimeTestBase(::hermes::vm::RuntimeConfig runtimeConfig)
      : rt(makeHermesRuntime(runtimeConfig)) {}

 protected:
  Value eval(const char* code) {
    return rt->global().getPropertyAsFunction(*rt, "eval").call(*rt, code);
  }

  std::shared_ptr<HermesRuntime> rt;
};

class HermesRuntimeTest : public HermesRuntimeTestBase {
 public:
  HermesRuntimeTest()
      : HermesRuntimeTestBase(::hermes::vm::RuntimeConfig::Builder()
                                  .withES6Proxy(true)
                                  .withES6Promise(true)
                                  .build()) {}
};

class TorchliveRuntimeTest : public HermesRuntimeTest {
 public:
  TorchliveRuntimeTest() : HermesRuntimeTest() {
    // Install the torchlive objects
    torchlive::install(*rt);
  }
};

TEST_F(TorchliveRuntimeTest, TorchObjectTest) {
  EXPECT_TRUE(eval("typeof torch === 'object'").getBool());
}

TEST_F(TorchliveRuntimeTest, TensorShapeTest) {
  EXPECT_EQ(eval("torch.rand([5]).shape[0]").getNumber(), 5);
}

TEST_F(TorchliveRuntimeTest, TensorSizeTest) {
  EXPECT_TRUE(eval("torch.rand([5]).size()[0] === 5").getBool());
}

TEST_F(TorchliveRuntimeTest, TensorDtypeTest) {
  EXPECT_EQ(eval("torch.rand([5]).dtype").asString(*rt).utf8(*rt), "float32");
  EXPECT_EQ(
      eval("torch.rand([5], {dtype:'float64'}).dtype").asString(*rt).utf8(*rt),
      "float64");
}

TEST_F(TorchliveRuntimeTest, TorchEmptyTest) {
  // Valid inputs
  EXPECT_TRUE(eval("torch.empty([1,2]).shape[0] === 1").getBool());
  EXPECT_TRUE(eval("torch.empty([1,2]).shape[1] === 2").getBool());
  EXPECT_TRUE(eval("torch.empty(1,2).shape[0] === 1").getBool());
  EXPECT_TRUE(eval("torch.empty(1,2).shape[1] === 2").getBool());
  EXPECT_EQ(
      eval("torch.empty([1,2], {dtype:'float64'}).dtype")
          .asString(*rt)
          .utf8(*rt),
      "float64");
  EXPECT_EQ(
      eval("torch.empty(1,2, {dtype:'float64'}).dtype").asString(*rt).utf8(*rt),
      "float64");

  // Invalid inputs
  EXPECT_THROW(
      eval("torch.empty(1,2,true, {dtype:'float64'}).dtype")
          .asString(*rt)
          .utf8(*rt),
      facebook::jsi::JSError);
  EXPECT_THROW(
      eval("torch.empty(1,2,[1], {dtype:'float64'}).dtype")
          .asString(*rt)
          .utf8(*rt),
      facebook::jsi::JSError);
  EXPECT_THROW(
      eval("torch.empty({dtype:'float64'}, 1).dtype").asString(*rt).utf8(*rt),
      facebook::jsi::JSError);
  EXPECT_THROW(
      eval("torch.empty({dtype:'float64'}).dtype").asString(*rt).utf8(*rt),
      facebook::jsi::JSError);
}

TEST_F(TorchliveRuntimeTest, TensorDataTest) {
  EXPECT_TRUE(eval("torch.rand([5]).data instanceof Float32Array").getBool());
  EXPECT_TRUE(
      eval(
          "torch.rand([5], {dtype: torch.double}).data instanceof Float64Array")
          .getBool());
}

TEST_F(TorchliveRuntimeTest, TensorToStringTest) {
  EXPECT_TRUE(eval("typeof torch.rand([5]).toString() === 'string'").getBool());
}

TEST_F(TorchliveRuntimeTest, TorchArangeTest) {
  EXPECT_EQ(eval("torch.arange(4).shape[0]").getNumber(), 4);
  EXPECT_EQ(eval("torch.arange(4).data[0]").getNumber(), 0);
  EXPECT_EQ(eval("torch.arange(4).data[1]").getNumber(), 1);
  EXPECT_EQ(eval("torch.arange(4).data[2]").getNumber(), 2);
  EXPECT_EQ(eval("torch.arange(4).data[3]").getNumber(), 3);

  EXPECT_EQ(eval("torch.arange(2, 5).shape[0]").getNumber(), 3);
  EXPECT_EQ(eval("torch.arange(2, 5).data[0]").getNumber(), 2);
  EXPECT_EQ(eval("torch.arange(2, 5).data[1]").getNumber(), 3);
  EXPECT_EQ(eval("torch.arange(2, 5).data[2]").getNumber(), 4);

  EXPECT_EQ(eval("torch.arange(1, 3.5, 0.5).shape[0]").getNumber(), 5);
  EXPECT_EQ(eval("torch.arange(1, 3.5, 0.5).data[0]").getNumber(), 1.0);
  EXPECT_EQ(eval("torch.arange(1, 3.5, 0.5).data[1]").getNumber(), 1.5);
  EXPECT_EQ(eval("torch.arange(1, 3.5, 0.5).data[2]").getNumber(), 2.0);
  EXPECT_EQ(eval("torch.arange(1, 3.5, 0.5).data[3]").getNumber(), 2.5);
  EXPECT_EQ(eval("torch.arange(1, 3.5, 0.5).data[4]").getNumber(), 3.0);
}

TEST_F(TorchliveRuntimeTest, TorchRandintTest) {
  EXPECT_EQ(eval("torch.randint(10, [2, 2]).shape[0]").getNumber(), 2);
  EXPECT_EQ(eval("torch.randint(10, [2, 2]).shape[1]").getNumber(), 2);
  for (auto i = 0; i < 4; i++) {
    std::string s = fmt::format("torch.randint(10, [2, 2]).data[{}]", i);
    EXPECT_GE(eval(s.c_str()).getNumber(), 0);
    EXPECT_LT(eval(s.c_str()).getNumber(), 10);
  }

  EXPECT_EQ(eval("torch.randint(3, 5, [3]).shape[0]").getNumber(), 3);
  for (auto i = 0; i < 3; i++) {
    std::string s = fmt::format("torch.randint(3, 5, [3]).data[{}]", i);
    EXPECT_GE(eval(s.c_str()).getNumber(), 3);
    EXPECT_LT(eval(s.c_str()).getNumber(), 5);
  }

  EXPECT_EQ(eval("torch.randint(3, 7, [3, 3, 4]).shape[2]").getNumber(), 4);
  for (auto i = 0; i < 36; i++) {
    std::string s = fmt::format("torch.randint(3, 7, [3, 3, 4]).data[{}]", i);
    EXPECT_GE(eval(s.c_str()).getNumber(), 3);
    EXPECT_LT(eval(s.c_str()).getNumber(), 7);
  }

  EXPECT_THROW(eval("torch.randint(1)"), facebook::jsi::JSError);
  EXPECT_THROW(eval("torch.randint(3, 7)"), facebook::jsi::JSError);
  EXPECT_THROW(eval("torch.randint([1], [3])"), facebook::jsi::JSError);
}
} // namespace
