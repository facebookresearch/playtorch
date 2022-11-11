/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include <jsi/jsi.h>

#include <memory>
#include <vector>

#include "../media/BlobHostObject.h"
#include "../torchlive.h"
#include "TensorHostObject.h"
#include "TorchNamespace.h"
#include "jit/JITNamespace.h"
#include "jsi/jsi.h"
#include "utils/ArgumentParser.h"
#include "utils/constants.h"
#include "utils/helpers.h"

// Namespace alias for torch to avoid namespace conflicts with torchlive::torch
namespace torch_ = torch;

namespace torchlive {
namespace torch {

using namespace facebook;

// TorchHostObject Property Names
static const std::string JIT = "jit";

// TorchHostObject Constant Properties
static const std::map<std::string, std::string> CONSTANTS = {
    {utils::constants::FLOAT32, utils::constants::FLOAT32},
    {utils::constants::FLOAT, utils::constants::FLOAT32},
    {utils::constants::FLOAT64, utils::constants::FLOAT64},
    {utils::constants::DOUBLE, utils::constants::FLOAT64},
    {utils::constants::INT8, utils::constants::INT8},
    {utils::constants::INT16, utils::constants::INT16},
    {utils::constants::SHORT, utils::constants::INT16},
    {utils::constants::INT32, utils::constants::INT32},
    {utils::constants::INT, utils::constants::INT32},
    {utils::constants::INT64, utils::constants::INT64},
    {utils::constants::LONG, utils::constants::INT64},
    {utils::constants::UINT8, utils::constants::UINT8},
    {utils::constants::CHANNELS_LAST, utils::constants::CHANNELS_LAST},
    {utils::constants::CONTIGUOUS_FORMAT, utils::constants::CONTIGUOUS_FORMAT},
    {utils::constants::PRESERVE_FORMAT, utils::constants::PRESERVE_FORMAT},
};

namespace {

jsi::Value arangeImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  auto args = utils::ArgumentParser(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);

  torch_::TensorOptions tensorOptions;
  auto positionalArgCount = count;
  if (arguments[count - 1].isObject()) {
    positionalArgCount--;
    tensorOptions = utils::helpers::parseTensorOptions(
        runtime, arguments, count - 1, count);
  }
  auto end = (positionalArgCount > 1) ? arguments[1].asNumber()
                                      : arguments[0].asNumber();
  auto start = (positionalArgCount > 1) ? arguments[0].asNumber() : 0;
  auto step = (positionalArgCount > 2) ? arguments[2].asNumber() : 1;

  return utils::helpers::createFromHostObject<TensorHostObject>(
      runtime, torch_::arange(start, end, step, tensorOptions));
}

jsi::Value catImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  auto args = utils::ArgumentParser(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto jsArray = arguments[0].asObject(runtime).asArray(runtime);
  std::vector<torch_::Tensor> tensors;
  auto size = jsArray.size(runtime);
  for (int i = 0; i < size; i++) {
    const auto val = jsArray.getValueAtIndex(runtime, i);
    tensors.emplace_back(utils::helpers::parseTensor(runtime, &val)->tensor);
  }
  auto dimValue = args.keywordValue(1, "dim");
  int dim = dimValue.isUndefined() ? 0 : dimValue.asNumber();

  return utils::helpers::createFromHostObject<TensorHostObject>(
      runtime, torch_::cat(tensors, dim));
}

jsi::Value emptyImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  auto args = utils::ArgumentParser(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);

  std::vector<int64_t> dims = {};
  int nextArgumentIndex =
      utils::helpers::parseSize(runtime, arguments, 0, count, &dims);

  auto tensorOptions = utils::helpers::parseTensorOptions(
      runtime, arguments, nextArgumentIndex, count);

  return utils::helpers::createFromHostObject<TensorHostObject>(
      runtime, torch_::empty(c10::ArrayRef<int64_t>(dims), tensorOptions));
}

jsi::Value eyeImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  auto args = utils::ArgumentParser(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);

  const auto rows = arguments[0].asNumber();
  auto columns = rows;
  torch_::TensorOptions tensorOptions;
  if (count > 1 && arguments[1].isNumber()) {
    columns = arguments[1].asNumber();
    if (std::trunc(rows) != rows) {
      throw jsi::JSError(
          runtime,
          "torch.eye requires the first argument to be a positive integer");
    }
    if (std::trunc(columns) != columns) {
      throw jsi::JSError(
          runtime,
          "torch.eye requires the second argument to be a positive integer");
    }
    tensorOptions =
        utils::helpers::parseTensorOptions(runtime, arguments, 2, count);
  } else {
    tensorOptions =
        utils::helpers::parseTensorOptions(runtime, arguments, 1, count);
  }
  return utils::helpers::createFromHostObject<TensorHostObject>(
      runtime, torch_::eye(rows, columns, tensorOptions));
}

