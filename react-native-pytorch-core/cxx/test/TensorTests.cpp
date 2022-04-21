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

TEST_F(TorchliveTensorRuntimeTest, TensorAbsTest) {
  std::string tensorAbs =
      R"(
          let tensor = torch.tensor([[-2, -1], [0, 1]]);
          let output = tensor.abs();
          output.data[0] == 2 && output.data[1] == 1 && output.data[2] == 0 && output.data[3] == 1
        )";
  EXPECT_TRUE(eval(tensorAbs.c_str()).getBool());
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

TEST_F(TorchliveTensorRuntimeTest, TensorArgmaxTest) {
  std::string tensorArgmaxWithMultipleMaxValue =
      R"(
          const tensor = torch.tensor([[5, 1, 4, 1, 5]]);
          const result = tensor.argmax();
          result.item() === 0;
        )";
  EXPECT_TRUE(eval(tensorArgmaxWithMultipleMaxValue.c_str()).getBool());

  std::string tensorArgmaxReturnIndexOnFlattenArray =
      R"(
          const tensor = torch.tensor([[3, 1, 4, 1, 5], [9, 2, 6, 5, 2]]);
          const result = tensor.argmax();
          result.item() === 5;
        )";
  EXPECT_TRUE(eval(tensorArgmaxReturnIndexOnFlattenArray.c_str()).getBool());

  std::string tensorArgmaxWtihNonEmptyTensor =
      R"(
          const tensor = torch.tensor([]);
          tensor.argmax();
        )";
  EXPECT_THROW(
      eval(tensorArgmaxWtihNonEmptyTensor.c_str()), facebook::jsi::JSError);
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

TEST_F(TorchliveTensorRuntimeTest, TensorIndexing) {
  std::string tensorAccessWithIndex =
      R"(
        const tensor = torch.tensor([1, 2, 3]);
        tensor[0].data[0] === 1 && tensor[1].data[0] === 2 && tensor[2].data[0] === 3;
      )";
  EXPECT_TRUE(eval(tensorAccessWithIndex).getBool());

  std::string nestedTensorAcessWithIndex =
      R"(
        const tensor = torch.tensor([[128], [255]]);
        const tensor1 = tensor[0];
        const tensor2 = tensor[1];
        tensor1.data[0] == 128 && tensor2.data[0] == 255;
      )";
  EXPECT_TRUE(eval(nestedTensorAcessWithIndex).getBool());

  EXPECT_TRUE(eval("torch.tensor([[128], [255]])['foo']").isUndefined());

  EXPECT_TRUE(eval("torch.tensor([[128], [255]])[-1]").isUndefined());

  EXPECT_TRUE(eval("torch.tensor([[128], [255]])[2]").isUndefined());
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

TEST_F(TorchliveTensorRuntimeTest, TensorSoftmaxTest) {
  std::string tensorSoftmaxEachValueLessThanOne =
      R"(
          const tensor = torch.arange(2);
          const result = tensor.softmax(0);
          (result.data[0] <= 1 && result.data[0] >= 0) && (result.data[1] <= 1 && result.data[1] >= 0);
        )";
  EXPECT_TRUE(eval(tensorSoftmaxEachValueLessThanOne.c_str()).getBool());

  std::string tensorSoftmaxSumOfValuesEqualToOne =
      R"(
          const tensor = torch.arange(2);
          const result = tensor.softmax(0);
          Math.round(result.data[0] + result.data[1]);
        )";
  EXPECT_EQ(eval(tensorSoftmaxSumOfValuesEqualToOne.c_str()).getNumber(), 1);

  EXPECT_THROW(eval("torch.arange(2).softmax()"), facebook::jsi::JSError);
  EXPECT_THROW(eval("torch.empty(1, 2).softmax([1])"), facebook::jsi::JSError);
}

