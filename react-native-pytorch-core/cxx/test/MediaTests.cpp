/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include <jsi/jsi.h>

#include <fmt/format.h>
#include <gtest/gtest.h>
#include <torchlive/Promise.h>
#include <torchlive/torchlive.h>
#include <string>

#include "TorchliveTestBase.h"

namespace {

using namespace facebook;

class TorchliveMediaRuntimeTest
    : public torchlive::test::TorchliveBindingsTestBase {
 public:
  TorchliveMediaRuntimeTest() : torchlive::test::TorchliveBindingsTestBase() {
    // Provide setImmediate, which is needed for then/catch on Promises.
    auto setImmediate = [this](
                            jsi::Runtime& runtime,
                            const jsi::Value& thisValue,
                            const jsi::Value* arguments,
                            size_t count) -> jsi::Value {
      setImmediateID++;
      // Call straightaway for convenience. That's cheating. Spec says to wait
      // until current execution and pending events are complete.
      arguments[0].asObject(*rt).getFunction(*rt).call(
          *rt, arguments + 1, count - 1);
      return jsi::Value(setImmediateID);
    };
    auto setImmediateFn = jsi::Function::createFromHostFunction(
        *rt,
        jsi::PropNameID::forUtf8(*rt, "setImmediate_TorchliveMediaRuntimeTest"),
        1,
        setImmediate);
    rt->global().setProperty(*rt, "setImmediate", setImmediateFn);

    importTorchliveModule("media");
  }

  jsi::Value evalPromise(
      const std::string& promiseBody,
      const std::string& resultVariableName,
      const std::string& evalCode) {
    auto pValue = torchlive::createPromiseAsJSIValue(
        *rt,
        [&promiseBody](
            jsi::Runtime& rt, std::shared_ptr<torchlive::Promise> p) {
          auto value = rt.global()
                           .getPropertyAsFunction(rt, "eval")
                           .call(rt, promiseBody);
          p->resolve(std::move(value));
        });
    rt->global().setProperty(*rt, "p", std::move(pValue));
    eval(fmt::format(
        "p.then(val => {{ {resultName} = val; }})",
        fmt::arg("resultName", resultVariableName)));
    return eval(evalCode);
  }

 private:
  int setImmediateID = 1234;
};

TEST_F(TorchliveMediaRuntimeTest, ToBlobExistsTest) {
  EXPECT_TRUE(eval("media.toBlob;").isObject());
  EXPECT_THROW(eval("media.toBlob('not-valid');"), facebook::jsi::JSError);
}

TEST_F(TorchliveMediaRuntimeTest, TensorToBlobTest) {
  // Check tensor to blob and back to tensor. The test case does an
  // element-wise comparison using the JavaScript Array.every
  // function.
  std::string tensorToBlob =
      R"(
          const tensor1 = torch.tensor([2, 3, 4], {dtype: torch.uint8});
          const blob = media.toBlob(tensor1);
          const tensor2 = torch.fromBlob(blob, [3]);
          const data1 = tensor1.data();
          const data2 = tensor2.data();
          data1.every((value, i) => value === data2[i]);
        )";
  EXPECT_TRUE(eval(tensorToBlob).getBool());
}

TEST_F(TorchliveMediaRuntimeTest, BlobArrayBufferTest) {
  std::string data = "[2, 3, 4]";
  std::string code = fmt::format(
      R"(
        const tensor = torch.tensor({data}, {{dtype: torch.uint8}});
        const blob = media.toBlob(tensor);
        blob.arrayBuffer();
      )",
      fmt::arg("data", data));

  std::string evalCode = fmt::format(
      R"(
        const data = {data};
        result.every((value, i) => value === data[i])
      )",
      fmt::arg("data", data));

  EXPECT_TRUE(evalPromise(code, "result", evalCode).getBool());
}

TEST_F(TorchliveMediaRuntimeTest, BlobSizeTest) {
  std::string data = "[2, 3, 4]";
  std::string code = fmt::format(
      R"(
        const tensor = torch.tensor({data}, {{dtype: torch.uint8}});
        const blob = media.toBlob(tensor);
        blob.size;
      )",
      fmt::arg("data", data));

  EXPECT_EQ(eval(code).getNumber(), 3);
}

