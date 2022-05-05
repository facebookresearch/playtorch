/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include <gtest/gtest.h>
#include "torchlive/torch/utils/converter.h"
#include "torchlive/torch/utils/helpers.h"

#include "TorchliveTestBase.h"

using namespace torchlive::utils::converter;
// Namespace alias for torch to avoid namespace conflicts with torchlive::torch
namespace torch_ = torch;

class TorchliveConverterRuntimeTest
    : public torchlive::test::TorchliveBindingsTestBase {};

TEST_F(TorchliveConverterRuntimeTest, nullConversion) {
  auto jsval = ivalueToJSIValue(*rt, c10::nullopt);
  EXPECT_TRUE(jsval.isNull());
}

TEST_F(TorchliveConverterRuntimeTest, tensorConversion) {
  at::Tensor t = torch_::tensor(
      std::vector<double>({1, 2, 3}),
      c10::TensorOptions().dtype(torch_::kDouble));
  auto jsval = ivalueToJSIValue(*rt, t);
  auto unpacked = torchlive::utils::helpers::parseTensor(*rt, &jsval);
  EXPECT_TRUE(unpacked->tensor.equal(t));
}

TEST_F(TorchliveConverterRuntimeTest, DoubleConversion) {
  auto jsval = ivalueToJSIValue(*rt, 3.14159);
  EXPECT_EQ(jsval.asNumber(), 3.14159);
}

TEST_F(TorchliveConverterRuntimeTest, intConversion) {
  auto jsval = ivalueToJSIValue(*rt, 41);
  EXPECT_EQ(static_cast<int>(jsval.asNumber()), 41);
}

TEST_F(TorchliveConverterRuntimeTest, boolConversion) {
  auto jsval = ivalueToJSIValue(*rt, true);
  EXPECT_EQ(jsval.getBool(), true);
}

TEST_F(TorchliveConverterRuntimeTest, stringConversion) {
  auto jsval = ivalueToJSIValue(*rt, "test");
  EXPECT_EQ(jsval.asString(*rt).utf8(*rt), "test");
}

TEST_F(TorchliveConverterRuntimeTest, genericDictConversion) {
  // constructing an object as
  // {"a1":
  //      {"b1":
  //           {"c1": 1},
  //       "b2":
  //           {"c2": 2}},
  // "a2":
  //       {"b3":
  //           {"c3": 3}}}

  c10::Dict<std::string, double> c1;
  c10::Dict<std::string, double> c2;
  c10::Dict<std::string, double> c3;
  c10::Dict<std::string, c10::Dict<std::string, double>> b12;
  c10::Dict<std::string, c10::Dict<std::string, double>> b3;
  c10::Dict<std::string, c10::Dict<std::string, c10::Dict<std::string, double>>>
      a12;

  c1.insert("c1", 1);
  c2.insert("c2", 2);
  b12.insert("b1", c1);
  b12.insert("b2", c2);
  b3.insert("b3", c3);
  c3.insert("c3", 3);
  a12.insert("a1", b12);
  a12.insert("a2", b3);

  auto jsval = ivalueToJSIValue(*rt, a12);

  EXPECT_TRUE(jsval.isObject());
  EXPECT_TRUE(jsval.asObject(*rt).getProperty(*rt, "a1").isObject());
  EXPECT_TRUE(jsval.asObject(*rt).getProperty(*rt, "a2").isObject());
  EXPECT_TRUE(jsval.asObject(*rt).getProperty(*rt, "a3").isUndefined());

  EXPECT_TRUE(
      jsval.asObject(*rt)
          .getPropertyAsObject(*rt, "a1")
          .getPropertyAsObject(*rt, "b1")
          .getProperty(*rt, "c1")
          .asNumber() == 1);
  EXPECT_TRUE(
      jsval.asObject(*rt)
          .getPropertyAsObject(*rt, "a1")
          .getPropertyAsObject(*rt, "b2")
          .getProperty(*rt, "c2")
          .asNumber() == 2);
  EXPECT_TRUE(
      jsval.asObject(*rt)
          .getPropertyAsObject(*rt, "a2")
          .getPropertyAsObject(*rt, "b3")
          .getProperty(*rt, "c3")
          .asNumber() == 3);
}

TEST_F(TorchliveConverterRuntimeTest, ListConversion) {
  // constructing a 3d ivalue list
  // [
  //   [
  //     [1,2], // a1
  //     [3,4], // a2
  //   ], // b1
  //   [
  //     [5,6], // a3
  //     [7,8], // a4
  //   ] // b2
  // ] // c1

  c10::List<int64_t> a1 = {1, 2};
  c10::List<int64_t> a2 = {3, 4};
  c10::List<int64_t> a3 = {5, 6};
  c10::List<int64_t> a4 = {7, 8};

  c10::List b1 = {a1, a2};
  c10::List b2 = {a3, a4};

  c10::List c1 = {b1, b2};

  // the IValue Constructor will recusively construct the original data as
  // IValue e.g c10::List<c10::List<double>> will be constructed as
  // IValue<c10::List<IValue<c10::List<IValue<double>>>>>
  auto jsval = ivalueToJSIValue(*rt, c1);
  EXPECT_TRUE(jsval.isObject());
  EXPECT_TRUE(jsval.asObject(*rt).isArray(*rt));

  for (int i = 0; i < 2; i++) {
    for (int j = 0; j < 2; j++) {
      for (int k = 0; k < 2; k++) {
        EXPECT_EQ(
            jsval.asObject(*rt)
                .asArray(*rt)
                .getValueAtIndex(*rt, i)
                .asObject(*rt)
                .asArray(*rt)
                .getValueAtIndex(*rt, j)
                .asObject(*rt)
                .asArray(*rt)
                .getValueAtIndex(*rt, k)
                .asNumber(),
            i * 4 + j * 2 + k + 1);
      }
    }
  }
}

TEST_F(TorchliveConverterRuntimeTest, TupleConversion) {
  std::tuple<double, bool> childTp({3.15, false});
  std::tuple<
      double,
      int64_t,
      std::string,
      bool,
      c10::nullopt_t,
      std::tuple<double, bool>>
      tp({3.14, 41, "test", true, c10::nullopt, childTp});
  auto jsval = ivalueToJSIValue(*rt, tp);

  EXPECT_TRUE(jsval.isObject());
  EXPECT_TRUE(jsval.asObject(*rt).isArray(*rt));
  auto jsArr = jsval.asObject(*rt).asArray(*rt);
  EXPECT_EQ(jsArr.getValueAtIndex(*rt, 0).asNumber(), 3.14);
  EXPECT_EQ(jsArr.getValueAtIndex(*rt, 1).asNumber(), 41);
  EXPECT_EQ(jsArr.getValueAtIndex(*rt, 2).asString(*rt).utf8(*rt), "test");
  EXPECT_TRUE(jsArr.getValueAtIndex(*rt, 3).isBool());
  EXPECT_EQ(jsArr.getValueAtIndex(*rt, 3).getBool(), true);
  EXPECT_TRUE(jsArr.getValueAtIndex(*rt, 4).isNull());

  auto childJsArr = jsArr.getValueAtIndex(*rt, 5).asObject(*rt).asArray(*rt);
  EXPECT_EQ(childJsArr.getValueAtIndex(*rt, 0).asNumber(), 3.15);
  EXPECT_EQ(childJsArr.getValueAtIndex(*rt, 1).getBool(), false);
}
