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
      eval("torch.empty(1,2,true, {dtype:'float64'}).dtype"),
      facebook::jsi::JSError);
  EXPECT_THROW(
      eval("torch.empty(1,2,[1], {dtype:'float64'}).dtype"),
      facebook::jsi::JSError);
  EXPECT_THROW(
      eval("torch.empty({dtype:'float64'}, 1).dtype"), facebook::jsi::JSError);
  EXPECT_THROW(
      eval("torch.empty({dtype:'float64'}).dtype"), facebook::jsi::JSError);
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

TEST_F(TorchliveRuntimeTest, TensorSqueezeTest) {
  EXPECT_TRUE(eval("torch.rand([1,2,1,3,1]).shape.length === 5").getBool());
  EXPECT_TRUE(
      eval("torch.rand([1,2,1,3,1]).squeeze().shape.length === 2").getBool());
  EXPECT_TRUE(
      eval("torch.rand([1,2,1,3,1]).squeeze().shape[0] === 2").getBool());
  EXPECT_TRUE(
      eval("torch.rand([1,2,1,3,1]).squeeze(2).shape.length === 4").getBool());
  // if the spcified dim is not size 1, return a copy of the tensor
  EXPECT_TRUE(
      eval("torch.rand([1,2,1,3,1]).squeeze(1).shape.length === 5").getBool());
  EXPECT_TRUE(
      eval("torch.rand([1,2,1,3,1]).squeeze().shape[1] === 3").getBool());
  EXPECT_THROW(
      eval("torch.rand([1,2,1,3,1]).squeeze(1,2)"), facebook::jsi::JSError);
}

TEST_F(TorchliveRuntimeTest, TensorUnsqueezeTest) {
  EXPECT_TRUE(eval("torch.rand([1,2,3]).shape.length === 3").getBool());
  EXPECT_TRUE(
      eval("torch.rand([1,2,3]).unsqueeze(1).shape.length === 4").getBool());
  EXPECT_TRUE(
      eval("torch.rand([1,2,3]).unsqueeze(1).shape[0] === 1").getBool());
  EXPECT_TRUE(
      eval("torch.rand([1,2,3]).unsqueeze(1).shape[1] === 1").getBool());
  EXPECT_TRUE(
      eval("torch.rand([1,2,3]).unsqueeze(1).shape[2] === 2").getBool());
  EXPECT_TRUE(
      eval("torch.rand([1,2,3]).unsqueeze(1).shape[3] === 3").getBool());
  // wrong number of arguments
  EXPECT_THROW(
      eval("torch.rand([1,2,3]).unsqueeze(1,2)"), facebook::jsi::JSError);
  // argument out of range
  EXPECT_THROW(
      eval("torch.rand([1,2,3]).unsqueeze(4)"), facebook::jsi::JSError);
}

TEST_F(TorchliveRuntimeTest, TorchAddTest) {
  std::string torchAddCodeWithNumber =
      R"(
          const tensor = torch.arange(2);
          const result = torch.add(tensor, 2);
          result.data[0] == tensor.data[0] + 2;
        )";
  EXPECT_TRUE(eval(torchAddCodeWithNumber.c_str()).getBool());

  std::string torchAddCodeWithTensor =
      R"(
          const tensor1 = torch.arange(2);
          const tensor2 = torch.arange(2);
          const result = torch.add(tensor1, tensor2);
          result.data[0] == tensor1.data[0] + tensor2.data[0];
        )";
  EXPECT_TRUE(eval(torchAddCodeWithTensor.c_str()).getBool());

  EXPECT_THROW(eval("torch.add()"), facebook::jsi::JSError);
  EXPECT_THROW(eval("torch.add(1)"), facebook::jsi::JSError);
  EXPECT_THROW(
      eval("torch.add(torch.empty(1, 2), 'some_string')"),
      facebook::jsi::JSError);
}

TEST_F(TorchliveRuntimeTest, TorchSubTest) {
  std::string torchSubCodeWithNumber =
      R"(
          const tensor = torch.arange(2);
          const result = torch.sub(tensor, 2);
          result.data[0] == tensor.data[0] - 2;
        )";
  EXPECT_TRUE(eval(torchSubCodeWithNumber.c_str()).getBool());

  std::string torchSubCodeWithTensor =
      R"(
          const tensor1 = torch.arange(2);
          const tensor2 = torch.arange(2);
          const result = torch.sub(tensor1, tensor2);
          result.data[0] == tensor1.data[0] - tensor2.data[0];
        )";
  EXPECT_TRUE(eval(torchSubCodeWithTensor.c_str()).getBool());

  EXPECT_THROW(eval("torch.sub()"), facebook::jsi::JSError);
  EXPECT_THROW(eval("torch.sub(1)"), facebook::jsi::JSError);
  EXPECT_THROW(
      eval("torch.sub(torch.empty(1, 2), 'some_string')"),
      facebook::jsi::JSError);
}

TEST_F(TorchliveRuntimeTest, TorchMulTest) {
  std::string torchMulWithNumber =
      R"(
          const tensor = torch.arange(10);
          const result = torch.mul(tensor, 10);
          result.data[0] == tensor.data[0] * 10;
        )";
  EXPECT_TRUE(eval(torchMulWithNumber.c_str()).getBool());

  std::string torchMulWithTensor =
      R"(
          const tensor1 = torch.arange(2);
          const tensor2 = torch.arange(2);
          const result = torch.mul(tensor1, tensor2);
          result.data[0] == tensor1.data[0] * tensor2.data[0];
        )";
  EXPECT_TRUE(eval(torchMulWithTensor.c_str()).getBool());

  EXPECT_THROW(eval("torch.mul()"), facebook::jsi::JSError);
  EXPECT_THROW(eval("torch.mul(1)"), facebook::jsi::JSError);
  EXPECT_THROW(
      eval("torch.mul(torch.arrange(3, 4), 'foo')"), facebook::jsi::JSError);
}