TEST_F(TorchliveTensorRuntimeTest, tensorSubTest) {
  std::string tensorSubCodeWithNumber =
      R"(
          const tensor = torch.arange(2);
          const result = tensor.sub(2);
          result.data[0] == tensor.data[0] - 2;
        )";
  EXPECT_TRUE(eval(tensorSubCodeWithNumber.c_str()).getBool());

  std::string tensorSubCodeWithTensor =
      R"(
          const tensor1 = torch.arange(2);
          const tensor2 = torch.arange(2);
          const result = tensor1.sub(tensor2);
          result.data[0] == tensor1.data[0] - tensor2.data[0];
        )";
  EXPECT_TRUE(eval(tensorSubCodeWithTensor.c_str()).getBool());

  std::string tensorSubCodeWithNumberAlpha =
      R"(
          const tensor1 = torch.arange(2);
          const result = tensor1.sub(2, {alpha: 2});
          (result.data[0] == tensor1.data[0] - 2 * 2) && (result.data[1] == tensor1.data[1] - 2 * 2);
        )";
  EXPECT_TRUE(eval(tensorSubCodeWithNumberAlpha.c_str()).getBool());

  std::string tensorSubCodeWithTensorAlpha =
      R"(
          const tensor1 = torch.arange(2);
          const tensor2 = torch.arange(2);
          const result = tensor1.sub(tensor2, {alpha: 2});
          (result.data[0] == tensor1.data[0] - 2 * tensor2.data[0]) && (result.data[1] == tensor1.data[1] - 2 * tensor2.data[1]);
        )";
  EXPECT_TRUE(eval(tensorSubCodeWithTensorAlpha.c_str()).getBool());

  EXPECT_THROW(eval("torch.arange(2).sub()"), facebook::jsi::JSError);
  EXPECT_THROW(
      eval("torch.empty(1, 2).sub('some_string')"), facebook::jsi::JSError);

  std::string tensorSubCodeWithInvalidAlpha =
      R"(
          const tensor1 = torch.arange(2);
          const tensor2 = torch.arange(2);
          const result = tensor1.sub(tensor2, {alpha: 'random_string'});
        )";
  EXPECT_THROW(
      eval(tensorSubCodeWithInvalidAlpha.c_str()), facebook::jsi::JSError);
}

TEST_F(TorchliveTensorRuntimeTest, TorchTopkTest) {
  std::string tensorTopkValid =
      R"(
          const tensor = torch.arange(10, 20);
          const [values, indices] = tensor.topk(3);
          (values.data[0] == 19 && values.data[1] == 18 && values.data[2] == 17) && (indices.data[0] == 9 && indices.data[1] == 8 && indices.data[2] == 7);
        )";
  EXPECT_TRUE(eval(tensorTopkValid.c_str()).getBool());

  EXPECT_THROW(eval("torch.arange(10, 20).topk()"), facebook::jsi::JSError);
  EXPECT_THROW(eval("torch.empty(1, 2).topk([1])"), facebook::jsi::JSError);
}

TEST_F(TorchliveTensorRuntimeTest, TorchToTest) {
  std::string tensorToAnotherDtypeCreateNewTensor =
      R"(
          const tensor = torch.tensor([1.5]);
          const outputTensor = tensor.to({dtype: torch.int});
          const outputTensor2 = outputTensor.to({dtype: torch.float});
          tensor.data[0] === 1.5 && outputTensor.data[0] === 1 && outputTensor2.data[0] === 1;
        )";
  EXPECT_TRUE(eval(tensorToAnotherDtypeCreateNewTensor.c_str()).getBool());
  EXPECT_THROW(eval("torch.tensor([1.5]).to()"), facebook::jsi::JSError);
  EXPECT_THROW(
      eval("torch.tensor([1.5]).to({dtype: 'xyz'})"), facebook::jsi::JSError);
}

