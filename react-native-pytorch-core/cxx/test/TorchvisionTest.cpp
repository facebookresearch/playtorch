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

class TorchvisionHermesRuntimeTestBase : public ::testing::Test {
 public:
  TorchvisionHermesRuntimeTestBase(::hermes::vm::RuntimeConfig runtimeConfig)
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

class TorchvisionHermesRuntimeTest : public TorchvisionHermesRuntimeTestBase {
 public:
  TorchvisionHermesRuntimeTest()
      : TorchvisionHermesRuntimeTestBase(::hermes::vm::RuntimeConfig::Builder()
                                             .withES6Proxy(true)
                                             .withES6Promise(true)
                                             .build()) {}
};

class TorchliveTorchvisionRuntimeTest : public TorchvisionHermesRuntimeTest {
 public:
  TorchliveTorchvisionRuntimeTest() : TorchvisionHermesRuntimeTest() {
    // Install the torchlive objects
    torchlive::install(*rt);
  }
};

TEST_F(TorchliveTorchvisionRuntimeTest, CenterCropTest) {
  std::string torchvisionCenterCropWithInt =
      R"(
        const tensor = torch.rand([20, 3, 1024, 1024]);
        const centerCrop = __torchlive_torchvision__.transforms.centerCrop(480);
        const centerCropped = centerCrop.forward(tensor);
        centerCropped.shape[0] == 20 && centerCropped.shape[1] == 3 && centerCropped.shape[2] == 480 && centerCropped.shape[3] == 480;
      )";
  EXPECT_TRUE(eval(torchvisionCenterCropWithInt).getBool());

  std::string torchvisionCenterCropWithUnaryArray =
      R"(
        const tensor = torch.rand([20, 3, 1024, 1024]);
        const centerCrop = __torchlive_torchvision__.transforms.centerCrop([480]);
        const centerCropped = centerCrop.forward(tensor);
        centerCropped.shape[0] == 20 && centerCropped.shape[1] == 3 && centerCropped.shape[2] == 480 && centerCropped.shape[3] == 480;
      )";
  EXPECT_TRUE(eval(torchvisionCenterCropWithUnaryArray).getBool());

  std::string torchvisionCenterCropWithBinaryArray =
      R"(
        const tensor = torch.rand([20, 3, 1024, 1024]);
        const centerCrop = __torchlive_torchvision__.transforms.centerCrop([480, 640]);
        const centerCropped = centerCrop.forward(tensor);
        centerCropped.shape[0] == 20 && centerCropped.shape[1] == 3 && centerCropped.shape[2] == 480 && centerCropped.shape[3] == 640;
      )";
  EXPECT_TRUE(eval(torchvisionCenterCropWithBinaryArray).getBool());

  std::string torchvisionCenterCropWithEmptyArray =
      R"(
        __torchlive_torchvision__.transforms.centerCrop([]);
      )";
  EXPECT_THROW(
      eval(torchvisionCenterCropWithEmptyArray), facebook::jsi::JSError);

  std::string torchvisionCenterCropWithTrinaryArray =
      R"(
        __torchlive_torchvision__.transforms.centerCrop([480, 640, 720]);
      )";
  EXPECT_THROW(
      eval(torchvisionCenterCropWithTrinaryArray), facebook::jsi::JSError);

  std::string torchvisionCenterCropMultipleArguments =
      R"(
        __torchlive_torchvision__.transforms.centerCrop(100, 100);
      )";
  EXPECT_THROW(
      eval(torchvisionCenterCropMultipleArguments), facebook::jsi::JSError);
}

} // namespace
