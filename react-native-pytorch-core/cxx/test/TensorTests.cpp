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
          let output = tensor.abs().data();
          output[0] == 2 && output[1] == 1 && output[2] == 0 && output[3] == 1
        )";
  EXPECT_TRUE(eval(tensorAbs).getBool());
}

TEST_F(TorchliveTensorRuntimeTest, TensorAddTest) {
  std::string tensorAddCodeWithNumber =
      R"(
          const tensor = torch.arange(2);
          const result = tensor.add(2);
          result[0].item() == tensor[0].item() + 2;
        )";
  EXPECT_TRUE(eval(tensorAddCodeWithNumber).getBool());

  std::string tensorAddCodeWithTensor =
      R"(
          const tensor1 = torch.arange(2);
          const tensor2 = torch.arange(2);
          const result = tensor1.add(tensor2);
          result[0].item() == tensor1[0].item() + tensor2[0].item();
        )";
  EXPECT_TRUE(eval(tensorAddCodeWithTensor).getBool());

  std::string tensorAddCodeWithNumberAlpha =
      R"(
          const tensor1 = torch.arange(2);
          const result = tensor1.add(2, {alpha: 2});
          (result[0].item() == tensor1[0].item() + 2 * 2) && (result[1].item() == tensor1[1].item() + 2 * 2);
        )";
  EXPECT_TRUE(eval(tensorAddCodeWithNumberAlpha).getBool());

  std::string tensorAddCodeWithTensorAlpha =
      R"(
          const tensor1 = torch.arange(2);
          const tensor2 = torch.arange(2);
          const result = tensor1.add(tensor2, {alpha: 2});
          (result[0].item() == tensor1[0].item() + 2 * tensor2[0].item()) && (result[1].item() == tensor1[1].item() + 2 * tensor2[1].item());
        )";
  EXPECT_TRUE(eval(tensorAddCodeWithTensorAlpha).getBool());

  EXPECT_THROW(eval("torch.arange(2).add()"), facebook::jsi::JSError);
  EXPECT_THROW(
      eval("torch.empty(1, 2).add('some_string')"), facebook::jsi::JSError);

  std::string tensorAddCodeWithInvalidAlpha =
      R"(
          const tensor1 = torch.arange(2);
          const tensor2 = torch.arange(2);
          const result = tensor1.add(tensor2, {alpha: 'random_string'});
        )";
  EXPECT_THROW(eval(tensorAddCodeWithInvalidAlpha), facebook::jsi::JSError);
}

TEST_F(TorchliveTensorRuntimeTest, TensorArgmaxTest) {
  std::string tensorArgmaxWithMultipleMaxValue =
      R"(
          const tensor = torch.tensor([[5, 1, 4, 1, 5]]);
          const result = tensor.argmax();
          result.item() === 0;
        )";
  EXPECT_TRUE(eval(tensorArgmaxWithMultipleMaxValue).getBool());

  std::string tensorArgmaxReturnIndexOnFlattenArray =
      R"(
          const tensor = torch.tensor([[3, 1, 4, 1, 5], [9, 2, 6, 5, 2]]);
          const result = tensor.argmax();
          result.item() === 5;
        )";
  EXPECT_TRUE(eval(tensorArgmaxReturnIndexOnFlattenArray).getBool());

  std::string tensorArgmaxWithDimOption =
      R"(
      const tensor = torch.tensor([[[1,2,3], [4,5,6]], [[7, 8, 9], [10, 11, 12]]]);
      const result = tensor.argmax({dim: 0});
      const expectedShape = [2, 3];
      expectedData = [1, 1, 1, 1, 1, 1];
      result.shape.length == expectedShape.length && result.shape.every((v, i) => v == expectedShape[i]) && result.data().every((v, i) => v == expectedData[i]);
    )";
  EXPECT_TRUE(eval(tensorArgmaxWithDimOption).getBool());

  std::string tensorArgmaxWithDimOptionAndKeepdimOption =
      R"(
      const tensor = torch.tensor([[[1,2,3], [4,5,6]], [[7, 8, 9], [10, 11, 12]]]);
      const result = tensor.argmax({dim: 2, keepdim: true});
      const expectedShape = [2, 2, 1];
      expectedData = [2, 2, 2, 2];
      result.shape.length == expectedShape.length && result.shape.every((v, i) => v == expectedShape[i]) && result.data().every((v, i) => v == expectedData[i]);
    )";
  EXPECT_TRUE(eval(tensorArgmaxWithDimOptionAndKeepdimOption).getBool());

  std::string tensorArgmaxWtihNonEmptyTensor =
      R"(
          const tensor = torch.tensor([]);
          tensor.argmax();
        )";
  EXPECT_THROW(eval(tensorArgmaxWtihNonEmptyTensor), facebook::jsi::JSError);

  std::string tensorArgmaxWtihDimOptionNotExistd =
      R"(
          const tensor = torch.tensor([[[1, 2, 3], [4, 5, 6]], [[7, 8, 9], [10, 11, 12]]]);
          tensor.argmax({dim: 5});
        )";
  EXPECT_THROW(
      eval(tensorArgmaxWtihDimOptionNotExistd), facebook::jsi::JSError);

  std::string tensorArgmaxWtihInvalidKeepdimOption =
      R"(
          const tensor = torch.tensor([[[1, 2, 3], [4, 5, 6]], [[7, 8, 9], [10, 11, 12]]]);
          tensor.argmax({keepdim: 1});
        )";
  EXPECT_THROW(
      eval(tensorArgmaxWtihInvalidKeepdimOption), facebook::jsi::JSError);
}

