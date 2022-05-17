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

class TorchliveMediaRuntimeTest
    : public torchlive::test::TorchliveBindingsTestBase {
 public:
  TorchliveMediaRuntimeTest() : torchlive::test::TorchliveBindingsTestBase() {
    importTorchliveModule("media");
  }
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

} // namespace