jsi::Value fromBlobImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  auto args = utils::ArgumentParser(runtime, thisValue, arguments, count);
  args.requireNumArguments(2);

  // We are not using utils::helpers::parseSize here because the
  // torch::from_blob is only available in C++ and doesn't support sizes as
  // variadics.
  jsi::Array jsSizes = arguments[1].asObject(runtime).asArray(runtime);
  auto sizesLength = jsSizes.size(runtime);
  std::vector<int64_t> sizes;
  sizes.reserve(sizesLength);
  for (int i = 0; i < sizesLength; i++) {
    auto value = jsSizes.getValueAtIndex(runtime, i);
    sizes.push_back(value.asNumber());
  }

  const auto& blobHostObject =
      args.asHostObject<torchlive::media::BlobHostObject>(0);
  auto tensorOptions =
      utils::helpers::parseTensorOptions(runtime, arguments, 2, count);
  auto blob = blobHostObject->blob.get();
  uint8_t* const buffer = blob->getDirectBytes();
  if (!tensorOptions.has_dtype()) {
    // explicitly set to default uint8 dtype
    tensorOptions = torch_::TensorOptions().dtype(torch_::kUInt8);
  }
  // TODO(T111718110) Check if blob sizes exceed buffer size and if so throw
  // an error
  auto tensor = torch_::from_blob(buffer, sizes, tensorOptions).clone();
  return utils::helpers::createFromHostObject<TensorHostObject>(
      runtime, std::move(tensor));
}

jsi::Value fullImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  auto args = utils::ArgumentParser(runtime, thisValue, arguments, count);
  args.requireNumArguments(2);

  std::vector<int64_t> dims = {};
  auto jsShape = arguments[0].asObject(runtime).asArray(runtime);
  auto shapeLength = jsShape.size(runtime);
  for (int i = 0; i < shapeLength; i++) {
    int x = jsShape.getValueAtIndex(runtime, i).asNumber();
    dims.push_back(x);
  }

  const auto fillValue = arguments[1].asNumber();

  const auto options =
      utils::helpers::parseTensorOptions(runtime, arguments, 2, count);

  return utils::helpers::createFromHostObject<TensorHostObject>(
      runtime, torch_::full(dims, fillValue, options));
}

jsi::Value linspaceImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  auto args = utils::ArgumentParser(runtime, thisValue, arguments, count);
  args.requireNumArguments(3);

  auto tensorOptions = torch_::TensorOptions();
  if (arguments[count - 1].isObject()) {
    tensorOptions = utils::helpers::parseTensorOptions(
        runtime, arguments, count - 1, count);
  }
  auto start = args.asInteger(0);
  auto end = args.asInteger(1);
  auto steps = args.asInteger(2);

  return utils::helpers::createFromHostObject<TensorHostObject>(
      runtime, torch_::linspace(start, end, steps, tensorOptions));
}

jsi::Value logspaceImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  auto args = utils::ArgumentParser(runtime, thisValue, arguments, count);
  args.requireNumArguments(3);
  auto start = args.asInteger(0);
  auto end = args.asInteger(1);
  auto steps = args.asInteger(2);
  auto baseValue = utils::helpers::parseKeywordArgument(
      runtime, arguments, 3, count, "base");
  double base = baseValue.isUndefined() ? 10.0 : baseValue.asNumber();
  torch_::TensorOptions options;
  if (!utils::helpers::parseKeywordArgument(
           runtime, arguments, 3, count, "dtype")
           .isUndefined()) {
    options = utils::helpers::parseTensorOptions(runtime, arguments, 3, count);
  }

  return utils::helpers::createFromHostObject<TensorHostObject>(
      runtime, torch_::logspace(start, end, steps, base, options));
}

jsi::Value onesImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  auto args = utils::ArgumentParser(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);

  std::vector<int64_t> dims = {};
  int nextArgumentIndex =
      utils::helpers::parseSize(runtime, arguments, 0, count, &dims);

  auto tensorOptions = utils::helpers::parseTensorOptions(
      runtime, arguments, nextArgumentIndex, count);

  return utils::helpers::createFromHostObject<TensorHostObject>(
      runtime, torch_::ones(c10::ArrayRef<int64_t>(dims), tensorOptions));
}

jsi::Value randImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  auto args = utils::ArgumentParser(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);

  std::vector<int64_t> dims = {};
  int nextArgumentIndex =
      utils::helpers::parseSize(runtime, arguments, 0, count, &dims);

  auto tensorOptions = utils::helpers::parseTensorOptions(
      runtime, arguments, nextArgumentIndex, count);

  return utils::helpers::createFromHostObject<TensorHostObject>(
      runtime, torch_::rand(c10::ArrayRef<int64_t>(dims), tensorOptions));
}

