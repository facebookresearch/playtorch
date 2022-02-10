/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include <jsi/jsi.h>

#include "../TensorHostObject.h"
#include "JITHostObject.h"
#include "mobile/ModuleHostObject.h"

#include <torch/csrc/jit/mobile/import.h>
#include <torch/csrc/jit/mobile/module.h>
#include <torch/script.h>
#include <string>

// Namespace alias for torch to avoid namespace conflicts with torchlive::torch
namespace torch_ = torch;

namespace torchlive {
namespace torch {
namespace jit {

using namespace facebook;

// JITHostObject Method Name
static const std::string _LOAD_FOR_MOBILE = "_load_for_mobile";

// JITHostObject Methods
const std::vector<std::string> METHODS = {_LOAD_FOR_MOBILE};

// JITHostObject Property Names
// empty

// JITHostObject Properties
static const std::vector<std::string> PROPERTIES = {};

JITHostObject::JITHostObject(jsi::Runtime& runtime)
    : _loadForMobile_(create_LoadForMobile(runtime)) {}

std::vector<jsi::PropNameID> JITHostObject::getPropertyNames(jsi::Runtime& rt) {
  std::vector<jsi::PropNameID> result;
  for (std::string property : PROPERTIES) {
    result.push_back(jsi::PropNameID::forUtf8(rt, property));
  }
  for (std::string method : METHODS) {
    result.push_back(jsi::PropNameID::forUtf8(rt, method));
  }
  return result;
}

jsi::Value JITHostObject::get(
    jsi::Runtime& runtime,
    const jsi::PropNameID& propName) {
  auto name = propName.utf8(runtime);

  if (name == _LOAD_FOR_MOBILE) {
    return jsi::Value(runtime, _loadForMobile_);
  }

  return jsi::Value::undefined();
}

jsi::Function JITHostObject::create_LoadForMobile(jsi::Runtime& runtime) {
  auto loadForMobileFunc = [](jsi::Runtime& runtime,
                              const jsi::Value& thisValue,
                              const jsi::Value* arguments,
                              size_t count) -> jsi::Value {
    if (count < 1) {
      throw jsi::JSError(runtime, "At least 1 arg is expected");
    }

    if (!arguments[0].isString()) {
      throw jsi::JSError(runtime, "Argument must be a string");
    }

    std::string modelPath = arguments[0].asString(runtime).utf8(runtime);

    auto module_ =
        torch_::jit::_load_for_mobile(std::move(modelPath), torch_::kCPU);

    auto moduleHostObject =
        std::make_shared<torchlive::torch::jit::mobile::ModuleHostObject>(
            runtime, module_);
    return jsi::Object::createFromHostObject(runtime, moduleHostObject);
  };
  return jsi::Function::createFromHostFunction(
      runtime,
      jsi::PropNameID::forUtf8(runtime, _LOAD_FOR_MOBILE),
      1,
      loadForMobileFunc);
}

} // namespace jit
} // namespace torch
} // namespace torchlive