TEST_F(TorchliveTensorRuntimeTest, TensorArgminTest) {
  // Valid inputs
  std::string tensorArgmin1D =
      R"(
          const tensor = torch.tensor([1,-2,3]);
          const result = tensor.argmin().item();
          result == 1;
        )";
  EXPECT_TRUE(eval(tensorArgmin1D).getBool());

  std::string tensorArgminWithMultipleMinValue =
      R"(
          const tensor = torch.tensor([[1,2,-3,4]]);
          const result = tensor.argmin().item();
          result == 2;
        )";
  EXPECT_TRUE(eval(tensorArgminWithMultipleMinValue).getBool());

  std::string tensorArgminReturnIndexOnFlattenArray =
      R"(
          const tensor = torch.tensor([[1,2,3],[4,5,-6]]);
          const result = tensor.argmin();
          result.item() === 5;
        )";
  EXPECT_TRUE(eval(tensorArgminReturnIndexOnFlattenArray).getBool());

  std::string tensorArgminWithSimpleDim0 =
      R"(
      const tensor = torch.tensor([[1, 2, 3],[4, -5, 6]]);
      const result = tensor.argmin({dim: 0});
      const expectedShape = [3];
      expectedData = [0, 1, 0];
      result.shape.length == expectedShape.length && result.shape.every((v, i) => v == expectedShape[i]) && result.data().every((v, i) => v == expectedData[i]);
    )";
  EXPECT_TRUE(eval(tensorArgminWithSimpleDim0).getBool());

  std::string tensorArgminWithSimpleDim1 =
      R"(
      const tensor = torch.tensor([[1, 2, 3],[4, -5, 6]]);
      const result = tensor.argmin({dim: 1});
      const expectedShape = [2];
      expectedData = [0, 1];
      result.shape.length == expectedShape.length && result.shape.every((v, i) => v == expectedShape[i]) && result.data().every((v, i) => v == expectedData[i]);
    )";
  EXPECT_TRUE(eval(tensorArgminWithSimpleDim1).getBool());

  std::string tensorArgminWithDimOption =
      R"(
      const tensor = torch.tensor([[[1,2,3], [4,5,6]], [[7, 8, 9], [10, 11, 12]]]);
      const result = tensor.argmin({dim: 0});
      const expectedShape = [2, 3];
      expectedData = [0, 0, 0, 0, 0, 0];
      result.shape.length == expectedShape.length && result.shape.every((v, i) => v == expectedShape[i]) && result.data().every((v, i) => v == expectedData[i]);
    )";
  EXPECT_TRUE(eval(tensorArgminWithDimOption).getBool());

  std::string tensorArgminWithDimOptionAndKeepdimOption =
      R"(
      const tensor = torch.tensor([[[1,2,3], [4,5,6]], [[7, 8, 9], [10, 11, 12]]]);
      const result = tensor.argmin({dim: 2, keepdim: true});
      const expectedShape = [2, 2, 1];
      expectedData = [0, 0, 0, 0];
      result.shape.length == expectedShape.length && result.shape.every((v, i) => v == expectedShape[i]) && result.data().every((v, i) => v == expectedData[i]);
    )";
  EXPECT_TRUE(eval(tensorArgminWithDimOptionAndKeepdimOption).getBool());

  // invalid input
  std::string tensorArgminWtihNonEmptyTensor =
      R"(
          const tensor = torch.tensor([]);
          tensor.argmin();
        )";
  EXPECT_THROW(eval(tensorArgminWtihNonEmptyTensor), facebook::jsi::JSError);

  std::string tensorArgminWtihDimOptionNotExistd =
      R"(
          const tensor = torch.tensor([[[1, 2, 3], [4, 5, 6]], [[7, 8, 9], [10, 11, 12]]]);
          tensor.argmin({dim: 5});
        )";
  EXPECT_THROW(
      eval(tensorArgminWtihDimOptionNotExistd), facebook::jsi::JSError);

  std::string tensorArgminWtihInvalidKeepdimOption =
      R"(
          const tensor = torch.tensor([[[1, 2, 3], [4, 5, 6]], [[7, 8, 9], [10, 11, 12]]]);
          tensor.argmin({keepdim: 1});
        )";
  EXPECT_THROW(
      eval(tensorArgminWtihInvalidKeepdimOption), facebook::jsi::JSError);
}

