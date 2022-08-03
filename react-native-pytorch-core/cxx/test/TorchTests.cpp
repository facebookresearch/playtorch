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
 public:
  TorchliveRuntimeTest() : torchlive::test::TorchliveBindingsTestBase() {
    importTorchliveModule("media");
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

TEST_F(TorchliveRuntimeTest, TorchLinspaceTest) {
  // Valid inputs
  std::string torchLinspaceWithDefaultOption =
      R"(
      const tensor = torch.linspace(-10, 10, 5);
      expectedData = [-10.0, -5.0, 0, 5.0, 10.0];
      tensor.shape.length == 1 && tensor.shape[0] == 5 && tensor.data().every((v, i) => v == expectedData[i]) && tensor.dtype == torch.float32;
    )";
  EXPECT_TRUE(eval(torchLinspaceWithDefaultOption).getBool());

  EXPECT_TRUE(
      eval("torch.linspace(3, 10, 5, {dtype: torch.int}).dtype == torch.int")
          .getBool());

  // Invald Inputs
  EXPECT_THROW(eval("torch.linspace()"), facebook::jsi::JSError);
  EXPECT_THROW(eval("torch.linspace(1)"), facebook::jsi::JSError);
  EXPECT_THROW(eval("torch.linspace(1,2)"), facebook::jsi::JSError);

  EXPECT_THROW(eval("torch.linspace(1,2,-3)"), facebook::jsi::JSError);
  EXPECT_THROW(eval("torch.linspace(1,2,2.5)"), facebook::jsi::JSError);
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
  // when there are too many arguments, they should be ignored
  EXPECT_TRUE(eval("torch.rand([1,2,1,3,1]).squeeze(1,2).shape.length === 5")
                  .getBool());
  EXPECT_TRUE(
      eval("torch.rand([1,2,1,3,1]).squeeze().shape[1] === 3").getBool());
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
  // when there are too many arguments, they should be ignored
  EXPECT_TRUE(
      eval("torch.rand([1,2,3]).unsqueeze(1,2).shape[3] === 3").getBool());
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

TEST_F(TorchliveRuntimeTest, TorchCatTest) {
  // default dim would be 0 if not specified
  EXPECT_EQ(
      eval(
          "torch.cat([torch.rand([2,3,4]), torch.rand([2,3,4]), torch.rand([2,3,4])]).shape[0]")
          .getNumber(),
      6);

  // concat with specified dim
  EXPECT_EQ(
      eval(
          "torch.cat([torch.rand([2,3,4]), torch.rand([2,3,4]), torch.rand([2,3,4])], {dim: 1}).shape[0]")
          .getNumber(),
      2);
  EXPECT_EQ(
      eval(
          "torch.cat([torch.rand([2,3,4]), torch.rand([2,3,4]), torch.rand([2,3,4])], {dim: 1}).shape[1]")
          .getNumber(),
      9);

  // float tensor concat int tensor would end up to be float tensor
  EXPECT_TRUE(
      eval(
          "torch.cat([torch.rand([2,3,4]), torch.randint(0, 255, [2,3,4]), torch.rand([2,3,4])], {dim: 2}).dtype === torch.float32")
          .getBool());

  // Unmatched shape can't concat
  EXPECT_THROW(
      eval("torch.cat([torch.rand([2,3,4]), torch.rand([2,3,5])]).shape[0]")
          .getNumber(),
      facebook::jsi::JSError);
  EXPECT_THROW(
      eval("torch.cat([torch.rand([2,3,4]), torch.rand([2,3])]).shape[0]")
          .getNumber(),
      facebook::jsi::JSError);
}

TEST_F(TorchliveRuntimeTest, TorchExpandTest) {
  // test torch.expand on implicit higher dimensions
  EXPECT_EQ(
      eval("torch.tensor([[1], [2], [3]]).expand([4, 3, 5]).shape[0]")
          .getNumber(),
      4);
  EXPECT_EQ(
      eval("torch.tensor([[1], [2], [3]]).expand([4, 3, 5]).shape[1]")
          .getNumber(),
      3);
  EXPECT_EQ(
      eval("torch.tensor([[1], [2], [3]]).expand([4, 3, 5]).shape[2]")
          .getNumber(),
      5);
  for (auto i = 0; i < 4; i++) {
    for (auto j = 0; j < 3; j++) {
      for (auto k = 0; k < 5; k++) {
        std::string tensorDataAtToEval = fmt::format(
            "torch.tensor([[1], [2], [3]]).expand([4, 3, 5])[{}][{}][{}].item()",
            i,
            j,
            k);
        EXPECT_EQ(eval(tensorDataAtToEval).getNumber(), j + 1);
      }
    }
  }

  // test torch.expand with same number of dimensions
  EXPECT_EQ(
      eval("torch.tensor([[1], [2], [3]]).expand([3, 5]).shape[0]").getNumber(),
      3);
  EXPECT_EQ(
      eval("torch.tensor([[1], [2], [3]]).expand([3, 5]).shape[1]").getNumber(),
      5);
  for (auto i = 0; i < 3; i++) {
    for (auto j = 0; j < 5; j++) {
      std::string tensorDataAtToEval = fmt::format(
          "torch.tensor([[1], [2], [3]]).expand([3, 5])[{}][{}].item()", i, j);
      EXPECT_EQ(eval(tensorDataAtToEval).getNumber(), i + 1);
    }
  }

  // test torch.expand with -1 for unchanged size on the highest dimension
  EXPECT_EQ(
      eval("torch.tensor([[1], [2], [3]]).expand([-1, 4]).shape[0]")
          .getNumber(),
      3);
  EXPECT_EQ(
      eval("torch.tensor([[1], [2], [3]]).expand([-1, 4]).shape[1]")
          .getNumber(),
      4);
  for (auto i = 0; i < 3; i++) {
    for (auto j = 0; j < 4; j++) {
      std::string tensorDataAtToEval = fmt::format(
          "torch.tensor([[1], [2], [3]]).expand([-1, 4])[{}][{}].item()", i, j);
      EXPECT_EQ(eval(tensorDataAtToEval).getNumber(), i + 1);
    }
  }

  // test torch.expand with -1 for unchanged size on the lowest dimension
  EXPECT_EQ(
      eval("torch.tensor([[1], [2], [3]]).expand([3, -1]).shape[0]")
          .getNumber(),
      3);
  EXPECT_EQ(
      eval("torch.tensor([[1], [2], [3]]).expand([3, -1]).shape[1]")
          .getNumber(),
      1);

  // test torch.expand with changed size on dimension not equal to 1
  EXPECT_THROW(
      eval("torch.tensor([[1], [2], [3]]).expand([5, 1])"),
      facebook::jsi::JSError);

  // test torch.expand with unspecified dimension size.
  EXPECT_THROW(
      eval("torch.tensor([[1], [2], [3]]).expand([5])"),
      facebook::jsi::JSError);

  // test torch.expand with empty dimention sizes or no parameter.
  EXPECT_THROW(
      eval("torch.tensor([[1], [2], [3]]).expand()"), facebook::jsi::JSError);
  EXPECT_THROW(
      eval("torch.tensor([[1], [2], [3]]).expand([])"), facebook::jsi::JSError);
}

TEST_F(TorchliveRuntimeTest, TorchFromBlobTest) {
  std::string blob =
      R"(
          const tensor1 = torch.tensor([3, 2, 4], {dtype: torch.uint8});
          const blob = media.toBlob(tensor1);
      )";

  // Test missing parameter
  std::string missingJsSize = "const tensor2 = torch.fromBlob(blob);";
  EXPECT_THROW(eval(blob + missingJsSize), facebook::jsi::JSError);

  // The second parameter should be an array of numbers
  std::string notArray = "const tensor2 = torch.fromBlob(blob, 3);";
  EXPECT_THROW(eval(blob + notArray), facebook::jsi::JSError);
  std::string notNumber =
      "const tensor2 = torch.fromBlob(blob, ['not-valid']);";
  EXPECT_THROW(eval(blob + notNumber), facebook::jsi::JSError);

  // Test converting blob back to tensor
  std::string blobToTensor =
      R"(
          const tensor2 = torch.fromBlob(blob, [3]);
          const data1 = tensor1.data();
          const data2 = tensor2.data();
          data1.every((value, i) => value === data2[i]);
      )";
  EXPECT_TRUE(eval(blob + blobToTensor).getBool());
}

