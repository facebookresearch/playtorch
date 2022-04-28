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

using _LoadForMobileAsyncTask =
    common::AsyncTask<std::string, torch_::jit::mobile::Module>;

_LoadForMobileAsyncTask _loadForMobileImpl(
    [](jsi::Runtime& runtime,
       const jsi::Value& thisValue,
       const jsi::Value* arguments,
       size_t count) -> std::string {
      utils::ArgumentParser args(runtime, thisValue, arguments, count);
      std::string modelPath = args[0].asString(runtime).utf8(runtime);
      return modelPath;
    },

    [](const std::string& modelPath) {
      return torch_::jit::_load_for_mobile(modelPath, torch_::kCPU);
    },

    [](jsi::Runtime& runtime,
       torchlive::RuntimeExecutor runtimeExecutor,
       torch_::jit::mobile::Module&& m) {
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
  return ns;
}

} // namespace jit
} // namespace torch
} // namespace torchlive
