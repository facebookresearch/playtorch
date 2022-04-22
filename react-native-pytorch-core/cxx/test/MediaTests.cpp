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

} // namespace