TEST_F(TorchliveTensorRuntimeTest, TorchClampTest) {
  // InvalidInputs
  EXPECT_THROW(eval("torch.arange(1, 6).clamp()"), facebook::jsi::JSError);

  std::string tensorClampWithMixedScalarAndTensor =
      R"(
          let tensor = torch.tensor([1, 2, 3, 4, 5]);
          let otherTensor = torch.arange(5);
          tensor = tensor.clamp(3, otherTensor);
        )";
  EXPECT_THROW(
      eval(tensorClampWithMixedScalarAndTensor), facebook::jsi::JSError);

  std::string tensorClampWithTensorsOfDifferentSizes =
      R"(
          let tensor = torch.tensor([1, 2, 3, 4, 5]);
          let otherTensor = torch.arange(6);
          tensor = tensor.clamp(otherTensor);
        )";
  EXPECT_THROW(
      eval(tensorClampWithTensorsOfDifferentSizes), facebook::jsi::JSError);

  std::string tensorClampWithEmptyTensor =
      R"(
          let tensor = torch.tensor([1, 2, 3, 4, 5]);
          tensor = tensor.clamp({});
        )";
  EXPECT_THROW(eval(tensorClampWithEmptyTensor), facebook::jsi::JSError);

  std::string tensorClampWithUndefinedTensors =
      R"(
          let tensor = torch.tensor([1, 2, 3, 4, 5]);
          tensor = tensor.clamp({min: undefined, max: undefined});
        )";
  EXPECT_THROW(eval(tensorClampWithUndefinedTensors), facebook::jsi::JSError);

  // ScalarArgument
  std::string tensorClampWithMinAndMaxNumbers =
      R"(
          let tensor = torch.tensor([1, 2, 3, 4, 5]);
          tensor = tensor.clamp(3, 4);
          tensor.data[0] == 3 && tensor.data[1] == 3 && tensor.data[2] == 3 && tensor.data[3] == 4 && tensor.data[4] == 4;
        )";
  EXPECT_TRUE(eval(tensorClampWithMinAndMaxNumbers.c_str()).getBool());

  std::string tensorClampWithMinNumber =
      R"(
          let tensor = torch.tensor([1, 2, 3, 4, 5]);
          tensor = tensor.clamp(3);
          tensor.data[0] == 3 && tensor.data[1] == 3 && tensor.data[2] == 3 && tensor.data[3] == 4 && tensor.data[4] == 5;
        )";
  EXPECT_TRUE(eval(tensorClampWithMinNumber.c_str()).getBool());

  // TensorArgument
  std::string tensorClampWithMinAndMaxTensor =
      R"(
          let tensor = torch.tensor([1, 2, 3, 4, 5]);
          let minTensor = torch.tensor([3, 3, 3, 3, 3]);
          let maxTensor = torch.tensor([4, 4, 4, 4, 4]);
          tensor = tensor.clamp(minTensor, maxTensor);
          tensor.data[0] == 3 && tensor.data[1] == 3 && tensor.data[2] == 3 && tensor.data[3] == 4 && tensor.data[4] == 4;
        )";
  EXPECT_TRUE(eval(tensorClampWithMinAndMaxTensor.c_str()).getBool());

  std::string tensorClampWithMinTensor =
      R"(
          let tensor = torch.tensor([1, 2, 3, 4, 5]);
          let minTensor = torch.tensor([3, 3, 3, 3, 3]);
          tensor = tensor.clamp(minTensor);
          tensor.data[0] == 3 && tensor.data[1] == 3 && tensor.data[2] == 3 && tensor.data[3] == 4 && tensor.data[4] == 5;
        )";
  EXPECT_TRUE(eval(tensorClampWithMinTensor.c_str()).getBool());

  // ScalarWithKeywordArgument
  tensorClampWithMinAndMaxNumbers =
      R"(
          let tensor = torch.tensor([1, 2, 3, 4, 5]);
          tensor = tensor.clamp({min: 3, max: 4});
          tensor.data[0] == 3 && tensor.data[1] == 3 && tensor.data[2] == 3 && tensor.data[3] == 4 && tensor.data[4] == 4;
        )";
  EXPECT_TRUE(eval(tensorClampWithMinAndMaxNumbers.c_str()).getBool());

  tensorClampWithMinNumber =
      R"(
          let tensor = torch.tensor([1, 2, 3, 4, 5]);
          tensor = tensor.clamp({min: 3});
          tensor.data[0] == 3 && tensor.data[1] == 3 && tensor.data[2] == 3 && tensor.data[3] == 4 && tensor.data[4] == 5;
        )";
  EXPECT_TRUE(eval(tensorClampWithMinNumber.c_str()).getBool());

  std::string tensorClampWithMaxNumber =
      R"(
          let tensor = torch.tensor([1, 2, 3, 4, 5]);
          tensor = tensor.clamp({max: 4});
          tensor.data[0] == 1 && tensor.data[1] == 2 && tensor.data[2] == 3 && tensor.data[3] == 4 && tensor.data[4] == 4;
        )";
  EXPECT_TRUE(eval(tensorClampWithMaxNumber.c_str()).getBool());

  // TensorWithKeywordArgument
  std::string tensorClampWithMinAndMaxTensors =
      R"(
          let tensor = torch.tensor([1, 2, 3, 4, 5]);
          let minTensor = torch.tensor([3, 3, 3, 3, 3]);
          let maxTensor = torch.tensor([4, 4, 4, 4, 4]);
          tensor = tensor.clamp({min: minTensor, max: maxTensor});
          tensor.data[0] == 3 && tensor.data[1] == 3 && tensor.data[2] == 3 && tensor.data[3] == 4 && tensor.data[4] == 4;
        )";
  EXPECT_TRUE(eval(tensorClampWithMinAndMaxTensors.c_str()).getBool());

  tensorClampWithMinTensor =
      R"(
          let tensor = torch.tensor([1, 2, 3, 4, 5]);
          let minTensor = torch.tensor([3, 3, 3, 3, 3]);
          tensor = tensor.clamp({min: minTensor});
          tensor.data[0] == 3 && tensor.data[1] == 3 && tensor.data[2] == 3 && tensor.data[3] == 4 && tensor.data[4] == 5;
        )";
  EXPECT_TRUE(eval(tensorClampWithMinTensor.c_str()).getBool());

  std::string tensorClampWithMaxTensor =
      R"(
          let tensor = torch.tensor([1, 2, 3, 4, 5]);
          let maxTensor = torch.tensor([4, 4, 4, 4, 4]);
          tensor = tensor.clamp({max: maxTensor});
          tensor.data[0] == 1 && tensor.data[1] == 2 && tensor.data[2] == 3 && tensor.data[3] == 4 && tensor.data[4] == 4;
        )";
  EXPECT_TRUE(eval(tensorClampWithMaxTensor.c_str()).getBool());
}

