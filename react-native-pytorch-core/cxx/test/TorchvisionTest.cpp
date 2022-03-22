/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include <fmt/format.h>
#include <gtest/gtest.h>
#include <string>

#include "TorchliveTestBase.h"

namespace {

class TorchliveTorchvisionRuntimeTest
    : public torchlive::test::TorchliveBindingsTestBase {
 public:
  TorchliveTorchvisionRuntimeTest()
      : torchlive::test::TorchliveBindingsTestBase() {
    importTorchliveModule("torchvision");
  }
};

TEST_F(TorchliveTorchvisionRuntimeTest, CenterCropTest) {
  std::string torchvisionCenterCropWithInt =
      R"(
        const tensor = torch.rand([20, 3, 1024, 1024]);
        const centerCrop = torchvision.transforms.centerCrop(480);
        const centerCropped = centerCrop.forward(tensor);
        centerCropped.shape[0] == 20 && centerCropped.shape[1] == 3 && centerCropped.shape[2] == 480 && centerCropped.shape[3] == 480;
      )";
  EXPECT_TRUE(eval(torchvisionCenterCropWithInt).getBool());

  std::string torchvisionCenterCropWithUnaryArray =
      R"(
        const tensor = torch.rand([20, 3, 1024, 1024]);
        const centerCrop = torchvision.transforms.centerCrop([480]);
        const centerCropped = centerCrop.forward(tensor);
        centerCropped.shape[0] == 20 && centerCropped.shape[1] == 3 && centerCropped.shape[2] == 480 && centerCropped.shape[3] == 480;
      )";
  EXPECT_TRUE(eval(torchvisionCenterCropWithUnaryArray).getBool());

  std::string torchvisionCenterCropWithBinaryArray =
      R"(
        const tensor = torch.rand([20, 3, 1024, 1024]);
        const centerCrop = torchvision.transforms.centerCrop([480, 640]);
        const centerCropped = centerCrop.forward(tensor);
        centerCropped.shape[0] == 20 && centerCropped.shape[1] == 3 && centerCropped.shape[2] == 480 && centerCropped.shape[3] == 640;
      )";
  EXPECT_TRUE(eval(torchvisionCenterCropWithBinaryArray).getBool());

  std::string torchvisionCenterCropWithEmptyArray =
      R"(
        torchvision.transforms.centerCrop([]);
      )";
  EXPECT_THROW(
      eval(torchvisionCenterCropWithEmptyArray), facebook::jsi::JSError);

  std::string torchvisionCenterCropWithTrinaryArray =
      R"(
        torchvision.transforms.centerCrop([480, 640, 720]);
      )";
  EXPECT_THROW(
      eval(torchvisionCenterCropWithTrinaryArray), facebook::jsi::JSError);

  std::string torchvisionCenterCropMultipleArguments =
      R"(
        torchvision.transforms.centerCrop(100, 100);
      )";
  EXPECT_THROW(
      eval(torchvisionCenterCropMultipleArguments), facebook::jsi::JSError);

  std::string torchvisionCenterCropWithWrongNumberOfInput =
      R"(
        const tensor = torch.rand([1, 3, 5, 5]);
        const centerCrop = torchvision.transforms.centerCrop(3);
        centerCrop.forward(tensor, 1);
      )";
  EXPECT_THROW(
      eval(torchvisionCenterCropWithWrongNumberOfInput),
      facebook::jsi::JSError);
}

