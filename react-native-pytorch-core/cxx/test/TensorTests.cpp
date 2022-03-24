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

class TorchliveTensorRuntimeTest
    : public torchlive::test::TorchliveBindingsTestBase {};

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

  EXPECT_TRUE(eval("torch.tensor([[128], [255]])['foo']").isUndefined());

  EXPECT_TRUE(eval("torch.tensor([[128], [255]])[-1]").isUndefined());

  EXPECT_TRUE(eval("torch.tensor([[128], [255]])[2]").isUndefined());
}

TEST_F(TorchliveTensorRuntimeTest, TensorAbsTest) {
  std::string tensorAbs =
      R"(
          let tensor = torch.tensor([[-2, -1], [0, 1]]);
          let output = tensor.abs();
          output.data[0] == 2 && output.data[1] == 1 && output.data[2] == 0 && output.data[3] == 1
        )";
  EXPECT_TRUE(eval(tensorAbs.c_str()).getBool());
  EXPECT_THROW(
      eval("torch.tensor([[-2 ,-1], [0, 1]]).abs(1);"), facebook::jsi::JSError);
}

TEST_F(TorchliveTensorRuntimeTest, TensorAddTest) {
  std::string tensorAddCodeWithNumber =
      R"(
          const tensor = torch.arange(2);
          const result = tensor.add(2);
          result.data[0] == tensor.data[0] + 2;
        )";
  EXPECT_TRUE(eval(tensorAddCodeWithNumber.c_str()).getBool());

  std::string tensorAddCodeWithTensor =
      R"(
          const tensor1 = torch.arange(2);
          const tensor2 = torch.arange(2);
          const result = tensor1.add(tensor2);
          result.data[0] == tensor1.data[0] + tensor2.data[0];
        )";
  EXPECT_TRUE(eval(tensorAddCodeWithTensor.c_str()).getBool());

  std::string tensorAddCodeWithNumberAlpha =
      R"(
          const tensor1 = torch.arange(2);
          const result = tensor1.add(2, {alpha: 2});
          (result.data[0] == tensor1.data[0] + 2 * 2) && (result.data[1] == tensor1.data[1] + 2 * 2);
        )";
  EXPECT_TRUE(eval(tensorAddCodeWithNumberAlpha.c_str()).getBool());

  std::string tensorAddCodeWithTensorAlpha =
      R"(
          const tensor1 = torch.arange(2);
          const tensor2 = torch.arange(2);
          const result = tensor1.add(tensor2, {alpha: 2});
          (result.data[0] == tensor1.data[0] + 2 * tensor2.data[0]) && (result.data[1] == tensor1.data[1] + 2 * tensor2.data[1]);
        )";
  EXPECT_TRUE(eval(tensorAddCodeWithTensorAlpha.c_str()).getBool());

  EXPECT_THROW(eval("torch.arange(2).add()"), facebook::jsi::JSError);
  EXPECT_THROW(
      eval("torch.empty(1, 2).add('some_string')"), facebook::jsi::JSError);

  std::string tensorAddCodeWithInvalidAlpha =
      R"(
          const tensor1 = torch.arange(2);
          const tensor2 = torch.arange(2);
          const result = tensor1.add(tensor2, {alpha: 'random_string'});
        )";
  EXPECT_THROW(
      eval(tensorAddCodeWithInvalidAlpha.c_str()), facebook::jsi::JSError);
}