TEST_F(TorchliveRuntimeTest, TorchFullTest) {
  // Test full with a single dimension
  EXPECT_EQ(eval("torch.full([4], 3.14).shape[0]").getNumber(), 4);
  for (auto i = 0; i < 4; i++) {
    std::string val_s = fmt::format("torch.full([4], 3.14)[{}].item()", i);
    EXPECT_EQ(eval(val_s).getNumber(), 3.14f);
  }

  // Test full with multiple dimensions
  EXPECT_EQ(eval("torch.full([2, 3], 3.14).shape[0]").getNumber(), 2);
  EXPECT_EQ(eval("torch.full([2, 3], 3.14).shape[1]").getNumber(), 3);

  // Test full with float32 dtype option (default), expecting 3.14f (C++ float)
  EXPECT_EQ(
      eval("torch.full([2, 3], 3.14, {dtype:'float32'}).shape[0]").getNumber(),
      2);
  EXPECT_EQ(
      eval("torch.full([2, 3], 3.14, {dtype:'float32'}).shape[1]").getNumber(),
      3);
  for (auto i = 0; i < 2; i++) {
    for (auto j = 0; j < 3; j++) {
      std::string val_s = fmt::format(
          "torch.full([2, 3], 3.14, {{dtype:'float32'}})[{}][{}].item()", i, j);
      EXPECT_EQ(eval(val_s).getNumber(), 3.14f);
    }
  }

  // Test full with float64 dtype option, expecting 3.14 (C++ double)
  EXPECT_EQ(
      eval("torch.full([2, 3], 3.14, {dtype:'float64'}).shape[0]").getNumber(),
      2);
  EXPECT_EQ(
      eval("torch.full([2, 3], 3.14, {dtype:'float64'}).shape[1]").getNumber(),
      3);
  for (auto i = 0; i < 2; i++) {
    for (auto j = 0; j < 3; j++) {
      std::string val_s = fmt::format(
          "torch.full([2, 3], 3.14, {{dtype:'float64'}})[{}][{}].item()", i, j);
      EXPECT_EQ(eval(val_s).getNumber(), 3.14);
    }
  }

  // Test full with int32 dtype option, expecting 3 (C++ int)
  EXPECT_EQ(
      eval("torch.full([2, 3], 3.14, {dtype:'int32'}).shape[0]").getNumber(),
      2);
  EXPECT_EQ(
      eval("torch.full([2, 3], 3.14, {dtype:'int32'}).shape[1]").getNumber(),
      3);
  for (auto i = 0; i < 2; i++) {
    for (auto j = 0; j < 3; j++) {
      std::string val_s = fmt::format(
          "torch.full([2, 3], 3.14, {{dtype:'int32'}})[{}][{}].item()", i, j);
      EXPECT_EQ(eval(val_s).getNumber(), 3);
    }
  }

  // Test full with no parameters (invalid).
  EXPECT_THROW(eval("torch.full()"), facebook::jsi::JSError);

  // Test full with one parameter (invalid).
  EXPECT_THROW(eval("torch.full([1, 2])"), facebook::jsi::JSError);
}

