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

using namespace facebook::jsi;
using namespace facebook::hermes;

namespace torchlive {
void install(Runtime& runtime);
}

namespace {

class TensorHermesRuntimeTestBase : public ::testing::Test {
 public:
  TensorHermesRuntimeTestBase(::hermes::vm::RuntimeConfig runtimeConfig)
      : rt(makeHermesRuntime(runtimeConfig)) {}

 protected:
  Value eval(const char* code) {
    return rt->global().getPropertyAsFunction(*rt, "eval").call(*rt, code);
  }
  Value eval(const std::string& code) {
    return rt->global().getPropertyAsFunction(*rt, "eval").call(*rt, code);
  }

  std::shared_ptr<HermesRuntime> rt;
};

class TensorHermesRuntimeTest : public TensorHermesRuntimeTestBase {
 public:
  TensorHermesRuntimeTest()
      : TensorHermesRuntimeTestBase(::hermes::vm::RuntimeConfig::Builder()
                                        .withES6Proxy(true)
                                        .withES6Promise(true)
                                        .build()) {}
};

class TorchliveTensorRuntimeTest : public TensorHermesRuntimeTest {
 public:
  TorchliveTensorRuntimeTest() : TensorHermesRuntimeTest() {
    // Install the torchlive objects
    torchlive::install(*rt);
  }
};

TEST_F(TorchliveTensorRuntimeTest, TensorTest) {
  std::string tensorIndexWithNumber =
      R"(
        const tensor = torch.tensor([[128], [255]]);
        const tensor1 = tensor[0];
        const tensor2 = tensor[1];
        tensor1.data[0] == 128 && tensor2.data[0] == 255;
      )";
  EXPECT_TRUE(eval(tensorIndexWithNumber).getBool());

  std::string tensorIndexWithNumberString =
      R"(
        const tensor = torch.tensor([[128], [255]]);
        const tensor1 = tensor['0'];
        const tensor2 = tensor['1'];
        tensor1.data[0] == 128 && tensor2.data[0] == 255;
      )";
  EXPECT_TRUE(eval(tensorIndexWithNumberString).getBool());

  EXPECT_THROW(
      eval("torch.tensor([[128], [255]])['foo']"), facebook::jsi::JSError);
  EXPECT_THROW(
      eval("torch.tensor([[128], [255]])[-1]"), facebook::jsi::JSError);
  EXPECT_THROW(eval("torch.tensor([[128], [255]])[2]"), facebook::jsi::JSError);
}

TEST_F(TorchliveTensorRuntimeTest, TensorDivTest) {
  std::string tensorDivWithNumber =
      R"(
        const tensor = torch.tensor([0, 255]);
        const result = tensor.div(255);
        result.data[0] == 0 && result.data[1] == 1
      )";
  EXPECT_TRUE(eval(tensorDivWithNumber.c_str()).getBool());

  for (auto i = 0; i < 4; i++) {
    std::string tensorDivWithNumber = fmt::format(
        R"(
          const tensor = torch.arange(1, 5);
          const result = tensor.div(2);
          result.data[{}] == tensor.data[{}] / 2;
        )",
        i,
        i);
    EXPECT_TRUE(eval(tensorDivWithNumber.c_str()).getBool());
  }

  for (auto i = 0; i < 4; i++) {
    std::string tensorDivWithTensor = fmt::format(
        R"(
          const tensor1 = torch.arange(1, 5);
          const tensor2 = torch.arange(1, 5);
          const result = tensor1.div(tensor2);
          result.data[{}] == tensor1.data[{}] / tensor2.data[{}];
        )",
        i,
        i,
        i);
    EXPECT_TRUE(eval(tensorDivWithTensor.c_str()).getBool());
  }

  EXPECT_THROW(eval("torch.arange(1, 5).div()"), facebook::jsi::JSError);
  EXPECT_THROW(
      eval("torch.arange(1, 5).div(torch.arrange(3, 4), 'foo')"),
      facebook::jsi::JSError);
}

} // namespace