TEST_F(TorchliveTensorRuntimeTest, TensorContiguousTest) {
  std::string torchPreserveFormat =
      R"(
        torch.ones([2, 3, 4]).permute([2, 1, 0]).contiguous({memoryFormat: torch.preserveFormat});
      )";
  EXPECT_THROW(eval(torchPreserveFormat), facebook::jsi::JSError);

  std::string torchContiguousFormat =
      R"(
        const tensor = torch.ones([2, 3, 4]);
        const permuted = tensor.permute([2, 1, 0]);
        const contiguous = permuted.contiguous();
        const contiguous2 = permuted.contiguous({memoryFormat: torch.contiguousFormat});
        JSON.stringify(tensor.shape) == '[2,3,4]' && JSON.stringify(tensor.stride()) == '[12,4,1]'
          && JSON.stringify(permuted.shape) == '[4,3,2]' && JSON.stringify(permuted.stride()) == '[1,4,12]'
          && JSON.stringify(contiguous.shape) == '[4,3,2]' && JSON.stringify(contiguous.stride()) == '[6,2,1]';
      )";
  EXPECT_TRUE(eval(torchContiguousFormat).getBool());

  std::string torchChannelsLast =
      R"(
        const tensor = torch.ones([2, 3, 4, 5]);
        const permuted = tensor.permute([3, 2, 1, 0]);
        const contiguous = permuted.contiguous({memoryFormat: torch.channelsLast});
        JSON.stringify(tensor.shape) == '[2,3,4,5]' && JSON.stringify(tensor.stride()) == '[60,20,5,1]'
          && JSON.stringify(permuted.shape) == '[5,4,3,2]' && JSON.stringify(permuted.stride()) == '[1,5,20,60]'
          && JSON.stringify(contiguous.shape) == '[5,4,3,2]' && JSON.stringify(contiguous.stride()) == '[24,1,8,4]';
      )";
  EXPECT_TRUE(eval(torchChannelsLast).getBool());

  std::string torchChannelsLast3D =
      R"(
        torch.ones([2, 3, 4]).permute([2,1,0]).contiguous({memoryFormat: torch.channelsLast});
      )";
  /*
  >>> (torch.ones([2, 3, 4]).permute([2,1,0])
  ... .contiguous(memory_format=torch.channels_last))

  Traceback (most recent call last):
    File "<stdin>", line 1, in <module>
  RuntimeError: required rank 4 tensor to use channels_last format
  */
  EXPECT_THROW(
      {
        try {
          eval(torchChannelsLast3D);
        } catch (const facebook::jsi::JSError& e) {
          EXPECT_TRUE(
              std::string(e.what()).find(
                  "required rank 4 tensor to use channels_last format") !=
              std::string::npos)
              << e.what();
          throw;
        }
      },
      facebook::jsi::JSError);
}

TEST_F(TorchliveTensorRuntimeTest, TensorDataTest) {
  std::string tensorWithDtypeAsUint8 =
      R"(
        const tensor = torch.tensor([0.1, 2.0, 2.7], {dtype: torch.uint8});
        tensor.dtype == torch.uint8 && tensor[0].item() == 0 && tensor[1].item() == 2 && tensor[2].item() == 2;
      )";
  EXPECT_TRUE(eval(tensorWithDtypeAsUint8).getBool());

  std::string tensorWithDtypeAsInt8 =
      R"(
        const tensor = torch.tensor([0.1, -2.0, 2.7, -2.7], {dtype: torch.int8});
        tensor.dtype == torch.int8 && tensor[0].item() == 0 && tensor[1].item() == -2 && tensor[2].item() == 2 && tensor[3].item() == -2;
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
        tensor.dtype == torch.float32 && tensor2.dtype == torch.float32 && tensor[0].item() == 1.5 && tensor[1].item() == 2.0;
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
        tensor.data();
      )";
  EXPECT_THROW(
      {
        try {
          eval(tensorWithDtypeAsInt64);
        } catch (const facebook::jsi::JSError& e) {
          EXPECT_TRUE(
              std::string(e.what()).find(
                  "property 'data' for a tensor of dtype torch.int64 is not supported.") !=
              std::string::npos)
              << e.what();
          throw;
        }
      },
      facebook::jsi::JSError);
}

TEST_F(TorchliveTensorRuntimeTest, TensorIndexing) {
  std::string tensorAccessWithIndex =
      R"(
        const tensor = torch.tensor([1, 2, 3]);
        tensor[0].item() === 1 && tensor[1].item() === 2 && tensor[2].item() === 3;
      )";
  EXPECT_TRUE(eval(tensorAccessWithIndex).getBool());

  std::string nestedTensorAccessWithIndex =
      R"(
        const tensor = torch.tensor([[128], [255]]);
        const tensor0 = tensor[0];
        const tensor1 = tensor[1];
        tensor0[0].item() == 128 && tensor1[0].item() == 255;
      )";
  EXPECT_TRUE(eval(nestedTensorAccessWithIndex).getBool());

  EXPECT_TRUE(eval("torch.tensor([[128], [255]])['foo']").isUndefined());

  EXPECT_TRUE(eval("torch.tensor([[128], [255]])[-1]").isUndefined());

  EXPECT_TRUE(eval("torch.tensor([[128], [255]])[2]").isUndefined());
}

TEST_F(TorchliveTensorRuntimeTest, TensorIndexingPut) {
  std::string tensorPutWithIndex =
      R"(
        const tensor = torch.zeros([3]);
        tensor[0] = torch.tensor([1]);
        tensor[1] = torch.tensor([2]);
        tensor[2] = torch.tensor([3]);
        tensor[0].item() === 1 && tensor[1].item() === 2 && tensor[2].item() === 3;
      )";
  EXPECT_TRUE(eval(tensorPutWithIndex).getBool());

  std::string tensorPutWithIndexAndNumberValue =
      R"(
        const tensor = torch.zeros([3]);
        tensor[0] = 1;
        tensor[1] = 2;
        tensor[2] = 3;
        tensor[0].item() === 1 && tensor[1].item() === 2 && tensor[2].item() === 3;
      )";
  EXPECT_TRUE(eval(tensorPutWithIndexAndNumberValue).getBool());

  std::string nestedTensorPutWithIndex =
      R"(
        const tensor = torch.tensor([[128], [0]]);
        tensor[1] = torch.tensor([[255]]);
        const tensor0 = tensor[0];
        const tensor1 = tensor[1];
        tensor0[0].item() == 128 && tensor1[0].item() == 255;
      )";
  EXPECT_TRUE(eval(nestedTensorPutWithIndex).getBool());

  EXPECT_THROW(
      eval("torch.tensor([[128], [255]])['foo'] = 'bar'"),
      facebook::jsi::JSError);

  EXPECT_THROW(
      eval("torch.tensor([[128], [255]])[-1] = 'bar'"), facebook::jsi::JSError);

  EXPECT_THROW(
      eval("torch.tensor([[128], [255]])[2] = 'bar'"), facebook::jsi::JSError);
}

