/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include <jsi/jsi.h>

#include <torch/csrc/jit/mobile/import.h>
#include <torch/csrc/jit/mobile/module.h>
#include <torch/script.h>

#include "../../Promise.h"
#include "../../ThreadPool.h"
#include "../TensorHostObject.h"
#include "JITHostObject.h"
#include "mobile/ModuleHostObject.h"

// Namespace alias for torch to avoid namespace conflicts with torchlive::torch
namespace torch_ = torch;

namespace torchlive {
namespace torch {
namespace jit {

using namespace facebook;

// JITHostObject Method Name
static const std::string _LOAD_FOR_MOBILE = "_loadForMobile";

// JITHostObject Methods
const std::vector<std::string> METHODS = {_LOAD_FOR_MOBILE};

// JITHostObject Property Names
// empty

// JITHostObject Properties
static const std::vector<std::string> PROPERTIES = {};

JITHostObject::JITHostObject(
    jsi::Runtime& runtime,
    torchlive::RuntimeExecutor runtimeExecutor)
    : _loadForMobile_(create_LoadForMobile(runtime, runtimeExecutor)) {}

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

std::string JITHostObject::_loadForMobilePreWork(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  if (count < 1) {
    throw jsi::JSError(runtime, "At least 1 arg is expected");
  }

  if (!arguments[0].isString()) {
    throw jsi::JSError(runtime, "Argument must be a string");
  }

  std::string modelPath = arguments[0].asString(runtime).utf8(runtime);
  return modelPath;
}

torch_::jit::mobile::Module JITHostObject::_loadForMobileWork(
    const std::string& modelPath) {
  return torch_::jit::_load_for_mobile(modelPath, torch_::kCPU);
}

jsi::Value JITHostObject::_loadForMobilePostWork(
    jsi::Runtime& runtime,
    torchlive::RuntimeExecutor runtimeExecutor,
    torch_::jit::mobile::Module m) {
  auto moduleHostObject =
      std::make_shared<torchlive::torch::jit::mobile::ModuleHostObject>(
          runtime, runtimeExecutor, m);
  return jsi::Object::createFromHostObject(runtime, moduleHostObject);
}

jsi::Function JITHostObject::create_LoadForMobile(
    jsi::Runtime& runtime,
    torchlive::RuntimeExecutor runtimeExecutor) {
  auto loadForMobileFunc = [runtimeExecutor](
                               jsi::Runtime& rt,
                               const jsi::Value& thisValue,
                               const jsi::Value* arguments,
                               size_t count) -> jsi::Value {
    return createPromiseAsJSIValue(
        rt, [&](jsi::Runtime& rt2, std::shared_ptr<Promise> promise) {
          auto inputs = _loadForMobilePreWork(rt2, thisValue, arguments, count);
          auto fn = [runtimeExecutor,
                     inputs = std::move(inputs),
                     promise = std::move(promise)]() {
            auto outputs = _loadForMobileWork(std::move(inputs));
            runtimeExecutor([runtimeExecutor,
                             outputs = std::move(outputs),
                             promise = std::move(promise)](jsi::Runtime& rt3) {
              auto result = _loadForMobilePostWork(
                  rt3, runtimeExecutor, std::move(outputs));
              promise->resolve(result);
            });
          };
          torchlive::ThreadPool::pool()->run(fn);
        });
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
