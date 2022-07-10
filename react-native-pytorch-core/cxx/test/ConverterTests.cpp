/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include <gtest/gtest.h>
#include "ATen/core/dynamic_type.h"
#include "torchlive/torch/TensorHostObject.h"
#include "torchlive/torch/utils/converter.h"
#include "torchlive/torch/utils/helpers.h"

#include "TorchliveTestBase.h"

using namespace facebook;
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

  c10::List<c10::List<int64_t>> b1 = {a1, a2};
  c10::List<c10::List<int64_t>> b2 = {a3, a4};

  c10::List<c10::List<c10::List<int64_t>>> c1 = {b1, b2};

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

// jsi::Value to IValue conversion tests

TEST_F(TorchliveConverterRuntimeTest, jsiValueNumberToIValue) {
  // when model is expecting float and a double is passed
  auto jsiDoubleValue = jsi::Value(3.5);
  auto dynType = c10::DynamicType::create(*c10::FloatType::get());
  auto iValue1 = jsiValuetoIValue(*rt, jsiDoubleValue, *dynType);
  EXPECT_EQ(iValue1, 3.5);
  EXPECT_TRUE(iValue1.isDouble());

  // when model is expecting int and a int is passed
  auto jsiIntValue = jsi::Value(3);
  auto iValue2 = jsiValuetoIValue(
      *rt, jsiIntValue, *c10::DynamicType::create(*c10::IntType::get()));
  EXPECT_EQ(iValue2, 3);
  EXPECT_TRUE(iValue2.isInt());

  // when model is expecting int and a double is passed
  EXPECT_THROW(
      jsiValuetoIValue(
          *rt, jsiDoubleValue, *c10::DynamicType::create(*c10::IntType::get())),
      jsi::JSError);
}

TEST_F(TorchliveConverterRuntimeTest, jsiValueBooleanToIValue) {
  auto jsiBooleanValue = jsi::Value(true);
  auto iValue = jsiValuetoIValue(
      *rt, jsiBooleanValue, *c10::DynamicType::create(*c10::BoolType::get()));
  EXPECT_EQ(iValue, true);
  EXPECT_TRUE(iValue.isBool());
}

TEST_F(TorchliveConverterRuntimeTest, jsiValueStringToIValue) {
  auto jsiStringValue =
      jsi::Value(*rt, jsi::String::createFromAscii(*rt, "test"));
  auto iValue = jsiValuetoIValue(
      *rt, jsiStringValue, *c10::DynamicType::create(*c10::StringType::get()));
  EXPECT_EQ(iValue, "test");
  EXPECT_TRUE(iValue.isString());
}

TEST_F(TorchliveConverterRuntimeTest, jsiValueNullToIValue) {
  auto jsiNullValue = jsi::Value::null();
  auto iValue = jsiValuetoIValue(
      *rt, jsiNullValue, *c10::DynamicType::create(*c10::NoneType::get()));
  EXPECT_EQ(iValue, c10::nullopt);
  EXPECT_TRUE(iValue.isNone());
}

TEST_F(TorchliveConverterRuntimeTest, jsiValueUndefindToIValue) {
  auto jsiUndefindValue = jsi::Value::undefined();
  auto iValue = jsiValuetoIValue(
      *rt, jsiUndefindValue, *c10::DynamicType::create(*c10::NoneType::get()));
  EXPECT_EQ(iValue, c10::nullopt);
  EXPECT_TRUE(iValue.isNone());
}

TEST_F(TorchliveConverterRuntimeTest, jsiValueTensorToIValue) {
  auto testTensor = torch_::tensor(
      std::vector<double>({1, 2, 3}),
      c10::TensorOptions().dtype(torch_::kDouble));
  auto tensorHostObject = ivalueToJSIValue(*rt, testTensor);

  auto iValueFromJsiValue = jsiValuetoIValue(
      *rt,
      tensorHostObject,
      *c10::DynamicType::create(*c10::TensorType::get()));

  EXPECT_TRUE(testTensor.equal(iValueFromJsiValue.toTensor()));
  EXPECT_TRUE(iValueFromJsiValue.isTensor());
}