TEST_F(TorchliveRuntimeTest, TorchSoftmaxTest) {
  std::string torchSoftmaxEachValueLessThanOne =
      R"(
          const tensor = torch.arange(2);
          const result = torch.softmax(tensor, 0);
          (result.data[0] <= 1 && result.data[0] >= 0) && (result.data[1] <= 1 && result.data[1] >= 0);
        )";
  EXPECT_TRUE(eval(torchSoftmaxEachValueLessThanOne.c_str()).getBool());

  std::string torchSoftmaxSumOfValuesEqualToOne =
      R"(
          const tensor = torch.arange(2);
          const result = torch.softmax(tensor, 0);
          Math.round(result.data[0] + result.data[1]);
        )";
  EXPECT_EQ(eval(torchSoftmaxSumOfValuesEqualToOne.c_str()).getNumber(), 1);

  EXPECT_THROW(eval("torch.softmax()"), facebook::jsi::JSError);
  EXPECT_THROW(eval("torch.softmax(1)"), facebook::jsi::JSError);
  EXPECT_THROW(
      eval("torch.softmax(torch.empty(1, 2), [1])"), facebook::jsi::JSError);
}

TEST_F(TorchliveRuntimeTest, TorchTenosrTest) {
  std::string torchCreateTensorFromArrayShape =
      R"(
          const tensor = torch.tensor([[[1, 2, 3], [3, 4, 5]], [[1, 2, 3], [3, 4, 5]]]);
          tensor.shape[0] == 2 && tensor.shape[1] == 2 && tensor.shape[2] == 3;
        )";
  EXPECT_TRUE(eval(torchCreateTensorFromArrayShape.c_str()).getBool());
  std::string torchCreateTensorFromArrayData =
      R"(
          const tensor = torch.tensor([[[1, 2, 3], [3, 4, 5]], [[1, 2, 3], [3, 4, 5]]]);
          tensor.data[0] == 1 && tensor.data[1] == 2 && tensor.data[2] == 3 && tensor.data[3] == 3;
        )";
  EXPECT_TRUE(eval(torchCreateTensorFromArrayData.c_str()).getBool());
  std::string torchCreateTensorFromArrayDtype =
      R"(
          const tensor = torch.tensor([[[1, 2, 3], [3, 4, 5]], [[1, 2, 3], [3, 4, 5]]]);
          const tensor2 = torch.tensor([[[1.1, 2, 3], [3, 4, 5]], [[1, 2, 3], [3, 4, 5]]], {dtype: torch.int});
          tensor.dtype == torch.float32 && tensor2.dtype == torch.int && tensor2.data[0] == 1;
        )";
  EXPECT_TRUE(eval(torchCreateTensorFromArrayDtype.c_str()).getBool());
  EXPECT_THROW(
      eval(
          "const tensor = torch.tensor([[[1, 2, '3'], [3, 4, 5]], [[1, 2, 3], [3, 4, 5]]])"),
      facebook::jsi::JSError);
  EXPECT_THROW(
      eval("const tensor = torch.tensor([1, 2, '3'])"), facebook::jsi::JSError);
  EXPECT_THROW(
      eval("const tensor = torch.tensor([[1, 2, 3], 4])"),
      facebook::jsi::JSError);
  EXPECT_THROW(
      eval("const tensor = torch.tensor([[1, 2, 3], [1, 2]])"),
      facebook::jsi::JSError);
}

TEST_F(TorchliveRuntimeTest, TorchDivTest) {
  for (auto i = 0; i < 4; i++) {
    std::string torchDivWithNumber = fmt::format(
        R"(
          const tensor = torch.arange(1, 5);
          const result = torch.div(tensor, 2);
          result.data[{}] == tensor.data[{}] / 2;
        )",
        i,
        i);
    EXPECT_TRUE(eval(torchDivWithNumber.c_str()).getBool());
  }

  for (auto i = 0; i < 4; i++) {
    std::string torchDivWithTensor = fmt::format(
        R"(
          const tensor1 = torch.arange(1, 5);
          const tensor2 = torch.arange(1, 5);
          const result = torch.div(tensor1, tensor2);
          result.data[{}] == tensor1.data[{}] / tensor2.data[{}];
        )",
        i,
        i,
        i);
    EXPECT_TRUE(eval(torchDivWithTensor.c_str()).getBool());
  }

  EXPECT_THROW(eval("torch.div()"), facebook::jsi::JSError);
  EXPECT_THROW(eval("torch.div(1)"), facebook::jsi::JSError);
  EXPECT_THROW(
      eval("torch.div(torch.arrange(3, 4), 'foo')"), facebook::jsi::JSError);
}

TEST_F(TorchliveRuntimeTest, TorchPermuteTest) {
  std::string torchPermute =
      R"(
          const tensor = torch.rand([2, 3, 1]);
          const result = torch.permute(tensor, [2, 0, 1]);
          const shape = result.shape;
          shape[0] === 1 && shape[1] === 2 && shape[2] === 3;
        )";
  EXPECT_TRUE(eval(torchPermute.c_str()).getBool());

  // Incorrect number of dims
  EXPECT_THROW(
      eval("torch.permute(torch.rand([2, 3, 1]), [0, 1])"),
      facebook::jsi::JSError);
  // Incorrect argument order
  EXPECT_THROW(
      eval("torch.permute([2, 0, 1], torch.rand([2, 3, 1]))"),
      facebook::jsi::JSError);
  // Incorrect call
  EXPECT_THROW(eval("torch.permute(1)"), facebook::jsi::JSError);
}

} // namespace
