/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include <jsi/jsi.h>

// Suppress deprecated-declarations error to support Clang/C++17
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"
#include <torch/csrc/jit/mobile/import.h>
#include <torch/csrc/jit/mobile/module.h>
#include <torch/script.h>
#pragma clang diagnostic pop

#include "../../common/AsyncTask.h"
#include "../../torch/utils/ArgumentParser.h"
#include "../../torch/utils/helpers.h"
#include "JITNamespace.h"
#include "mobile/ModuleHostObject.h"

// Namespace alias for torch to avoid namespace conflicts with torchlive::torch
namespace torch_ = torch;

namespace torchlive {
namespace torch {
namespace jit {

using namespace facebook;

namespace {

using ExtraFilesMap = std::unordered_map<std::string, std::string>;

using _LoadForMobileAsyncTask = common::AsyncTask<
    std::tuple<
        std::string,
        c10::optional<at::Device>,
        ExtraFilesMap,
        std::shared_ptr<jsi::Value>>,
    std::tuple<
        torch_::jit::mobile::Module,
        ExtraFilesMap,
        std::shared_ptr<jsi::Value>>>;

_LoadForMobileAsyncTask _loadForMobileImpl(
    [](jsi::Runtime& runtime,
       const jsi::Value& thisValue,
       const jsi::Value* arguments,
       size_t count) -> _LoadForMobileAsyncTask::SetupResultType {
      utils::ArgumentParser args(runtime, thisValue, arguments, count);
      args.requireNumArguments(1);

      std::string filename = args[0].asString(runtime).utf8(runtime);

      c10::optional<at::Device> device = c10::nullopt;
      if (count > 1) {
        auto deviceType = args[1].asString(runtime).utf8(runtime);
        if (deviceType == "cpu") {
          device = torch_::kCPU;
        } else {
          throw facebook::jsi::JSError(
              runtime, "only 'cpu' device is currently supported");
        }
      }

      std::unordered_map<std::string, std::string> extraFiles;
      std::shared_ptr<jsi::Value> extraFilesObject = nullptr;
      if (count > 2) {
        jsi::Object obj = args[2].asObject(runtime);
        auto arr = obj.getPropertyNames(runtime);
        for (size_t i = 0; i < arr.length(runtime); i++) {
          auto propName =
              arr.getValueAtIndex(runtime, i).asString(runtime).utf8(runtime);
          extraFiles[propName] = "";
        }
        // Move jsi::Object to pass it through to the result worker function
        // to update its values with the extra files values after loading the
        // model.
        extraFilesObject = std::make_shared<jsi::Value>(std::move(obj));
      }

      return std::make_tuple(
          filename, device, std::move(extraFiles), std::move(extraFilesObject));
    },

    [](_LoadForMobileAsyncTask::SetupResultType&& setupResult) {
      std::string filename;
      c10::optional<at::Device> device;
      ExtraFilesMap extraFiles;
      // The extraFilesObject will just be piped through to the result worker.
      std::shared_ptr<jsi::Value> extraFilesObject;
      std::tie(filename, device, extraFiles, extraFilesObject) = setupResult;
      auto model = torch_::jit::_load_for_mobile(filename, device, extraFiles);
      return std::make_tuple(
          model, std::move(extraFiles), std::move(extraFilesObject));
    },

    [](jsi::Runtime& runtime,
       torchlive::RuntimeExecutor runtimeExecutor,
       _LoadForMobileAsyncTask::WorkResultType&& workResult) {
      torch_::jit::mobile::Module m;
      ExtraFilesMap extraFiles;
      std::shared_ptr<jsi::Value> extraFilesObject;
      std::tie(m, extraFiles, extraFilesObject) = std::move(workResult);

      // Update the extra files object passed in as third argument with the
      // extra files values retrieved on _load_for_mobile in the worker thread.
      // Note, this will only run if a JavaScript object was used as third
      // argument and if the model included any extra files for the given keys.
      if (extraFilesObject != nullptr && extraFilesObject->isObject() &&
          extraFiles.size() > 0) {
        auto obj = extraFilesObject->asObject(runtime);
        for (auto it : extraFiles) {
          auto key = jsi::PropNameID::forUtf8(runtime, it.first);
          auto value = jsi::String::createFromUtf8(runtime, it.second);
          obj.setProperty(runtime, key, value);
        }
      }

      auto moduleHostObject =
          std::make_shared<torchlive::torch::jit::mobile::ModuleHostObject>(
              runtime, runtimeExecutor, std::move(m));

      return jsi::Object::createFromHostObject(
          runtime, std::move(moduleHostObject));
    });

} // namespace

jsi::Object buildNamespace(jsi::Runtime& rt, torchlive::RuntimeExecutor rte) {
  using utils::helpers::setPropertyHostFunction;

  jsi::Object ns(rt);
  setPropertyHostFunction(
      rt, ns, "_loadForMobile", 1, _loadForMobileImpl.asyncPromiseFunc(rte));
  setPropertyHostFunction(
      rt, ns, "_loadForMobileSync", 1, _loadForMobileImpl.syncFunc(rte));
  return ns;
}

} // namespace jit
} // namespace torch
} // namespace torchlive
