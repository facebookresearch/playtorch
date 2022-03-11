/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include <jsi/jsi.h>

#include <ATen/NativeFunctions.h>
#include <torch/csrc/jit/mobile/import.h>
#include <torch/script.h>
#include <string>
#include <vector>

#include "../torch/TensorHostObject.h"
#include "../torch/utils/helpers.h"
#include "NormalizeHostObject.h"
#include "scripted/normalize_scriptmodule.h"

// Namespace alias for torch to avoid namespace conflicts with torchlive::torch
namespace torch_ = torch;

namespace torchlive {
namespace torchvision {
namespace transforms {

using namespace facebook;

// NormalizeHostObject Method Name
static const std::string FORWARD = "forward";

// NormalizeHostObject Property Names
static const std::string MEAN = "mean";
static const std::string STD = "std";

// NormalizeHostObject Properties
static const std::vector<std::string> PROPERTIES = {};

// NormalizeHostObject Methods
const std::vector<std::string> METHODS = {
    FORWARD,
};

static std::vector<double> parseDoubleArray(
    jsi::Runtime& runtime,
    const jsi::Value& shape) {
  return torchlive::utils::helpers::parseJSIArrayData(runtime, shape);
}

static torch_::jit::mobile::Module loadScriptedModule() {
  std::stringstream is;
  is.write((char*)normalize_scriptmodule_ptl, normalize_scriptmodule_ptl_len);
  return torch_::jit::_load_for_mobile(is, torch_::kCPU);
}

NormalizeHostObject::NormalizeHostObject(
    jsi::Runtime& runtime,
    const jsi::Value& mean,
    const jsi::Value& std)
    : forward_(createForward(runtime)),
      module_(loadScriptedModule()),
      mean(parseDoubleArray(runtime, mean)),
      std(parseDoubleArray(runtime, std)) {}

std::vector<jsi::PropNameID> NormalizeHostObject::getPropertyNames(
    jsi::Runtime& rt) {
  std::vector<jsi::PropNameID> result;
  for (std::string property : PROPERTIES) {
    result.push_back(jsi::PropNameID::forUtf8(rt, property));
  }
  for (std::string method : METHODS) {
    result.push_back(jsi::PropNameID::forUtf8(rt, method));
  }
  return result;
}

jsi::Value NormalizeHostObject::get(
    jsi::Runtime& runtime,
    const jsi::PropNameID& propName) {
  auto name = propName.utf8(runtime);

  if (name == FORWARD) {
    return jsi::Value(runtime, forward_);
  }

  return jsi::Value::undefined();
}

jsi::Function NormalizeHostObject::createForward(jsi::Runtime& runtime) {
  auto forwardFunc = [this](
                         jsi::Runtime& runtime,
                         const jsi::Value& thisValue,
                         const jsi::Value* arguments,
                         size_t count) -> jsi::Value {
    auto tensorHostObject =
        torchlive::utils::helpers::parseTensor(runtime, &arguments[0]);
    auto tensor = tensorHostObject->tensor;
    std::vector<torch_::jit::IValue> inputs;
    inputs.push_back(tensor);
    c10::ArrayRef<double> meanArrayRef(this->mean);
    inputs.push_back(meanArrayRef);
    c10::ArrayRef<double> stdArrayRef(this->std);
    inputs.push_back(stdArrayRef);

    auto normalized = module_.forward(inputs).toTensor();
    auto normalizedTensorHostObject =
        std::make_shared<torchlive::torch::TensorHostObject>(
            runtime, normalized);

    return jsi::Object::createFromHostObject(
        runtime, normalizedTensorHostObject);
  };

  return jsi::Function::createFromHostFunction(
      runtime, jsi::PropNameID::forUtf8(runtime, FORWARD), 1, forwardFunc);
}

} // namespace transforms
} // namespace torchvision
} // namespace torchlive
