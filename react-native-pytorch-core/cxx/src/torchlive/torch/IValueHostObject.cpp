/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include "IValueHostObject.h"
#include "DictHostObject.h"
#include "TensorHostObject.h"

namespace torchlive {
namespace torch {

using namespace facebook;

namespace {

jsi::Value toGenericDictImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  // c10::Dict<IValue, IValue>
  auto thiz =
      thisValue.asObject(runtime).asHostObject<IValueHostObject>(runtime);
  auto dict = thiz->value.toGenericDict();
  auto dictHostObject =
      std::make_shared<torchlive::torch::DictHostObject>(dict);
  return jsi::Object::createFromHostObject(runtime, std::move(dictHostObject));
};

jsi::Value toListImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  auto thiz =
      thisValue.asObject(runtime).asHostObject<IValueHostObject>(runtime);
  auto list = thiz->value.toList();

  jsi::Array listValue = jsi::Array(runtime, list.size());
  for (size_t i = 0; i < list.size(); i++) {
    at::IValue val = list[i];
    auto valueHostObject = std::make_shared<torchlive::torch::IValueHostObject>(
        runtime, std::move(val));
    auto value = jsi::Object::createFromHostObject(runtime, valueHostObject);
    listValue.setValueAtIndex(runtime, i, value);
  }

  return listValue;
}

jsi::Value toTensorImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  auto thiz =
      thisValue.asObject(runtime).asHostObject<IValueHostObject>(runtime);
  auto tensor = thiz->value.toTensor();
  auto tensorHostObject = std::make_shared<torchlive::torch::TensorHostObject>(
      runtime, std::move(tensor));
  return jsi::Object::createFromHostObject(
      runtime, std::move(tensorHostObject));
}

jsi::Value toTupleImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  auto thiz =
      thisValue.asObject(runtime).asHostObject<IValueHostObject>(runtime);
  auto tuple = thiz->value.toTuple();
  auto elements = tuple->elements();

  jsi::Array tupleValue = jsi::Array(runtime, elements.size());
  for (size_t i = 0; i < elements.size(); i++) {
    at::IValue val = elements[i];
    auto valueHostObject = std::make_shared<torchlive::torch::IValueHostObject>(
        runtime, std::move(val));
    auto value = jsi::Object::createFromHostObject(runtime, valueHostObject);
    tupleValue.setValueAtIndex(runtime, i, value);
  }

  return tupleValue;
}

} // namespace

IValueHostObject::IValueHostObject(jsi::Runtime& runtime, at::IValue v)
    : BaseHostObject(runtime), value(std::move(v)) {
  setPropertyHostFunction(runtime, "toGenericDict", 0, toGenericDictImpl);
  setPropertyHostFunction(runtime, "toList", 0, toListImpl);
  setPropertyHostFunction(runtime, "toTensor", 0, toTensorImpl);
  setPropertyHostFunction(runtime, "toTuple", 0, toTupleImpl);
}

} // namespace torch
} // namespace torchlive
