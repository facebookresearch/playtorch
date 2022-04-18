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
} // namespace

IValueHostObject::IValueHostObject(jsi::Runtime& runtime, at::IValue v)
    : BaseHostObject(runtime), value(std::move(v)) {
  setPropertyHostFunction(runtime, "toGenericDict", 0, toGenericDictImpl);
  setPropertyHostFunction(runtime, "toTensor", 0, toTensorImpl);
}

} // namespace torch
} // namespace torchlive
