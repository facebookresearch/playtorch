/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// Suppress deprecated-declarations error to support Clang/C++17
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"
#include <torch/csrc/jit/mobile/module.h>
#pragma clang diagnostic pop

#include <utility>

#include "../../../torchlive.h"
#include "../../IValueHostObject.h"
#include "../../TensorHostObject.h"
#include "../../utils/converter.h"
#include "../../utils/helpers.h"
#include "ModuleHostObject.h"

// Namespace alias for torch to avoid namespace conflicts with torchlive::torch
namespace torch_ = torch;

namespace torchlive {
namespace torch {
namespace jit {
namespace mobile {

using namespace facebook;

namespace {
std::string getSyncMethodPrefix(const std::string& propName) {
  const std::string syncSuffix = "Sync";
  int prefixLength = propName.length() - syncSuffix.length();
  if (prefixLength <= 0) {
    return "";
  }

  if (propName.substr(prefixLength, syncSuffix.length()) != syncSuffix) {
    return "";
  }

  return propName.substr(0, prefixLength);
}

MethodAsyncTask createMethodAsyncTask(
    torch_::jit::mobile::Module& m,
    std::string functionName) {
  return MethodAsyncTask(
      [&, functionName](
          jsi::Runtime& runtime,
          const jsi::Value& thisValue,
          const jsi::Value* arguments,
          size_t count) -> MethodAsyncTask::SetupResultType {
        auto thiz =
            thisValue.asObject(runtime).asHostObject<ModuleHostObject>(runtime);

        auto args = thiz->mobileModule.get_method(functionName)
                        .function()
                        .getSchema()
                        .arguments();

        // Two Cases in terms of number of argument required and argument
        // provided
        // Case 1 (n_required < n_provided) we ignore the extra provided args,
        // respecting Js convention
        // Case 2 (n_required >= n_provided) we process the provided argument
        // and let libtorch check if they are enough, this would handle module
        // with default parameters
        int argCount = std::min(count, args.size() - 1);

        std::vector<torch_::jit::IValue> input = {};
        for (int i = 0; i < argCount; i++) {
          c10::DynamicType& dynType =
              args[i + 1].type()->expectRef<c10::DynamicType>();
          input.push_back(utils::converter::jsiValuetoIValue(
              runtime, arguments[i], dynType));
        }
        return std::make_tuple(thiz->mobileModule, input);
      },

      [&, functionName](MethodAsyncTask::SetupResultType&& setupResult)
          -> torch_::jit::IValue {
        torch_::jit::mobile::Module mobileModule;
        std::vector<torch_::jit::IValue> inputs;
        std::tie(mobileModule, inputs) = setupResult;
        c10::InferenceMode guard;
        return mobileModule.get_method(functionName)(inputs);
      },

      [](jsi::Runtime& runtime,
         torchlive::RuntimeExecutor,
         torch_::jit::IValue&& value) -> jsi::Value {
        return utils::converter::ivalueToJSIValue(runtime, value);
      });
}
} // namespace

ModuleHostObject::ModuleHostObject(
    jsi::Runtime& rt,
    torchlive::RuntimeExecutor rte,
    torch_::jit::mobile::Module m)
    : BaseHostObject(rt),
      mobileModule(std::move(m)),
      runtimeExecutor(std::move(rte)) {
  methodAsyncTasks.emplace(
      "forward", createMethodAsyncTask(mobileModule, "forward"));
  setPropertyHostFunction(
      rt, "forward", 1, methodAsyncTasks.at("forward").asyncPromiseFunc(rte));
  setPropertyHostFunction(
      rt, "forwardSync", 1, methodAsyncTasks.at("forward").syncFunc(rte));
}
jsi::Value ModuleHostObject::get(
    jsi::Runtime& runtime,
    const jsi::PropNameID& name) {
  const auto& propName = name.utf8(runtime);
  const auto& syncPrefix = getSyncMethodPrefix(propName);
  auto member = BaseHostObject::get(runtime, name);
  if (!member.isUndefined()) {
    return member;
  } else if (mobileModule.find_method(propName) != c10::nullopt) {
    methodAsyncTasks.emplace(
        propName, createMethodAsyncTask(mobileModule, propName));
    return jsi::Function::createFromHostFunction(
        runtime,
        name,
        1,
        methodAsyncTasks.at(propName).asyncPromiseFunc(runtimeExecutor));
  } else if (
      // if method with name "*Sync" is looked for, return the "sync version"
      // of the module method, where * can't be empty.
      !syncPrefix.empty() &&
      mobileModule.find_method(syncPrefix) != c10::nullopt) {
    methodAsyncTasks.emplace(
        syncPrefix, createMethodAsyncTask(mobileModule, syncPrefix));
    return jsi::Function::createFromHostFunction(
        runtime,
        name,
        1,
        methodAsyncTasks.at(syncPrefix).syncFunc(runtimeExecutor));
  } else {
    return member;
  }
}

} // namespace mobile
} // namespace jit
} // namespace torch
} // namespace torchlive