TEST_F(TorchliveTensorRuntimeTest, TensorDivTest) {
  std::string tensorDivWithNumber =
      R"(
        const tensor = torch.tensor([0, 255]);
        const result = tensor.div(255);
        result[0].item() == 0 && result[1].item() == 1
      )";
  EXPECT_TRUE(eval(tensorDivWithNumber).getBool());

  for (auto i = 0; i < 4; i++) {
    std::string tensorDivWithNumber = fmt::format(
        R"(
          const tensor = torch.arange(1, 5);
          const result = tensor.div(2);
          result[{}].item() == tensor[{}].item() / 2;
        )",
        i,
        i);
    EXPECT_TRUE(eval(tensorDivWithNumber).getBool());
  }

  for (auto i = 0; i < 4; i++) {
    std::string tensorDivWithNumberFloor = fmt::format(
        R"(
          const tensor = torch.arange(1, 5);
          const result = tensor.div(2, {{roundingMode: 'floor'}});
          result[{}].item() == Math.floor(tensor[{}].item() / 2);
        )",
        i,
        i);
    EXPECT_TRUE(eval(tensorDivWithNumberFloor).getBool());
  }

  for (auto i = 0; i < 4; i++) {
    std::string tensorDivWithTensor = fmt::format(
        R"(
          const tensor1 = torch.arange(1, 5);
          const tensor2 = torch.arange(1, 5);
          const result = tensor1.div(tensor2);
          result[{}].item() == tensor1[{}].item() / tensor2[{}].item();
        )",
        i,
        i,
        i);
    EXPECT_TRUE(eval(tensorDivWithTensor).getBool());
  }

  for (auto i = 0; i < 4; i++) {
    std::string tensorDivWithTensorTrunc = fmt::format(
        R"(
          const tensor1 = torch.arange(1, 5);
          const tensor2 = torch.arange(3, 7);
          const result = tensor1.div(
            tensor2,
            {{roundingMode: 'trunc'}});
          result[{}].item() == Math.trunc(tensor1[{}].item() / tensor2[{}].item());
        )",
        i,
        i,
        i);
    EXPECT_TRUE(eval(tensorDivWithTensorTrunc).getBool());
  }

  std::string tensorDivRoundingModeRandomVal = R"(
          const tensor1 = torch.arange(1, 5);
          const tensor2 = torch.arange(3, 7);
          const result = tensor1.div(
            tensor2,
            {{roundingMode: 'random_val'}});
        )";
  EXPECT_THROW(eval(tensorDivRoundingModeRandomVal), facebook::jsi::JSError);

  std::string tensorDivInvalidTypeRoundingMode = R"(
          const tensor1 = torch.arange(1, 5);
          const tensor2 = torch.arange(3, 7);
          const result = tensor1.div(
            tensor2,
            {{roundingMode: 1}});
        )";
  EXPECT_THROW(eval(tensorDivInvalidTypeRoundingMode), facebook::jsi::JSError);

  EXPECT_THROW(eval("torch.arange(1, 5).div()"), facebook::jsi::JSError);
  EXPECT_THROW(eval("torch.arange(3, 4).div('foo')"), facebook::jsi::JSError);
  EXPECT_THROW(
      eval("torch.arange(1, 5).div(torch.arrange(3, 4), 'foo')"),
      facebook::jsi::JSError);
}

TEST_F(TorchliveTensorRuntimeTest, TensorFlipTest) {
  std::string tensorFlip =
      R"(
          const tensor = torch.arange(8).reshape([2, 2, 2]);
          const result = tensor.flip([0, 1]);
          const shape = result.shape;
          JSON.stringify(result.shape) == '[2,2,2]' && JSON.stringify([...result.data()]) == '[6,7,4,5,2,3,0,1]';
        )";
  EXPECT_TRUE(eval(tensorFlip).getBool());

  // Flip dimensions out of bounds -> dimension 3 does not exist
  EXPECT_THROW(
      eval("torch.arange(8).reshape([2, 2, 2]).flip([0, 3])"),
      facebook::jsi::JSError);

  // Flip requires 1 argument but no argument provided
  EXPECT_THROW(
      eval("torch.arange(8).reshape([2, 2, 2]).flip()"),
      facebook::jsi::JSError);

  // Incorrect argument type
  EXPECT_THROW(
      eval("torch.arange(8).reshape([2, 2, 2]).flip('foo')"),
      facebook::jsi::JSError);
}

TEST_F(TorchliveTensorRuntimeTest, TensorMulTest) {
  std::string tensorMulWithNumber =
      R"(
          const tensor = torch.arange(10);
          const result = tensor.mul(10);
          result[0].item() == tensor[0].item() * 10;
        )";
  EXPECT_TRUE(eval(tensorMulWithNumber).getBool());

  std::string tensorMulWithTensor =
      R"(
          const tensor1 = torch.arange(2);
          const tensor2 = torch.arange(2);
          const result = tensor1.mul(tensor2);
          result[0].item() == tensor1[0].item() * tensor2[0].item();
        )";
  EXPECT_TRUE(eval(tensorMulWithTensor).getBool());

  EXPECT_THROW(eval("torch.arange(2).mul()"), facebook::jsi::JSError);
  EXPECT_THROW(eval("torch.arrange(3, 4).mul('foo')"), facebook::jsi::JSError);
}