TEST_F(TorchliveConverterRuntimeTest, jsValuecListToIValue) {
  auto intTypePtr = c10::DynamicType::create(*c10::IntType::get());
  auto intListTypePtr =
      c10::DynamicType::create(*c10::ListType::get("IntListPtr", intTypePtr));
  auto jsArraryOneD = jsi::Array::createWithElements(
      *rt, {jsi::Value(1), jsi::Value(2), jsi::Value(3)});
  auto iValue = jsiValuetoIValue(*rt, std::move(jsArraryOneD), *intListTypePtr);
  EXPECT_TRUE(iValue.isIntList());
  EXPECT_EQ(iValue.toIntList().vec()[0], 1);
  EXPECT_EQ(iValue.toIntList().vec()[1], 2);
  EXPECT_EQ(iValue.toIntList().vec()[2], 3);

  // jsi::Value is not copiable, so we have to create Test Data Manually
  // Data looks like
  // [[[1,2,3], [4,5]], [[6,7], [8]]]

  auto createJsiValueArray =
      [](jsi::Runtime& rt, std::initializer_list<jsi::Value> l) -> jsi::Value {
    return jsi::Value(rt, jsi::Array::createWithElements(rt, l));
  };

  auto jsArray1D1 = createJsiValueArray(
      *rt,
      {
          jsi::Value(1),
          jsi::Value(2),
          jsi::Value(3),
      });

  auto jsArray1D2 = createJsiValueArray(
      *rt,
      {
          jsi::Value(4),
          jsi::Value(5),
      });

  auto jsArray1D3 = createJsiValueArray(
      *rt,
      {
          jsi::Value(6),
          jsi::Value(7),
      });

  auto jsArray1D4 = createJsiValueArray(*rt, {jsi::Value(8)});
  auto jsArray2D1 = jsi::Array::createWithElements(
      *rt,
      {
          std::move(jsArray1D1),
          std::move(jsArray1D2),
      });
  auto jsArray2D2 = createJsiValueArray(
      *rt,
      {
          std::move(jsArray1D3),
          std::move(jsArray1D4),
      });

  auto jsArray3D = createJsiValueArray(
      *rt,
      {
          std::move(jsArray2D1),
          std::move(jsArray2D2),
      });

  auto int2DListTypePtr = c10::DynamicType::create(
      *c10::ListType::get("Int2DListPtr", intListTypePtr));
  auto int3DListTypePtr = c10::DynamicType::create(
      *c10::ListType::get("Int3DListPtr", int2DListTypePtr));
  auto iValue2 = jsiValuetoIValue(*rt, jsArray3D, *int3DListTypePtr);

  EXPECT_TRUE(iValue2.isList());
  EXPECT_EQ(iValue2.toList().vec()[0].toList().vec()[0].toList().vec()[0], 1);
  EXPECT_EQ(iValue2.toList().vec()[1].toList().vec()[0].toList().vec()[0], 6);
  EXPECT_EQ(iValue2.toList().vec()[1].toList().vec()[1].toList().vec()[0], 8);
}

TEST_F(TorchliveConverterRuntimeTest, jsiValueInputUnmatchIValue) {
  auto testTensor = torch_::tensor(
      std::vector<double>({1}), c10::TensorOptions().dtype(torch_::kInt32));
  auto tensorHostObject = ivalueToJSIValue(*rt, testTensor);

  EXPECT_THROW(
      jsiValuetoIValue(
          *rt,
          tensorHostObject,
          *c10::DynamicType::create(*c10::IntType::get())),
      std::exception);
}

TEST_F(TorchliveConverterRuntimeTest, jsValuecObjectToIValueDict) {
  auto intTypePtr = c10::DynamicType::create(*c10::IntType::get());
  auto intListTypePtr =
      c10::DynamicType::create(*c10::ListType::get("IntListPtr", intTypePtr));
  auto stringTypePtr = c10::DynamicType::create(*c10::StringType::get());
  auto dictTypePtr = c10::DynamicType::create(
      *c10::DictType::get("DictPtr", stringTypePtr, intListTypePtr));
  const jsi::Value& jsArraryOneD = jsi::Array::createWithElements(
      *rt, {jsi::Value(1), jsi::Value(2), jsi::Value(3)});
  auto jsObject = jsi::Object(*rt);
  jsObject.setProperty(*rt, "apple", jsArraryOneD);
  const jsi::Value& jsValue = jsi::Value(*rt, jsObject);
  auto iValue = jsiValuetoIValue(*rt, jsValue, *dictTypePtr);

  EXPECT_TRUE(iValue.isGenericDict());
  for (auto& item : iValue.toGenericDict()) {
    auto key = item.key();
    auto val = item.value();
    EXPECT_TRUE(key.isString());
    EXPECT_TRUE(val.isIntList());
  }
  EXPECT_EQ(iValue.toGenericDict().at("apple").toIntList().vec()[0], 1);
  EXPECT_EQ(iValue.toGenericDict().at("apple").toIntList().vec()[1], 2);
  EXPECT_EQ(iValue.toGenericDict().at("apple").toIntList().vec()[2], 3);
}

TEST_F(TorchliveConverterRuntimeTest, jsValueTupleToIValue) {
  auto intTypePtr = c10::DynamicType::create(*c10::IntType::get());
  auto stringTypePtr = c10::DynamicType::create(*c10::StringType::get());
  auto tuple1DTypePtr = c10::DynamicType::create(
      *c10::TupleType::create({intTypePtr, stringTypePtr}));
  auto tuple2DTypePtr = c10::DynamicType::create(
      *c10::TupleType::create({intTypePtr, tuple1DTypePtr}));
  auto jsTuple1D = jsi::Array::createWithElements(
      *rt, {jsi::Value(1), jsi::String::createFromUtf8(*rt, "apple")});
  const jsi::Value& jsTuple2D = jsi::Array::createWithElements(
      *rt, {jsi::Value(2), jsi::Value(*rt, jsTuple1D)});
  auto iValue = jsiValuetoIValue(*rt, jsTuple2D, *tuple2DTypePtr);
  EXPECT_TRUE(iValue.isTuple());
  EXPECT_EQ(iValue.toTuple()->size(), 2);
  EXPECT_EQ(iValue.toTuple()->elements().at(0), 2);
  EXPECT_TRUE(iValue.toTuple()->elements().at(1).isTuple());
  EXPECT_EQ(iValue.toTuple()->elements().at(1).toTuple()->elements().at(0), 1);
  EXPECT_EQ(
      iValue.toTuple()->elements().at(1).toTuple()->elements().at(1), "apple");
}
