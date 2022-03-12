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
#include <memory>
#include <string>

#include "TorchliveTestBase.h"

using namespace facebook;

namespace {

class TorchlivePromiseTest : public torchlive::test::TorchliveTestBase {
 public:
  TorchlivePromiseTest() : torchlive::test::TorchliveTestBase() {
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
        jsi::PropNameID::forUtf8(*rt, "setImmediate_TorchlivePromiseTest"),
        1,
        setImmediate);
    rt->global().setProperty(*rt, "setImmediate", setImmediateFn);
  }

 private:
  int setImmediateID = 1234;
};

TEST_F(TorchlivePromiseTest, PromiseResolveTest) {
  auto pValue = torchlive::createPromiseAsJSIValue(
      *rt, [](jsi::Runtime& rt, std::shared_ptr<torchlive::Promise> p) {
        p->resolve(jsi::Value(42));
      });
  rt->global().setProperty(*rt, "p", pValue);
  eval("p.then(val => { result = val; })");
  EXPECT_EQ(eval("result").getNumber(), 42);
}

TEST_F(TorchlivePromiseTest, PromiseRejectTest) {
  auto pValue = torchlive::createPromiseAsJSIValue(
      *rt, [](jsi::Runtime& rt, std::shared_ptr<torchlive::Promise> p) {
        p->reject("try, try again");
      });
  rt->global().setProperty(*rt, "p", pValue);
  eval("p.catch(err => { result = err.message; })");
  EXPECT_EQ(eval("result").getString(*rt).utf8(*rt), "try, try again");
}

} // namespace