TEST_F(TorchliveTensorRuntimeTest, TensorMatmulTest) {
  std::string matMul2Dx1D =
      R"(
          const x = torch.randn([3, 4]);
          const y = torch.randn([4]);
          const z = x.matmul(y);
          z.size()[0] === 3;
        )";
  EXPECT_TRUE(eval(matMul2Dx1D).getBool());

  std::string matMul2Dx2D =
      R"(
          const x = torch.randn([3, 4]);
          const y = torch.randn([4, 2]);
          const z = x.matmul(y);
          z.size()[0] === 3 && z.size()[1] === 2;
        )";
  EXPECT_TRUE(eval(matMul2Dx2D).getBool());

  std::string matMul3Dx1D =
      R"(
          const x = torch.randn([10, 3, 4]);
          const y = torch.randn([4]);
          const z = x.matmul(y);
          z.size()[0] === 10 && z.size()[1] === 3;
        )";
  EXPECT_TRUE(eval(matMul3Dx1D).getBool());

  std::string matMul3Dx2D =
      R"(
          const x = torch.randn([10, 3, 4]);
          const y = torch.randn([4, 5]);
          const z = x.matmul(y);
          z.size()[0] === 10 && z.size()[1] === 3 && z.size()[2] === 5;
        )";
  EXPECT_TRUE(eval(matMul3Dx2D).getBool());

  std::string matMulShapeMismatch =
      R"(
          const x = torch.randn([10, 3]);
          const y = torch.randn([10, 3]);
          const z = x.matmul(y);
        )";
  EXPECT_THROW(eval(matMulShapeMismatch), facebook::jsi::JSError);

  std::string matMulWithNumber =
      R"(
          const x = torch.randn([10, 3]);
          const z = x.matmul(3);
        )";
  EXPECT_THROW(eval(matMulWithNumber), facebook::jsi::JSError);

  std::string matMulWithString =
      R"(
          const x = torch.randn([10, 3]);
          const z = x.matmul('foo');
        )";
  EXPECT_THROW(eval(matMulWithString), facebook::jsi::JSError);
}

TEST_F(TorchliveTensorRuntimeTest, TensorPermuteTest) {
  std::string tensorPermute =
      R"(
          const tensor = torch.rand([2, 3, 1]);
          const result = tensor.permute([2, 0, 1]);
          const shape = result.shape;
          shape[0] === 1 && shape[1] === 2 && shape[2] === 3;
        )";
  EXPECT_TRUE(eval(tensorPermute).getBool());

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
          (result[0].item() <= 1 && result[0].item() >= 0) && (result[1].item() <= 1 && result[1].item() >= 0);
        )";
  EXPECT_TRUE(eval(tensorSoftmaxEachValueLessThanOne).getBool());

  std::string tensorSoftmaxSumOfValuesEqualToOne =
      R"(
          const tensor = torch.arange(2);
          const result = tensor.softmax(0);
          Math.round(result[0].item() + result[1].item());
        )";
  EXPECT_EQ(eval(tensorSoftmaxSumOfValuesEqualToOne).getNumber(), 1);

  EXPECT_THROW(eval("torch.arange(2).softmax()"), facebook::jsi::JSError);
  EXPECT_THROW(eval("torch.empty(1, 2).softmax([1])"), facebook::jsi::JSError);
}

TEST_F(TorchliveTensorRuntimeTest, TensorStrideTest) {
  std::string tensorStrides =
      R"(
          const tensor = torch.rand([2, 3]);
          const result = tensor.permute([1, 0]);
          JSON.stringify(tensor.stride()) == '[3,1]' && JSON.stringify(result.stride()) == '[1,3]';
        )";
  EXPECT_TRUE(eval(tensorStrides).getBool());

  std::string tensorStrideWithDim =
      R"(
          const tensor = torch.rand([2, 3]);
          const result = tensor.permute([1, 0]);
          tensor.stride(0) == 3 && tensor.stride(1) == 1 && result.stride(0) == 1 && result.stride(1) == 3;
        )";
  EXPECT_TRUE(eval(tensorStrideWithDim).getBool());

  std::string tensorStrideWithNegativeDim =
      R"(
          const tensor = torch.rand([2, 3]);
          tensor.stride(-2) == 3 && tensor.stride(-1) == 1;
        )";
  EXPECT_TRUE(eval(tensorStrideWithNegativeDim).getBool());

  // dimension must be an integer
  EXPECT_THROW(eval("torch.tensor().stride(0.2)"), facebook::jsi::JSError);
}

TEST_F(TorchliveTensorRuntimeTest, tensorSubTest) {
  std::string tensorSubCodeWithNumber =
      R"(
          const tensor = torch.arange(2);
          const result = tensor.sub(2);
          result[0].item() == tensor[0].item() - 2;
        )";
  EXPECT_TRUE(eval(tensorSubCodeWithNumber).getBool());

  std::string tensorSubCodeWithTensor =
      R"(
          const tensor1 = torch.arange(2);
          const tensor2 = torch.arange(2);
          const result = tensor1.sub(tensor2);
          result[0].item() == tensor1[0].item() - tensor2[0].item();
        )";
  EXPECT_TRUE(eval(tensorSubCodeWithTensor).getBool());

  std::string tensorSubCodeWithNumberAlpha =
      R"(
          const tensor1 = torch.arange(2);
          const result = tensor1.sub(2, {alpha: 2});
          (result[0].item() == tensor1[0].item() - 2 * 2) && (result[1].item() == tensor1[1].item() - 2 * 2);
        )";
  EXPECT_TRUE(eval(tensorSubCodeWithNumberAlpha).getBool());

  std::string tensorSubCodeWithTensorAlpha =
      R"(
          const tensor1 = torch.arange(2);
          const tensor2 = torch.arange(2);
          const result = tensor1.sub(tensor2, {alpha: 2});
          (result[0].item() == tensor1[0].item() - 2 * tensor2[0].item()) && (result[1].item() == tensor1[1].item() - 2 * tensor2[1].item());
        )";
  EXPECT_TRUE(eval(tensorSubCodeWithTensorAlpha).getBool());

  EXPECT_THROW(eval("torch.arange(2).sub()"), facebook::jsi::JSError);
  EXPECT_THROW(
      eval("torch.empty(1, 2).sub('some_string')"), facebook::jsi::JSError);

  std::string tensorSubCodeWithInvalidAlpha =
      R"(
          const tensor1 = torch.arange(2);
          const tensor2 = torch.arange(2);
          const result = tensor1.sub(tensor2, {alpha: 'random_string'});
        )";
  EXPECT_THROW(eval(tensorSubCodeWithInvalidAlpha), facebook::jsi::JSError);
}

