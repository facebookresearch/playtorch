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

TEST_F(TorchliveTorchvisionRuntimeTest, ResizeTest) {
  std::string torchvisionResizeWithInt =
      R"(
        const tensor = torch.rand([1, 3, 5, 5]);
        const resize = __torchlive_torchvision__.transforms.resize(2);
        const resized = resize.forward(tensor);
        resized.shape[0] == 1 && resized.shape[1] == 3 && resized.shape[2] == 2 && resized.shape[3] == 2;
      )";
  EXPECT_TRUE(eval(torchvisionResizeWithInt).getBool());
  std::string torchvisionResizeWithUnaryArray =
      R"(
        const tensor = torch.rand([1, 3, 5, 5]);
        const resize = __torchlive_torchvision__.transforms.resize([2]);
        const resized = resize.forward(tensor);
        resized.shape[0] == 1 && resized.shape[1] == 3 && resized.shape[2] == 2 && resized.shape[3] == 2;
      )";
  EXPECT_TRUE(eval(torchvisionResizeWithInt).getBool());
  std::string torchvisionResizeWithShape =
      R"(
        const tensor = torch.rand([1, 3, 5, 5]);
        const resize = __torchlive_torchvision__.transforms.resize([2, 3]);
        const resized = resize.forward(tensor);
        resized.shape[0] == 1 && resized.shape[1] == 3 && resized.shape[2] == 2 && resized.shape[3] == 3;
      )";
  EXPECT_TRUE(eval(torchvisionResizeWithInt).getBool());
  std::string torchvisionResizeWithZeroArgument =
      R"(__torchlive_torchvision__.transforms.resize();)";
  EXPECT_THROW(eval(torchvisionResizeWithZeroArgument), facebook::jsi::JSError);
  std::string torchvisionResizeWithEmptyList =
      R"(__torchlive_torchvision__.transforms.resize([]);)";
  EXPECT_THROW(eval(torchvisionResizeWithZeroArgument), facebook::jsi::JSError);
  std::string torchvisionResizeWithTrinaryArray =
      R"(__torchlive_torchvision__.transforms.resize([2,3,4]);)";
  EXPECT_THROW(eval(torchvisionResizeWithZeroArgument), facebook::jsi::JSError);
  std::string torchvisionResizeOnSmallTensor =
      R"(
        const tensor = torch.rand([1, 3, 5, 5]);
        const resize = __torchlive_torchvision__.transforms.resize(6);
        const resized = resize.forward(tensor);
      )";
  EXPECT_THROW(eval(torchvisionResizeWithZeroArgument), facebook::jsi::JSError);
  std::string torchvisionResizeOnOneDimensionTensor =
      R"(
        const tensor = torch.rand([5]);
        const resize = __torchlive_torchvision__.transforms.resize(2);
        const resized = resize.forward(tensor);
      )";
  EXPECT_THROW(eval(torchvisionResizeWithZeroArgument), facebook::jsi::JSError);
}

TEST_F(TorchliveTorchvisionRuntimeTest, NormalizeTest) {
  std::string torchvisionNormalize =
      R"(
        const tensor = torch.rand([1, 3, 5, 5]);
        const normalize = __torchlive_torchvision__.transforms.normalize([0.2, 0.2, 0.2], [0.5, 0.5, 0.5]);
        const normalized = normalize.forward(tensor);
        normalized.shape[0] == 1 && normalized.shape[1] == 3 && normalized.shape[2] == 5 && normalized.shape[3] == 5;
      )";
  EXPECT_TRUE(eval(torchvisionNormalize).getBool());
  std::string torchvisionNormalizeWithUnmatchedChannelsOfTensor =
      R"(
        const tensor = torch.rand([1, 4, 5, 5]);
        const normalize = __torchlive_torchvision__.transforms.normalize([0.2, 0.2, 0.2], [0.5, 0.5, 0.5]);
        const normalized = normalize.forward(tensor);
        normalized.shape[0] == 1 && normalized.shape[1] == 3 && normalized.shape[2] == 5 && normalized.shape[3] == 5;
      )";
  EXPECT_THROW(
      eval(torchvisionNormalizeWithUnmatchedChannelsOfTensor),
      facebook::jsi::JSError);

  std::string torchvisionNormalizeWithUnmatchedChannelsOfMeanAndStd =
      R"(
        const tensor = torch.rand([1, 3, 5, 5]);
        const normalize = __torchlive_torchvision__.transforms.normalize([0.2, 0.2, 0.2], [0.5, 0.5]);
        const normalized = normalize.forward(tensor);
      )";
  EXPECT_THROW(
      eval(torchvisionNormalizeWithUnmatchedChannelsOfMeanAndStd),
      facebook::jsi::JSError);
}

} // namespace