TEST_F(TorchliveRuntimeTest, TorchLogspaceTest) {
  // expect length to be equal to steps
  EXPECT_EQ(eval("torch.logspace(-10, 10, 5).shape[0]").getNumber(), 5);

  // expect default base to perform correctly
  std::string defaultBaseExpected =
      R"(
    const result = torch.logspace(2, 2, 1);
    const expected = torch.logspace(2, 2, 1, {base: 10});
    result.shape.length == expected.shape.length && result.shape.every((v, i) => v == expected.shape[i]) && result.data().every((v, i) => v == expected.data()[i]);
  )";
  EXPECT_TRUE(eval(defaultBaseExpected).getBool());

  // expect base to perform correctly
  std::string setBaseExpected =
      R"(
    const result = torch.logspace(2, 2, 1, {base: 2});
    const expectedShape = [1];
    expectedData = [4];
    result.shape.length == expectedShape.length && result.shape.every((v, i) => v == expectedShape[i]) && result.data().every((v, i) => v == expectedData[i]);
  )";
  EXPECT_TRUE(eval(setBaseExpected).getBool());

  // expect default dtype to perform correctly
  std::string defaultDtypeExpected =
      R"(
    const result = torch.logspace(2, 2, 1);
    result.dtype == torch.float32;
  )";
  EXPECT_TRUE(eval(defaultDtypeExpected).getBool());

  // expect dtype to perform correctly
  std::string setDtypeExpected =
      R"(
    const result = torch.logspace(2, 2, 1, {dtype: torch.int});
    result.dtype == torch.int;
  )";
  EXPECT_TRUE(eval(setDtypeExpected).getBool());

  // expect base and dtype to perform correctly
  std::string setBaseAndDtypeExpected =
      R"(
    const result = torch.logspace(2, 2, 1, {base: 2, dtype: torch.int});
    const expectedShape = [1];
    expectedData = [4];
    result.shape.length == expectedShape.length && result.shape.every((v, i) => v == expectedShape[i]) && result.data().every((v, i) => v == expectedData[i]) && result.dtype == torch.int32;
  )";
  EXPECT_TRUE(eval(setBaseAndDtypeExpected).getBool());

  // not enough args
  EXPECT_THROW(eval("torch.logspace(2, 2)"), facebook::jsi::JSError);
}

