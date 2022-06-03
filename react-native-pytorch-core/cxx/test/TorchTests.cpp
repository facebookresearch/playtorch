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

class TorchliveRuntimeTest : public torchlive::test::TorchliveBindingsTestBase {
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

TEST_F(TorchliveRuntimeTest, TorchEyeTest) {
  // test dimensions with one int argument
  const std::vector<int> ns = {0, 1, 3};
  for (const auto& n : ns) {
    EXPECT_EQ(eval(fmt::format("torch.eye({}).shape[0]", n)).getNumber(), n);
    EXPECT_EQ(eval(fmt::format("torch.eye({}).shape[1]", n)).getNumber(), n);
  }
  // test dimensions with two int arguments
  const std::vector<std::pair<int, int>> nms = {
      {0, 0}, {0, 1}, {1, 0}, {1, 1}, {1, 3}, {3, 1}, {3, 3}};
  for (const auto& i : nms) {
    EXPECT_EQ(
        eval(fmt::format("torch.eye({},{}).shape[0]", i.first, i.second))
            .getNumber(),
        i.first);
    EXPECT_EQ(
        eval(fmt::format("torch.eye({},{}).shape[1]", i.first, i.second))
            .getNumber(),
        i.second);
  }
  // test with data type
  const auto dtypes = {"float64", "float32", "int64", "int32"};
  for (const auto& dtype : dtypes) {
    EXPECT_EQ(
        eval(fmt::format("torch.eye(3, {{dtype:'{}'}}).dtype", dtype))
            .asString(*rt)
            .utf8(*rt),
        dtype);
  }
  // there must be at least one argument
  EXPECT_THROW(eval("torch.eye()"), facebook::jsi::JSError);
  // the first argument must be a number
  EXPECT_THROW(eval("torch.eye([1,2])"), facebook::jsi::JSError);
  // the first argument must be a positive integer
  EXPECT_THROW(eval("torch.eye(1.2, 2)"), facebook::jsi::JSError);
  EXPECT_THROW(eval("torch.eye(-1.2, 2)"), facebook::jsi::JSError);
  EXPECT_THROW(eval("torch.eye(-1, 2)"), facebook::jsi::JSError);

  // the second argument must be a positive integer
  EXPECT_THROW(eval("torch.eye(1, -2.5)"), facebook::jsi::JSError);
  EXPECT_THROW(eval("torch.eye(1, 2.5)"), facebook::jsi::JSError);
  EXPECT_THROW(eval("torch.eye(1, -2)"), facebook::jsi::JSError);

  EXPECT_THROW(eval("torch.eye({dtype:'int32'})"), facebook::jsi::JSError);
  EXPECT_THROW(eval("torch.eye({dtype:'int32'}, 3)"), facebook::jsi::JSError);
  // only the two initial arguments may be numbers
  EXPECT_THROW(eval("torch.eye(1,2,3)"), facebook::jsi::JSError);
}

TEST_F(TorchliveRuntimeTest, TensorDataTest) {
  EXPECT_TRUE(eval("torch.rand([5]).data() instanceof Float32Array").getBool());
  EXPECT_TRUE(
      eval(
          "torch.rand([5], {dtype: torch.double}).data() instanceof Float64Array")
          .getBool());
}

TEST_F(TorchliveRuntimeTest, TensorToStringTest) {
  EXPECT_TRUE(eval("typeof torch.rand([5]).toString() === 'string'").getBool());
}

TEST_F(TorchliveRuntimeTest, TorchArangeTest) {
  for (auto i = 0; i < 4; i++) {
    std::string withDtype =
        fmt::format("torch.arange(4, {{dtype:'float64'}})[{}].item()", i);
    std::string withoutDtype = fmt::format("torch.arange(4)[{}].item()", i);
    EXPECT_EQ(eval(withDtype).getNumber(), i);
    EXPECT_EQ(eval(withoutDtype).getNumber(), i);
  }
  EXPECT_EQ(eval("torch.arange(4, {dtype:'float64'}).shape[0]").getNumber(), 4);
  EXPECT_EQ(
      eval("torch.arange(4, {dtype:'float64'}).dtype").asString(*rt).utf8(*rt),
      "float64");

  for (auto i = 0; i < 3; i++) {
    std::string withDtype =
        fmt::format("torch.arange(2, 5, {{dtype:'float64'}})[{}].item()", i);
    std::string withoutDtype = fmt::format("torch.arange(2, 5)[{}].item()", i);
    int expectedVal = i + 2;
    EXPECT_EQ(eval(withDtype).getNumber(), expectedVal);
    EXPECT_EQ(eval(withoutDtype).getNumber(), expectedVal);
  }
  EXPECT_EQ(eval("torch.arange(2, 5).shape[0]").getNumber(), 3);
  EXPECT_EQ(
      eval("torch.arange(2, 5, {dtype:'float64'}).dtype")
          .asString(*rt)
          .utf8(*rt),
      "float64");

  for (auto i = 0; i < 5; i++) {
    std::string withDtype = fmt::format(
        "torch.arange(1, 3.5, 0.5, {{dtype:'float64'}})[{}].item()", i);
    std::string withoutDtype =
        fmt::format("torch.arange(1, 3.5, 0.5)[{}].item()", i);
    double expectedVal = 1 + (i * 0.5);
    EXPECT_EQ(eval(withDtype).getNumber(), expectedVal);
    EXPECT_EQ(eval(withoutDtype).getNumber(), expectedVal);
  }
  EXPECT_EQ(eval("torch.arange(1, 3.5, 0.5).shape[0]").getNumber(), 5);
  EXPECT_EQ(
      eval("torch.arange(1, 3.5, 0.5, {dtype:'float64'}).dtype")
          .asString(*rt)
          .utf8(*rt),
      "float64");
}

TEST_F(TorchliveRuntimeTest, TorchRandintTest) {
  EXPECT_EQ(eval("torch.randint(10, [2, 2]).shape[0]").getNumber(), 2);
  EXPECT_EQ(eval("torch.randint(10, [2, 2]).shape[1]").getNumber(), 2);

  // Test randint with parameters high and size.
  for (auto i = 0; i < 2; i++) {
    for (auto j = 0; j < 2; j++) {
      std::string s =
          fmt::format("torch.randint(10, [2, 2])[{}][{}].item()", i, j);
      std::string sWithDtype = fmt::format(
          "torch.randint(10, [2, 2], {{dtype:'float64'}})[{}][{}].item()",
          i,
          j);
      EXPECT_GE(eval(s).getNumber(), 0);
      EXPECT_LT(eval(s).getNumber(), 10);
      EXPECT_GE(eval(sWithDtype).getNumber(), 0);
      EXPECT_LT(eval(sWithDtype).getNumber(), 10);
    }
  }
  EXPECT_EQ(
      eval("torch.randint(10, [2, 2], {dtype:'float64'}).dtype")
          .asString(*rt)
          .utf8(*rt),
      "float64");

  // Test randint with parameters low, high, and size.
  EXPECT_EQ(eval("torch.randint(3, 5, [3]).shape[0]").getNumber(), 3);
  for (auto i = 0; i < 3; i++) {
    std::string s = fmt::format("torch.randint(3, 5, [3])[{}].item()", i);
    std::string sWithDtype = fmt::format(
        "torch.randint(3, 5, [3], {{dtype:'float64'}})[{}].item()", i);
    EXPECT_GE(eval(s).getNumber(), 3);
    EXPECT_LT(eval(s).getNumber(), 5);
    EXPECT_GE(eval(sWithDtype).getNumber(), 3);
    EXPECT_LT(eval(sWithDtype).getNumber(), 5);
  }
  EXPECT_EQ(
      eval("torch.randint(3, 5, [3], {dtype:'float64'}).dtype")
          .asString(*rt)
          .utf8(*rt),
      "float64");

  EXPECT_EQ(eval("torch.randint(3, 7, [3, 3, 4]).shape[2]").getNumber(), 4);
  for (auto i = 0; i < 3; i++) {
    for (auto j = 0; j < 3; j++) {
      for (auto k = 0; k < 4; k++) {
        std::string s = fmt::format(
            "torch.randint(3, 7, [3, 3, 4])[{}][{}][{}].item()", i, j, k);
        EXPECT_GE(eval(s).getNumber(), 3);
        EXPECT_LT(eval(s).getNumber(), 7);
      }
    }
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

TEST_F(TorchliveRuntimeTest, TorchTensorTest) {
  std::string torchCreateTensorFromArrayShape =
      R"(
          const tensor = torch.tensor([[[1, 2, 3], [3, 4, 5]], [[1, 2, 3], [3, 4, 5]]]);
          tensor.shape[0] == 2 && tensor.shape[1] == 2 && tensor.shape[2] == 3;
        )";
  EXPECT_TRUE(eval(torchCreateTensorFromArrayShape).getBool());
  std::string torchCreateTensorFromArrayData =
      R"(
          const tensor = torch.tensor([[[1, 2, 3], [3, 4, 5]], [[1, 2, 3], [3, 4, 5]]]);
          const data = tensor.data();
          data[0] == 1 && data[1] == 2 && data[2] == 3 && data[3] == 3;
        )";
  EXPECT_TRUE(eval(torchCreateTensorFromArrayData).getBool());
  std::string torchCreateTensorFromArrayDtype =
      R"(
          const tensor = torch.tensor([[[1, 2, 3], [3, 4, 5]], [[1, 2, 3], [3, 4, 5]]]);
          const tensor2 = torch.tensor([[[1.1, 2, 3], [3, 4, 5]], [[1, 2, 3], [3, 4, 5]]], {dtype: torch.int});
          const tensor3 = torch.tensor([[[1.1, 2, 3], [3, 4, 5]], [[1, 2, 3], [3, 4, 5]]], {dtype: torch.int64});
          tensor.dtype == torch.float32 && tensor2.dtype == torch.int && tensor2[0][0][0].item() == 1 && tensor3.dtype == torch.int64;
        )";
  EXPECT_TRUE(eval(torchCreateTensorFromArrayDtype).getBool());
  // there must be at least one argument
  EXPECT_THROW(eval("torch.tensor()"), facebook::jsi::JSError);
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

TEST_F(TorchliveRuntimeTest, TorchRandTest) {
  // there must be at least one argument
  EXPECT_THROW(eval("torch.rand()"), facebook::jsi::JSError);
}

TEST_F(TorchliveRuntimeTest, TorchZerosTest) {
  // Test zeros with single integer parameters.
  EXPECT_EQ(eval("torch.zeros(0).shape[0]").getNumber(), 0);

  EXPECT_EQ(eval("torch.zeros(4).shape[0]").getNumber(), 4);
  for (auto i = 0; i < 4; i++) {
    std::string val_s = fmt::format("torch.zeros(4)[{}].item()", i);
    EXPECT_EQ(eval(val_s).getNumber(), 0);
  }

  // Test zeros with two integer parameters.
  EXPECT_EQ(eval("torch.zeros(0, 0).shape[0]").getNumber(), 0);
  EXPECT_EQ(eval("torch.zeros(0, 0).shape[1]").getNumber(), 0);

  EXPECT_EQ(eval("torch.zeros(2, 3).shape[0]").getNumber(), 2);
  EXPECT_EQ(eval("torch.zeros(2, 3).shape[1]").getNumber(), 3);
  for (auto i = 0; i < 2; i++) {
    for (auto j = 0; j < 3; j++) {
      std::string val_s = fmt::format("torch.zeros(2, 3)[{}][{}].item()", i, j);
      EXPECT_EQ(eval(val_s).getNumber(), 0);
    }
  }

  // Test zeros with array parameters.
  EXPECT_EQ(eval("torch.zeros([0, 0]).shape[0]").getNumber(), 0);
  EXPECT_EQ(eval("torch.zeros([0, 0]).shape[1]").getNumber(), 0);

  EXPECT_EQ(eval("torch.zeros([3, 2]).shape[0]").getNumber(), 3);
  EXPECT_EQ(eval("torch.zeros([3, 2]).shape[1]").getNumber(), 2);
  for (auto i = 0; i < 3; i++) {
    for (auto j = 0; j < 2; j++) {
      std::string val_s =
          fmt::format("torch.zeros([3, 2])[{}][{}].item()", i, j);
      EXPECT_EQ(eval(val_s).getNumber(), 0);
    }
  }

  // Test zeros with no parameters (invalid).
  EXPECT_THROW(eval("torch.zeros()"), facebook::jsi::JSError);
}

TEST_F(TorchliveRuntimeTest, TorchOnesTest) {
  // Test ones with single integer parameters.
  EXPECT_EQ(eval("torch.ones(3).shape[0]").getNumber(), 3);
  for (auto i = 0; i < 3; i++) {
    std::string tensorDataAtToEval = fmt::format("torch.ones(3)[{}].item()", i);
    EXPECT_EQ(eval(tensorDataAtToEval).getNumber(), 1);
  }

  // Test ones with multiple integer parameters.
  EXPECT_EQ(eval("torch.ones(2, 3).shape[0]").getNumber(), 2);
  EXPECT_EQ(eval("torch.ones(2, 3).shape[1]").getNumber(), 3);
  for (auto i = 0; i < 2; i++) {
    for (auto j = 0; j < 3; j++) {
      std::string tensorDataAtToEval =
          fmt::format("torch.ones(2, 3)[{}][{}].item()", i, j);
      EXPECT_EQ(eval(tensorDataAtToEval).getNumber(), 1);
    }
  }

  // Test ones with array parameters.
  EXPECT_EQ(eval("torch.ones([2, 3]).shape[0]").getNumber(), 2);
  EXPECT_EQ(eval("torch.ones([2, 3]).shape[1]").getNumber(), 3);
  for (auto i = 0; i < 2; i++) {
    for (auto j = 0; j < 3; j++) {
      std::string tensorDataAtToEval =
          fmt::format("torch.ones([2, 3])[{}][{}].item()", i, j);
      EXPECT_EQ(eval(tensorDataAtToEval).getNumber(), 1);
    }
  }

  // Test data type parameter.
  auto const dtypes = {"float64", "float32", "int64", "int32"};
  for (auto const dtype : dtypes) {
    EXPECT_EQ(
        eval(fmt::format("torch.ones(2, 3, {{dtype:'{}'}}).dtype", dtype))
            .asString(*rt)
            .utf8(*rt),
        dtype);
  }

  // Test ones with no parameters.
  EXPECT_THROW(eval("torch.ones()"), facebook::jsi::JSError);
}

} // namespace
