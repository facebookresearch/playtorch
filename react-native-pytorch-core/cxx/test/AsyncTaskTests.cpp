/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include <gtest/gtest.h>
#include "torchlive/common/AsyncTask.h"
#include "torchlive/torchlive.h"

#include "TorchliveTestBase.h"

using namespace torchlive::common;
using namespace facebook;

class TorchliveAsyncTaskRuntimeTest
    : public torchlive::test::TorchliveBindingsTestBase {};

TEST_F(TorchliveAsyncTaskRuntimeTest, setupTaskFail) {
  auto asyncTask = AsyncTask<std::vector<int>, int>(
      [&](jsi::Runtime& runtime,
          const jsi::Value& thisValue,
          const jsi::Value* arguments,
          size_t count) -> std::vector<int> {
        return std::vector<int>{1, 2, 3};
      },
      [](std::vector<int> arr) -> int {
        int res = 0;
        for (int x : arr) {
          res += x;
        }
        return res;
      },
      [](jsi::Runtime& runtime,
         torchlive::RuntimeExecutor runtimeExecutor,
         int res) -> facebook::jsi::Value {
        return facebook::jsi::Value(res);
      });
  auto dummyHostObject = jsi::Value::null();
  auto dummyArguments = jsi::Value::null();

  auto syncFunc = asyncTask.syncFunc(
      [](std::function<void(jsi::Runtime & runtime)>&& callback) {});
  auto resSync = syncFunc(*rt, dummyHostObject, &dummyHostObject, 1);

  EXPECT_TRUE(resSync.isNumber());
  EXPECT_EQ(resSync.asNumber(), 6);

  // TODO(T124305556) Test AsyncFunc when RuntimeExecutor is available
}