TEST_F(TorchliveTensorRuntimeTest, TensorItemTest) {
  std::string tensorItemForZeroDimTensorInteger = R"(
    const tensor = torch.tensor(1);
    tensor.item() === 1;
  )";
  EXPECT_TRUE(eval(tensorItemForZeroDimTensorInteger.c_str()).getBool());
  std::string tensorItemForSingleElementTensorInteger = R"(
    const tensor = torch.tensor([[1]]);
    tensor.item() === 1;
  )";
  EXPECT_TRUE(eval(tensorItemForSingleElementTensorInteger.c_str()).getBool());

  std::string tensorItemForSingleElementTensorFloat = R"(
    const tensor = torch.tensor([[1.5]]);
    tensor.item() === 1.5;
  )";
  EXPECT_TRUE(eval(tensorItemForSingleElementTensorFloat.c_str()).getBool());

  std::string tensorItemForMultiElementTensor = R"(
    const tensor = torch.tensor([[1.5, 2.5]]);
    tensor.item();
  )";
  EXPECT_THROW(eval(tensorItemForMultiElementTensor), facebook::jsi::JSError);

  std::string tensorItemForMultiElementTensorInvalidType = R"(
    const tensor = torch.tensor([[true]]);
    tensor.item();
  )";
  EXPECT_THROW(eval(tensorItemForMultiElementTensor), facebook::jsi::JSError);
}

} // namespace