TEST_F(TorchliveTorchvisionRuntimeTest, ResizeTest) {
  std::string torchvisionResizeForward =
      R"(
        const tensor = torch.rand([1, 3, 5, 5]);
        const resize = torchvision.transforms.resize(2);
        const resized = resize.forward(tensor);
        resized.shape[0] == 1 && resized.shape[1] == 3 && resized.shape[2] == 2 && resized.shape[3] == 2;
      )";
  EXPECT_TRUE(eval(torchvisionResizeForward).getBool());

  std::string torchvisionResizeWithInt =
      R"(
        const tensor = torch.rand([1, 3, 5, 5]);
        const resize = torchvision.transforms.resize(2);
        const resized = resize(tensor);
        resized.shape[0] == 1 && resized.shape[1] == 3 && resized.shape[2] == 2 && resized.shape[3] == 2;
      )";
  EXPECT_TRUE(eval(torchvisionResizeWithInt).getBool());

  std::string torchvisionResizeWithUnaryArray =
      R"(
        const tensor = torch.rand([1, 3, 5, 5]);
        const resize = torchvision.transforms.resize([2]);
        const resized = resize(tensor);
        resized.shape[0] == 1 && resized.shape[1] == 3 && resized.shape[2] == 2 && resized.shape[3] == 2;
      )";
  EXPECT_TRUE(eval(torchvisionResizeWithUnaryArray).getBool());

  std::string torchvisionResizeWithShape =
      R"(
        const tensor = torch.rand([1, 3, 5, 5]);
        const resize = torchvision.transforms.resize([2, 3]);
        const resized = resize(tensor);
        resized.shape[0] == 1 && resized.shape[1] == 3 && resized.shape[2] == 2 && resized.shape[3] == 3;
      )";
  EXPECT_TRUE(eval(torchvisionResizeWithShape).getBool());

  std::string torchvisionResizeOnSmallTensor =
      R"(
        const tensor = torch.rand([1, 3, 5, 5]);
        const resize = torchvision.transforms.resize(6);
        const resized = resize(tensor);
        resized.shape[0] == 1 && resized.shape[1] == 3 && resized.shape[2] == 6 && resized.shape[3] == 6;
      )";
  EXPECT_TRUE(eval(torchvisionResizeOnSmallTensor).getBool());

  std::string torchvisionResizeWithZeroArgument =
      R"(torchvision.transforms.resize();)";
  EXPECT_THROW(eval(torchvisionResizeWithZeroArgument), facebook::jsi::JSError);

  std::string torchvisionResizeWithEmptyList =
      R"(torchvision.transforms.resize([]);)";
  EXPECT_THROW(eval(torchvisionResizeWithEmptyList), facebook::jsi::JSError);

  std::string torchvisionResizeWithTrinaryArray =
      R"(torchvision.transforms.resize([2,3,4]);)";
  EXPECT_THROW(eval(torchvisionResizeWithTrinaryArray), facebook::jsi::JSError);

  std::string torchvisionResizeOnOneDimensionTensor =
      R"(
        const tensor = torch.rand([5]);
        const resize = torchvision.transforms.resize(2);
        const resized = resize(tensor);
      )";
  EXPECT_THROW(
      eval(torchvisionResizeOnOneDimensionTensor), facebook::jsi::JSError);

  std::string torchvisionResizeWithWrongNumberOfInput =
      R"(
        const tensor = torch.rand([1, 3, 5, 5]);
        const resize = torchvision.transforms.resize(3);
        resize.forward(tensor, 1);
      )";
  EXPECT_THROW(
      eval(torchvisionResizeWithWrongNumberOfInput), facebook::jsi::JSError);
}