jsi::Value randintImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  auto args = utils::ArgumentParser(runtime, thisValue, arguments, count);
  args.requireNumArguments(2);

  auto low = 0;
  auto high = 0;
  std::vector<int64_t> dims = {};
  int nextArgumentIndex;
  if (arguments[1].isObject()) {
    high = arguments[0].asNumber();
    nextArgumentIndex =
        utils::helpers::parseSize(runtime, arguments, 1, count, &dims);
  } else {
    args.requireNumArguments(3);
    low = arguments[0].asNumber();
    high = arguments[1].asNumber();
    nextArgumentIndex =
        utils::helpers::parseSize(runtime, arguments, 2, count, &dims);
  }

  auto tensorOptions = utils::helpers::parseTensorOptions(
      runtime, arguments, nextArgumentIndex, count);

  return utils::helpers::createFromHostObject<TensorHostObject>(
      runtime, torch_::randint(low, high, dims, tensorOptions));
}

jsi::Value randpermImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  auto args = utils::ArgumentParser(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);

  auto upperBound = arguments[0].asNumber();

  const auto options =
      utils::helpers::parseTensorOptions(runtime, arguments, 1, count);

  return utils::helpers::createFromHostObject<TensorHostObject>(
      runtime, torch_::randperm(upperBound, options));
}

jsi::Value randnImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  auto args = utils::ArgumentParser(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);

  std::vector<int64_t> dims = {};
  auto jsShape = arguments[0].asObject(runtime).asArray(runtime);
  auto shapeLength = jsShape.size(runtime);
  for (int i = 0; i < shapeLength; i++) {
    int x = jsShape.getValueAtIndex(runtime, i).asNumber();
    dims.push_back(x);
  }

  const auto options =
      utils::helpers::parseTensorOptions(runtime, arguments, 1, count);

  return utils::helpers::createFromHostObject<TensorHostObject>(
      runtime, torch_::randn(dims, options));
}

jsi::Value tensorImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  auto args = utils::ArgumentParser(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);

  std::vector<double> data =
      utils::helpers::parseJSIArrayData(runtime, arguments[0]);
  std::vector<int64_t> shape =
      utils::helpers::parseJSIArrayShape(runtime, arguments[0]);
  auto tensorOptions =
      utils::helpers::parseTensorOptions(runtime, arguments, 1, count);

  return utils::helpers::createFromHostObject<TensorHostObject>(
      runtime,
      torch_::tensor(std::move(data), tensorOptions)
          .reshape(at::IntArrayRef(std::move(shape))));
}

jsi::Value zerosImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  auto args = utils::ArgumentParser(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);

  std::vector<int64_t> dims = {};
  int nextArgumentIndex =
      utils::helpers::parseSize(runtime, arguments, 0, count, &dims);

  auto tensorOptions = utils::helpers::parseTensorOptions(
      runtime, arguments, nextArgumentIndex, count);

  return utils::helpers::createFromHostObject<TensorHostObject>(
      runtime, torch_::zeros(c10::ArrayRef<int64_t>(dims), tensorOptions));
}
} // namespace

jsi::Object buildNamespace(jsi::Runtime& rt, RuntimeExecutor rte) {
  using utils::helpers::setPropertyHostFunction;

  jsi::Object ns(rt);

  // Properties
  for (auto& constant : CONSTANTS) {
    ns.setProperty(
        rt, jsi::PropNameID::forUtf8(rt, constant.first), constant.second);
  }

  auto jit = torchlive::torch::jit::buildNamespace(rt, rte);
  ns.setProperty(rt, jsi::PropNameID::forUtf8(rt, JIT), jit);

  // Functions
  setPropertyHostFunction(rt, ns, "arange", 1, arangeImpl);
  setPropertyHostFunction(rt, ns, "cat", 1, catImpl);
  setPropertyHostFunction(rt, ns, "empty", 1, emptyImpl);
  setPropertyHostFunction(rt, ns, "eye", 1, eyeImpl);
  setPropertyHostFunction(rt, ns, "fromBlob", 2, fromBlobImpl);
  setPropertyHostFunction(rt, ns, "full", 2, fullImpl);
  setPropertyHostFunction(rt, ns, "linspace", 3, linspaceImpl);
  setPropertyHostFunction(rt, ns, "logspace", 3, logspaceImpl);
  setPropertyHostFunction(rt, ns, "ones", 1, onesImpl);
  setPropertyHostFunction(rt, ns, "rand", 1, randImpl);
  setPropertyHostFunction(rt, ns, "randint", 2, randintImpl);
  setPropertyHostFunction(rt, ns, "randn", 1, randnImpl);
  setPropertyHostFunction(rt, ns, "randperm", 1, randpermImpl);
  setPropertyHostFunction(rt, ns, "tensor", 1, tensorImpl);
  setPropertyHostFunction(rt, ns, "zeros", 1, zerosImpl);
  return ns;
}

} // namespace torch
} // namespace torchlive