TEST_F(TorchliveTensorRuntimeTest, TensorSumTest) {
  std::string tensor1DSum =
      R"(
          const tensor = torch.ones(3);
          const result = tensor.sum();
          JSON.stringify(result.shape) == '[]' && result.item() == 3;
        )";
  EXPECT_TRUE(eval(tensor1DSum).getBool());

  std::string tensor1DSumIn1Dim =
      R"(
          const tensor = torch.ones(3);
          const result = tensor.sum(0);
          JSON.stringify(result.shape) == '[]' && result.item() == 3;
        )";
  EXPECT_TRUE(eval(tensor1DSumIn1Dim).getBool());

  std::string tensor1DSumIn1DimAndKeepDim =
      R"(
          const tensor = torch.ones(3);
          const result = tensor.sum(0, {keepdim: true});
          JSON.stringify(result.shape) == '[1]' && result.item() == 3;
        )";
  EXPECT_TRUE(eval(tensor1DSumIn1DimAndKeepDim).getBool());

  std::string tensor2DSum =
      R"(
          const tensor = torch.ones([2, 3]);
          const result = tensor.sum();
          JSON.stringify(result.shape) == '[]' && result.item() == 6;
        )";
  EXPECT_TRUE(eval(tensor2DSum).getBool());

  std::string tensor2DSumIn1Dim =
      R"(
          const tensor = torch.ones([2, 3]);
          const result = tensor.sum(0);
          JSON.stringify(result.shape) == '[3]' && JSON.stringify([...result.data()]) == '[2,2,2]';
        )";
  EXPECT_TRUE(eval(tensor2DSumIn1Dim).getBool());

  std::string tensor2DSumIn1DimAndKeepDim =
      R"(
          const tensor = torch.ones([2, 3]);
          const result = tensor.sum(0, {keepdim: true});
          JSON.stringify(result.shape) == '[1,3]' && JSON.stringify([...result.data()]) == '[2,2,2]';
        )";
  EXPECT_TRUE(eval(tensor2DSumIn1DimAndKeepDim).getBool());

  std::string tensor2DSumIn2Dims =
      R"(
          const tensor = torch.ones([2, 3]);
          const result = tensor.sum([0, 1]);
          JSON.stringify(result.shape) == '[]' && result.item() == 6;
        )";
  EXPECT_TRUE(eval(tensor2DSumIn2Dims).getBool());

  std::string tensor2DSumIn2DimsAndKeepDims =
      R"(
          const tensor = torch.ones([2, 3]);
          const result = tensor.sum([0, 1], {keepdim: true});
          JSON.stringify(result.shape) == '[1,1]' && result[0].item() == 6;
        )";
  EXPECT_TRUE(eval(tensor2DSumIn2DimsAndKeepDims).getBool());
}