TEST_F(TorchliveTorchvisionRuntimeTest, NormalizeTest) {
  std::string torchvisionNormalize =
      R"(
        const tensor = torch.rand([1, 3, 5, 5]);
        const normalize = torchvision.transforms.normalize([0.2, 0.2, 0.2], [0.5, 0.5, 0.5]);
        const normalized = normalize(tensor);
        const expectedShape = [1, 3, 5, 5];
        normalized.shape.length == expectedShape.length && normalized.shape.every((v, i) => v == expectedShape[i]);
      )";
  EXPECT_TRUE(eval(torchvisionNormalize).getBool());

  std::string torchvisionNormalizeForward =
      R"(
        const tensor = torch.rand([1, 3, 5, 5]);
        const normalize = torchvision.transforms.normalize([0.2, 0.2, 0.2], [0.5, 0.5, 0.5]);
        const normalized = normalize.forward(tensor);
        const expectedShape = [1, 3, 5, 5];
        normalized.shape.length == expectedShape.length && normalized.shape.every((v, i) => v == expectedShape[i]);
      )";
  EXPECT_TRUE(eval(torchvisionNormalizeForward).getBool());

  std::string torchvisionNormalizeWithUnmatchedChannelsOfTensor =
      R"(
        const tensor = torch.rand([1, 4, 5, 5]);
        const normalize = torchvision.transforms.normalize([0.2, 0.2, 0.2], [0.5, 0.5, 0.5]);
        normalize(tensor);
      )";
  EXPECT_THROW(
      eval(torchvisionNormalizeWithUnmatchedChannelsOfTensor),
      facebook::jsi::JSError);

  std::string torchvisionNormalizeWithUnmatchedChannelsOfMeanAndStd =
      R"(
        const tensor = torch.rand([1, 3, 5, 5]);
        const normalize = torchvision.transforms.normalize([0.2, 0.2, 0.2], [0.5, 0.5]);
        normalize(tensor);
      )";
  EXPECT_THROW(
      eval(torchvisionNormalizeWithUnmatchedChannelsOfMeanAndStd),
      facebook::jsi::JSError);

  std::string torchvisionNormalizeWithWrongNumberOfInput =
      R"(
        const tensor = torch.rand([1, 3, 5, 5]);
        const normalize = torchvision.transforms.normalize(3);
        normalize.forward(tensor, 1);
      )";
  EXPECT_THROW(
      eval(torchvisionNormalizeWithWrongNumberOfInput), facebook::jsi::JSError);
}

TEST_F(TorchliveTorchvisionRuntimeTest, GrayscaleTest) {
  std::string torchvisionGrayscaleWithDefaultParam =
      R"(
        const tensor = torch.rand([1, 3, 5, 5]);
        const grayscale = torchvision.transforms.grayscale();
        const grayscaled = grayscale(tensor);
        const expectedShape = [1, 1, 5, 5];
        grayscaled.shape.length == expectedShape.length && grayscaled.shape.every((v, i) => v == expectedShape[i]);
      )";
  EXPECT_TRUE(eval(torchvisionGrayscaleWithDefaultParam).getBool());

  std::string torchvisionGrayScaleForwardWithDefaultParam =
      R"(
        const tensor = torch.rand([1, 3, 5, 5]);
        const grayscale = torchvision.transforms.grayscale();
        const grayscaled = grayscale.forward(tensor);
        const expectedShape = [1, 1, 5, 5];
        grayscaled.shape.length == expectedShape.length && grayscaled.shape.every((v, i) => v == expectedShape[i]);
      )";
  EXPECT_TRUE(eval(torchvisionGrayScaleForwardWithDefaultParam).getBool());

  std::string torchvisionGrayscaleWithSpecifiedNumberOfChannels =
      R"(
        const tensor = torch.rand([1, 3, 5, 5]);
        const grayscale = torchvision.transforms.grayscale(3);
        const grayscaled = grayscale.forward(tensor);
        const expectedShape = [1, 3, 5, 5];
        grayscaled.shape.length == expectedShape.length && grayscaled.shape.every((v, i) => v == expectedShape[i]);
      )";
  EXPECT_TRUE(
      eval(torchvisionGrayscaleWithSpecifiedNumberOfChannels).getBool());

  std::string torchvisionGrayscaleWithWrongNumberOfParameters =
      R"(
        torchvision.transforms.grayscale(1, 3);
      )";
  EXPECT_THROW(
      eval(torchvisionGrayscaleWithWrongNumberOfParameters),
      facebook::jsi::JSError);

  std::string torchvisionGrayscaleWithWrongParameters =
      R"(
        torchvision.transforms.grayscale(2);
      )";
  EXPECT_THROW(
      eval(torchvisionGrayscaleWithWrongParameters), facebook::jsi::JSError);

  std::string torchvisionGrayscaleWithWrongNumberOfInput =
      R"(
        const tensor = torch.rand([1, 3, 5, 5]);
        const grayscale = torchvision.transforms.grayscale(3);
        grayscale.forward(tensor, 1);
      )";
  EXPECT_THROW(
      eval(torchvisionGrayscaleWithWrongNumberOfInput), facebook::jsi::JSError);
}

} // namespace