TEST_F(TorchliveRuntimeTest, TorchRandPermTest) {
  // Test randperm with a valid upperbound
  EXPECT_EQ(eval("torch.randperm(5).shape[0]").getNumber(), 5);

  // Test randperm with float64 datatype and a valid upperbound
  EXPECT_EQ(
      eval("torch.randperm(5,{dtype:'float64'}).shape[0]").getNumber(), 5);

  // Test randperm with an invalid upperbound
  EXPECT_THROW(eval("torch.randperm(-1)"), facebook::jsi::JSError);

  // Test randperm with a 0 upperbound
  EXPECT_EQ(eval("torch.randperm(0).shape[0]").getNumber(), 0);

  // Test randperm with an invalid upperbound
  EXPECT_THROW(eval("torch.randperm([1,2])"), facebook::jsi::JSError);

  // Test randperm with no parameters
  EXPECT_THROW(eval("torch.randperm()"), facebook::jsi::JSError);

  // Test randperm with float64 datatype and verify the datatype
  EXPECT_TRUE(
      eval("torch.randperm(5,{dtype:'float64'}).dtype === torch.float64")
          .getBool());

  // Test randperm with an upperbound of 5, expecting integers in the range 0 to
  // 4
  std::string torchRandPermData =
      R"(
          const tensor = torch.randperm(5, {dtype:'int32'});
          const data = tensor.data();
          data.sort();
          data[0] === 0 && data[1] === 1 && data[2] === 2 && data[3] === 3 && data[4] === 4;
        )";
  EXPECT_TRUE(eval(torchRandPermData).getBool());
}
TEST_F(TorchliveRuntimeTest, TorchRandnTest) {
  // Test randn with a single dimension
  EXPECT_EQ(eval("torch.randn([4]).shape[0]").getNumber(), 4);

  // Test randn with multiple dimensions
  EXPECT_EQ(eval("torch.randn([2, 3]).shape[0]").getNumber(), 2);
  EXPECT_EQ(eval("torch.randn([2, 3]).shape[1]").getNumber(), 3);

  // Test randn with float32 dtype option (default), expecting C++ float
  EXPECT_EQ(
      eval("torch.randn([2, 3], {dtype:'float32'}).shape[0]").getNumber(), 2);
  EXPECT_EQ(
      eval("torch.randn([2, 3], {dtype:'float32'}).shape[1]").getNumber(), 3);

  // Test randn with float64 dtype option, expecting C++ double
  EXPECT_EQ(
      eval("torch.randn([2, 3], {dtype:'float64'}).shape[0]").getNumber(), 2);
  EXPECT_EQ(
      eval("torch.randn([2, 3], {dtype:'float64'}).shape[1]").getNumber(), 3);

  // Test randn with no parameters (invalid).
  EXPECT_THROW(eval("torch.randn()"), facebook::jsi::JSError);
  EXPECT_THROW(eval("torch.randn([1, 'x'])"), facebook::jsi::JSError);
  EXPECT_THROW(eval("torch.randn(2,3)"), facebook::jsi::JSError);
}

} // namespace