TEST_F(TorchliveTensorRuntimeTest, TorchTopkTest) {
  std::string tensorTopkValid =
      R"(
          const tensor = torch.arange(10, 20);
          const [values, indices] = tensor.topk(3);
          (values[0].item() == 19 && values[1].item() == 18 && values[2].item() == 17) && (indices[0].item() == 9 && indices[1].item() == 8 && indices[2].item() == 7);
        )";
  EXPECT_TRUE(eval(tensorTopkValid).getBool());

  EXPECT_THROW(eval("torch.arange(10, 20).topk()"), facebook::jsi::JSError);
  EXPECT_THROW(eval("torch.empty(1, 2).topk([1])"), facebook::jsi::JSError);

  std::string tensorTopkColValid =
      R"(
      const tensor = torch.arange(1, 13).reshape(3, 4);
      const [values, indices] = tensor.topk(2, {dim: 1});
      expectedIndices = torch.tensor([[3, 2], [3, 2], [3, 2]]);
      expectedValues = torch.tensor([[4, 3], [8, 7], [12, 11]]);
      (JSON.stringify(values.data()) === JSON.stringify(expectedValues.data()) && JSON.stringify(indices.data()) === JSON.stringify(expectedIndices.data()));
    )";
  EXPECT_TRUE(eval(tensorTopkColValid).getBool());

  std::string tensorTopkRowValid =
      R"(
      const tensor = torch.arange(1, 13).reshape(4, 3);
      const [values, indices] = tensor.topk(2, {dim: 0});
      expectedIndices = torch.tensor([[3, 3, 3], [2, 2, 2]]);
      expectedValues = torch.tensor([[10, 11, 12], [7, 8, 9]]);
      (JSON.stringify(values.data()) === JSON.stringify(expectedValues.data()) && JSON.stringify(indices.data()) === JSON.stringify(expectedIndices.data()));
    )";
  EXPECT_TRUE(eval(tensorTopkRowValid).getBool());

  std::string tensorMinkValid =
      R"(
          const tensor = torch.arange(10, 20);
          const [values, indices] = tensor.topk(3, {largest: false});
          (values[0].item() == 10 && values[1].item() == 11 && values[2].item() == 12) && (indices[0].item() == 0 && indices[1].item() == 1 && indices[2].item() == 2);
        )";
  EXPECT_TRUE(eval(tensorMinkValid).getBool());

  std::string tensorTopkUnsorted =
      R"(
          const tensor = torch.tensor([7, 1, 5, 6, 2, 10]);
          const [values, indices] = tensor.topk(3, {sorted: true});
          (values[0].item() == 10 && values[1].item() == 7 && values[2].item() == 6) && (indices[0].item() == 5 && indices[1].item() == 0 && indices[2].item() == 3);
        )";
  EXPECT_TRUE(eval(tensorTopkUnsorted).getBool());

  std::string tensorTopkAllValid =
      R"(
      const tensor = torch.tensor([[4, 8], [6, 2], [9, 1], [3, 5]]);
      const [values, indices] = tensor.topk(2, {dim: 0, sorted: true, largest: false});
      expectedIndices = torch.tensor([[3, 2], [0, 1]]);
      expectedValues = torch.tensor([[3, 1], [4, 2]]);
      (JSON.stringify(values.data()) === JSON.stringify(expectedValues.data()) && JSON.stringify(indices.data()) === JSON.stringify(expectedIndices.data()));
    )";
  EXPECT_TRUE(eval(tensorTopkAllValid).getBool());

  EXPECT_THROW(
      eval("torch.arange(10, 20).topk(3, {dim: 1})"), facebook::jsi::JSError);

  EXPECT_THROW(
      eval("torch.arange(10, 20).topk(3, {dim: [0]})"), facebook::jsi::JSError);

  EXPECT_THROW(
      eval("torch.arange(10, 20).topk(3, {largest: 1})"),
      facebook::jsi::JSError);

  EXPECT_THROW(
      eval("torch.arange(10, 20).topk(3, {sorted: 1})"),
      facebook::jsi::JSError);
}

TEST_F(TorchliveTensorRuntimeTest, TorchToTest) {
  std::string tensorToAnotherDtypeCreateNewTensor =
      R"(
          const tensor = torch.tensor([1.5]);
          const outputTensor = tensor.to({dtype: torch.int});
          const outputTensor2 = outputTensor.to({dtype: torch.float});
          tensor[0].item() === 1.5 && outputTensor[0].item() === 1 && outputTensor2[0].item() === 1;
        )";
  EXPECT_TRUE(eval(tensorToAnotherDtypeCreateNewTensor).getBool());
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
          tensor[0].item() == 3 && tensor[1].item() == 3 && tensor[2].item() == 3 && tensor[3].item() == 4 && tensor[4].item() == 4;
        )";
  EXPECT_TRUE(eval(tensorClampWithMinAndMaxNumbers).getBool());

  std::string tensorClampWithMinNumber =
      R"(
          let tensor = torch.tensor([1, 2, 3, 4, 5]);
          tensor = tensor.clamp(3);
          tensor[0].item() == 3 && tensor[1].item() == 3 && tensor[2].item() == 3 && tensor[3].item() == 4 && tensor[4].item() == 5;
        )";
  EXPECT_TRUE(eval(tensorClampWithMinNumber).getBool());

  // TensorArgument
  std::string tensorClampWithMinAndMaxTensor =
      R"(
          let tensor = torch.tensor([1, 2, 3, 4, 5]);
          let minTensor = torch.tensor([3, 3, 3, 3, 3]);
          let maxTensor = torch.tensor([4, 4, 4, 4, 4]);
          tensor = tensor.clamp(minTensor, maxTensor);
          tensor[0].item() == 3 && tensor[1].item() == 3 && tensor[2].item() == 3 && tensor[3].item() == 4 && tensor[4].item() == 4;
        )";
  EXPECT_TRUE(eval(tensorClampWithMinAndMaxTensor).getBool());

  std::string tensorClampWithMinTensor =
      R"(
          let tensor = torch.tensor([1, 2, 3, 4, 5]);
          let minTensor = torch.tensor([3, 3, 3, 3, 3]);
          tensor = tensor.clamp(minTensor);
          tensor[0].item() == 3 && tensor[1].item() == 3 && tensor[2].item() == 3 && tensor[3].item() == 4 && tensor[4].item() == 5;
        )";
  EXPECT_TRUE(eval(tensorClampWithMinTensor).getBool());

  // ScalarWithKeywordArgument
  tensorClampWithMinAndMaxNumbers =
      R"(
          let tensor = torch.tensor([1, 2, 3, 4, 5]);
          tensor = tensor.clamp({min: 3, max: 4});
          tensor[0].item() == 3 && tensor[1].item() == 3 && tensor[2].item() == 3 && tensor[3].item() == 4 && tensor[4].item() == 4;
        )";
  EXPECT_TRUE(eval(tensorClampWithMinAndMaxNumbers).getBool());

  tensorClampWithMinNumber =
      R"(
          let tensor = torch.tensor([1, 2, 3, 4, 5]);
          tensor = tensor.clamp({min: 3});
          tensor[0].item() == 3 && tensor[1].item() == 3 && tensor[2].item() == 3 && tensor[3].item() == 4 && tensor[4].item() == 5;
        )";
  EXPECT_TRUE(eval(tensorClampWithMinNumber).getBool());

  std::string tensorClampWithMaxNumber =
      R"(
          let tensor = torch.tensor([1, 2, 3, 4, 5]);
          tensor = tensor.clamp({max: 4});
          tensor[0].item() == 1 && tensor[1].item() == 2 && tensor[2].item() == 3 && tensor[3].item() == 4 && tensor[4].item() == 4;
        )";
  EXPECT_TRUE(eval(tensorClampWithMaxNumber).getBool());

  // TensorWithKeywordArgument
  std::string tensorClampWithMinAndMaxTensors =
      R"(
          let tensor = torch.tensor([1, 2, 3, 4, 5]);
          let minTensor = torch.tensor([3, 3, 3, 3, 3]);
          let maxTensor = torch.tensor([4, 4, 4, 4, 4]);
          tensor = tensor.clamp({min: minTensor, max: maxTensor});
          tensor[0].item() == 3 && tensor[1].item() == 3 && tensor[2].item() == 3 && tensor[3].item() == 4 && tensor[4].item() == 4;
        )";
  EXPECT_TRUE(eval(tensorClampWithMinAndMaxTensors).getBool());

  tensorClampWithMinTensor =
      R"(
          let tensor = torch.tensor([1, 2, 3, 4, 5]);
          let minTensor = torch.tensor([3, 3, 3, 3, 3]);
          tensor = tensor.clamp({min: minTensor});
          tensor[0].item() == 3 && tensor[1].item() == 3 && tensor[2].item() == 3 && tensor[3].item() == 4 && tensor[4].item() == 5;
        )";
  EXPECT_TRUE(eval(tensorClampWithMinTensor).getBool());

  std::string tensorClampWithMaxTensor =
      R"(
          let tensor = torch.tensor([1, 2, 3, 4, 5]);
          let maxTensor = torch.tensor([4, 4, 4, 4, 4]);
          tensor = tensor.clamp({max: maxTensor});
          tensor[0].item() == 1 && tensor[1].item() == 2 && tensor[2].item() == 3 && tensor[3].item() == 4 && tensor[4].item() == 4;
        )";
  EXPECT_TRUE(eval(tensorClampWithMaxTensor).getBool());
}