TEST_F(TorchliveMediaRuntimeTest, BlobSliceTest) {
  // Empty inputs - slice()
  std::string data = "[2, 3, 4, 5, 6]";
  std::string expectedResult = "[2, 3, 4, 5, 6]";
  std::string code = fmt::format(
      R"(
        const tensor = torch.tensor({data}, {{dtype: torch.uint8}});
        let blob = media.toBlob(tensor);
        blob = blob.slice();
        blob.arrayBuffer();
      )",
      fmt::arg("data", data));

  std::string evalCode = fmt::format(
      R"(
        const expectedResult = {expectedResult};
        result.every((value, i) => value === expectedResult[i])
      )",
      fmt::arg("expectedResult", expectedResult));

  EXPECT_TRUE(evalPromise(code, "result", evalCode).getBool());

  // Empty inputs - slice()
  // Return a new Blob with empty args.
  data = "[2, 3, 4, 5, 6]";
  code = fmt::format(
      R"(
        const tensor = torch.tensor({data}, {{dtype: torch.uint8}});
        let blob1 = media.toBlob(tensor);
        let blob2 = blob1.slice();
        blob1 === blob2;
      )",
      fmt::arg("data", data));

  EXPECT_FALSE(eval(code).getBool());

  // One valid positive input - slice(start)
  data = "[2, 3, 4, 5, 6]";
  expectedResult = "[4, 5, 6]";
  code = fmt::format(
      R"(
        const tensor = torch.tensor({data}, {{dtype: torch.uint8}});
        let blob = media.toBlob(tensor);
        blob = blob.slice(2);
        blob.arrayBuffer();
      )",
      fmt::arg("data", data));

  evalCode = fmt::format(
      R"(
        const expectedResult = {expectedResult};
        result.every((value, i) => value === expectedResult[i])
      )",
      fmt::arg("expectedResult", expectedResult));

  EXPECT_TRUE(evalPromise(code, "result", evalCode).getBool());

  // One valid negative input - slice(start)
  data = "[2, 3, 4, 5, 6]";
  expectedResult = "[4, 5, 6]";
  code = fmt::format(
      R"(
        const tensor = torch.tensor({data}, {{dtype: torch.uint8}});
        let blob = media.toBlob(tensor);
        blob = blob.slice(-3);
        blob.arrayBuffer();
      )",
      fmt::arg("data", data));

  evalCode = fmt::format(
      R"(
        const expectedResult = {expectedResult};
        result.every((value, i) => value === expectedResult[i])
      )",
      fmt::arg("expectedResult", expectedResult));

  EXPECT_TRUE(evalPromise(code, "result", evalCode).getBool());

  // One invalid positive input - slice(start)
  data = "[2, 3, 4, 5, 6]";
  expectedResult = "[]";
  code = fmt::format(
      R"(
        const tensor = torch.tensor({data}, {{dtype: torch.uint8}});
        let blob = media.toBlob(tensor);
        blob = blob.slice(10);
        blob.arrayBuffer();
      )",
      fmt::arg("data", data));

  evalCode = fmt::format(
      R"(
        const expectedResult = {expectedResult};
        result.every((value, i) => value === expectedResult[i])
      )",
      fmt::arg("expectedResult", expectedResult));

  EXPECT_TRUE(evalPromise(code, "result", evalCode).getBool());

  // One invalid negative input - slice(start)
  data = "[2, 3, 4, 5, 6]";
  expectedResult = "[]";
  code = fmt::format(
      R"(
        const tensor = torch.tensor({data}, {{dtype: torch.uint8}});
        let blob = media.toBlob(tensor);
        blob = blob.slice(-7);
        blob.arrayBuffer();
      )",
      fmt::arg("data", data));

  evalCode = fmt::format(
      R"(
        const expectedResult = {expectedResult};
        result.every((value, i) => value === expectedResult[i])
      )",
      fmt::arg("expectedResult", expectedResult));

  EXPECT_TRUE(evalPromise(code, "result", evalCode).getBool());

  // Two inputs - slice(start, end)
  // Valid positive case
  data = "[2, 3, 4, 5, 6]";
  expectedResult = "[3, 4, 5]";
  code = fmt::format(
      R"(
        const tensor = torch.tensor({data}, {{dtype: torch.uint8}});
        let blob = media.toBlob(tensor);
        blob = blob.slice(1, 4);
        blob.arrayBuffer();
      )",
      fmt::arg("data", data));

  evalCode = fmt::format(
      R"(
        const expectedResult = {expectedResult};
        result.every((value, i) => value === expectedResult[i])
      )",
      fmt::arg("expectedResult", expectedResult));

  EXPECT_TRUE(evalPromise(code, "result", evalCode).getBool());

  // Two inputs - slice(start, end)
  // Valid negative case
  data = "[2, 3, 4, 5, 6]";
  expectedResult = "[3, 4, 5]";
  code = fmt::format(
      R"(
        const tensor = torch.tensor({data}, {{dtype: torch.uint8}});
        let blob = media.toBlob(tensor);
        blob = blob.slice(-4, -1);
        blob.arrayBuffer();
      )",
      fmt::arg("data", data));

  evalCode = fmt::format(
      R"(
        const expectedResult = {expectedResult};
        result.every((value, i) => value === expectedResult[i])
      )",
      fmt::arg("expectedResult", expectedResult));

  EXPECT_TRUE(evalPromise(code, "result", evalCode).getBool());

  // Two inputs - slice(start, end)
  // Invalid positive case
  data = "[2, 3, 4, 5, 6]";
  expectedResult = "[]";
  code = fmt::format(
      R"(
        const tensor = torch.tensor({data}, {{dtype: torch.uint8}});
        let blob = media.toBlob(tensor);
        blob = blob.slice(4, 3);
        blob.arrayBuffer();
      )",
      fmt::arg("data", data));

  evalCode = fmt::format(
      R"(
        const expectedResult = {expectedResult};
        result.every((value, i) => value === expectedResult[i])
      )",
      fmt::arg("expectedResult", expectedResult));

  EXPECT_TRUE(evalPromise(code, "result", evalCode).getBool());

  // Two inputs - slice(start, end)
  // Invalid negative case
  data = "[2, 3, 4, 5, 6]";
  expectedResult = "[]";
  code = fmt::format(
      R"(
        const tensor = torch.tensor({data}, {{dtype: torch.uint8}});
        let blob = media.toBlob(tensor);
        blob = blob.slice(-3, -5);
        blob.arrayBuffer();
      )",
      fmt::arg("data", data));

  evalCode = fmt::format(
      R"(
        const expectedResult = {expectedResult};
        result.every((value, i) => value === expectedResult[i])
      )",
      fmt::arg("expectedResult", expectedResult));

  EXPECT_TRUE(evalPromise(code, "result", evalCode).getBool());
}

} // namespace