TEST_F(TorchliveTensorRuntimeTest, TensorDataTest) {
  std::string tensorWithDtypeAsUint8 =
      R"(
        const tensor = torch.tensor([0.1, 2.0, 2.7], {dtype: torch.uint8});
        tensor.dtype == torch.uint8 && tensor.data[0] == 0 && tensor.data[1] == 2 && tensor.data[2] == 2;
      )";
  EXPECT_TRUE(eval(tensorWithDtypeAsUint8).getBool());

  std::string tensorWithDtypeAsInt8 =
      R"(
        const tensor = torch.tensor([0.1, -2.0, 2.7, -2.7], {dtype: torch.int8});
        tensor.dtype == torch.int8 && tensor.data[0] == 0 && tensor.data[1] == -2 && tensor.data[2] == 2 && tensor.data[3] == -2;
      )";
  EXPECT_TRUE(eval(tensorWithDtypeAsInt8).getBool());

  std::string tensorWithDtypeAsInt16 =
      R"(
        const tensor = torch.tensor([0.1, 2.0], {dtype: torch.int16});
        const tensor2 = torch.tensor([0.1, 2.0], {dtype: torch.short});
        tensor.dtype == torch.int16 && tensor2.dtype == torch.int16;
      )";
  EXPECT_TRUE(eval(tensorWithDtypeAsInt16).getBool());

  std::string tensorWithDtypeAsInt32 =
      R"(
        const tensor = torch.tensor([0.1, 2.0], {dtype: torch.int32});
        const tensor2 = torch.tensor([0.1, 2.0], {dtype: torch.int});
        tensor.dtype == torch.int32 && tensor2.dtype == torch.int32;
      )";
  EXPECT_TRUE(eval(tensorWithDtypeAsInt32).getBool());

  std::string tensorWithDtypeAsFloat32 =
      R"(
        const tensor = torch.tensor([1.5, 2.0], {dtype: torch.float32});
        const tensor2 = torch.tensor([1.5, 2.0], {dtype: torch.float});
        tensor.dtype == torch.float32 && tensor2.dtype == torch.float32 && tensor.data[0] == 1.5 && tensor.data[1] == 2.0;
      )";
  EXPECT_TRUE(eval(tensorWithDtypeAsFloat32).getBool());

  std::string tensorWithDtypeAsFloat64 =
      R"(
        const tensor = torch.tensor([0.1, 2.0], {dtype: torch.float64});
        const tensor2 = torch.tensor([0.1, 2.0], {dtype: torch.double});
        tensor.dtype == torch.float64 && tensor2.dtype == torch.float64;
      )";
  EXPECT_TRUE(eval(tensorWithDtypeAsFloat64).getBool());

  std::string tensorWithDtypeAsInt64 =
      R"(
        const tensor = torch.tensor([128, 255], {dtype: torch.long});
        tensor.data;
      )";
  EXPECT_THROW(eval(tensorWithDtypeAsInt64), facebook::jsi::JSError);
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
    std::string tensorDivWithNumberFloor = fmt::format(
        R"(
          const tensor = torch.arange(1, 5);
          const result = tensor.div(2, {{rounding_mode: 'floor'}});
          result.data[{}] == Math.floor(tensor.data[{}] / 2);
        )",
        i,
        i);
    EXPECT_TRUE(eval(tensorDivWithNumberFloor.c_str()).getBool());
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

  for (auto i = 0; i < 4; i++) {
    std::string tensorDivWithTensorTrunc = fmt::format(
        R"(
          const tensor1 = torch.arange(1, 5);
          const tensor2 = torch.arange(3, 7);
          const result = tensor1.div(
            tensor2,
            {{rounding_mode: 'trunc'}});
          result.data[{}] == Math.trunc(tensor1.data[{}] / tensor2.data[{}]);
        )",
        i,
        i,
        i);
    EXPECT_TRUE(eval(tensorDivWithTensorTrunc.c_str()).getBool());
  }

  std::string tensorDivRoundingModeRandomVal = R"(
          const tensor1 = torch.arange(1, 5);
          const tensor2 = torch.arange(3, 7);
          const result = tensor1.div(
            tensor2,
            {{rounding_mode: 'random_val'}});
        )";
  EXPECT_THROW(
      eval(tensorDivRoundingModeRandomVal.c_str()), facebook::jsi::JSError);

  std::string tensorDivInvalidTypeRoundingMode = R"(
          const tensor1 = torch.arange(1, 5);
          const tensor2 = torch.arange(3, 7);
          const result = tensor1.div(
            tensor2,
            {{rounding_mode: 1}});
        )";
  EXPECT_THROW(
      eval(tensorDivInvalidTypeRoundingMode.c_str()), facebook::jsi::JSError);

  EXPECT_THROW(eval("torch.arange(1, 5).div()"), facebook::jsi::JSError);
  EXPECT_THROW(eval("torch.arange(3, 4).div('foo')"), facebook::jsi::JSError);
  EXPECT_THROW(
      eval("torch.arange(1, 5).div(torch.arrange(3, 4), 'foo')"),
      facebook::jsi::JSError);
}

TEST_F(TorchliveTensorRuntimeTest, TensorMulTest) {
  std::string tensorMulWithNumber =
      R"(
          const tensor = torch.arange(10);
          const result = tensor.mul(10);
          result.data[0] == tensor.data[0] * 10;
        )";
  EXPECT_TRUE(eval(tensorMulWithNumber.c_str()).getBool());

  std::string tensorMulWithTensor =
      R"(
          const tensor1 = torch.arange(2);
          const tensor2 = torch.arange(2);
          const result = tensor1.mul(tensor2);
          result.data[0] == tensor1.data[0] * tensor2.data[0];
        )";
  EXPECT_TRUE(eval(tensorMulWithTensor.c_str()).getBool());

  EXPECT_THROW(eval("torch.arange(2).mul()"), facebook::jsi::JSError);
  EXPECT_THROW(eval("torch.arrange(3, 4).mul('foo')"), facebook::jsi::JSError);
}

TEST_F(TorchliveTensorRuntimeTest, TensorPermuteTest) {
  std::string tensorPermute =
      R"(
          const tensor = torch.rand([2, 3, 1]);
          const result = tensor.permute([2, 0, 1]);
          const shape = result.shape;
          shape[0] === 1 && shape[1] === 2 && shape[2] === 3;
        )";
  EXPECT_TRUE(eval(tensorPermute.c_str()).getBool());

  // Incorrect number of dims
  EXPECT_THROW(
      eval("torch.rand([2, 3, 1]).permute([0, 1])"), facebook::jsi::JSError);
  // Incorrect call
  EXPECT_THROW(eval("torch.rand([2, 3, 1]).permute()"), facebook::jsi::JSError);
}

} // namespace