TEST_F(TorchliveTensorRuntimeTest, TensorItemTest) {
  std::string tensorItemForZeroDimTensorInteger = R"(
    const tensor = torch.tensor(1);
    tensor.item() === 1;
  )";
  EXPECT_TRUE(eval(tensorItemForZeroDimTensorInteger).getBool());
  std::string tensorItemForSingleElementTensorInteger = R"(
    const tensor = torch.tensor([[1]]);
    tensor.item() === 1;
  )";
  EXPECT_TRUE(eval(tensorItemForSingleElementTensorInteger).getBool());

  std::string tensorItemForSingleElementTensorFloat = R"(
    const tensor = torch.tensor([[1.5]]);
    tensor.item() === 1.5;
  )";
  EXPECT_TRUE(eval(tensorItemForSingleElementTensorFloat).getBool());

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

  std::string tensorItemInt64 = R"(
    const tensor = torch.tensor(1, {dtype: torch.int64});
    tensor.item();
  )";
  EXPECT_THROW(
      {
        try {
          eval(tensorItemInt64);
        } catch (const facebook::jsi::JSError& e) {
          EXPECT_TRUE(
              std::string(e.what()).find(
                  "property 'item' for a tensor of dtype torch.int64 is not supported.") !=
              std::string::npos)
              << e.what();
          throw;
        }
      },
      facebook::jsi::JSError);
}

TEST_F(TorchliveTensorRuntimeTest, TensorSqrtTest) {
  std::string tensorSqrtForNegative =
      R"(
        const tensor = torch.tensor([-1]);
        const output = tensor.sqrt();
        isNaN(output[0].item());
      )";
  EXPECT_TRUE(eval(tensorSqrtForNegative).getBool());

  std::string tensorSqrtForMultiElement =
      R"(
        const tensor = torch.tensor([[-2.0755,  1.0226],  [0.0831,  0.4806]]);
        const output = tensor.sqrt();
        const epsilon = 0.0001;
        isNaN(output[0][0].item()) && Math.abs(output[0][1].item() - 1.0112) < epsilon && Math.abs(output[1][0].item() - 0.2883) < epsilon && Math.abs(output[1][1].item() - 0.6933) < epsilon;
      )";
  EXPECT_TRUE(eval(tensorSqrtForMultiElement).getBool());
}

TEST_F(TorchliveTensorRuntimeTest, TensorReshapeTest) {
  std::string tensorReshapeForNegative =
      R"(
        const tensor = torch.tensor([[0, 1], [2, 3]], {dtype: torch.uint8});
        const output = tensor.reshape([-1]);
        [0, 1, 2, 3].every((v, i) => v === output[i].item());
      )";
  EXPECT_TRUE(eval(tensorReshapeForNegative).getBool());

  std::string tensorReshapeFor2x2 =
      R"(
        const tensor = torch.tensor([0, 1, 2, 3], {dtype: torch.uint8});
        const output = tensor.reshape([2, 2]);
        [0, 1].every((v, i) => v === output[0][i].item()) &&
        [2, 3].every((v, i) => v === output[1][i].item());
      )";
  EXPECT_TRUE(eval(tensorReshapeFor2x2).getBool());

  // Error: Exception in HostFunction: shape '[2, 3]' is invalid for input of
  // size 4
  std::string tensorReshapeFor2x3 =
      R"(
        const tensor = torch.tensor([0, 1, 2, 3], {dtype: torch.uint8});
        const output = tensor.reshape([2, 3]);
      )";
  EXPECT_THROW(eval(tensorReshapeFor2x3), facebook::jsi::JSError);
}

} // namespace
