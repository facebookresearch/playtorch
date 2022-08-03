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
#include "ATen/Functions.h"
#include "ATen/core/TensorBody.h"
#include "TensorHostObject.h"
#include "TorchHostObject.h"
#include "jit/JITNamespace.h"
#include "utils/ArgumentParser.h"
#include "utils/constants.h"
#include "utils/helpers.h"

// Namespace alias for torch to avoid namespace conflicts with torchlive::torch
namespace torch_ = torch;

namespace torchlive {
namespace torch {

using namespace facebook;

// TorchHostObject Method Name
static const std::string RANDINT = "randint";
static const std::string TENSOR = "tensor";
static const std::string ZEROS = "zeros";

// TorchHostObject Property Names
static const std::string JIT = "jit";

// TorchHostObject Properties
static const std::vector<std::string> PROPERTIES = {
    utils::constants::FLOAT32,
    utils::constants::FLOAT64,
    utils::constants::INT16,
    utils::constants::INT32,
    utils::constants::INT64,
    utils::constants::INT8,
    utils::constants::UINT8,
    utils::constants::CHANNELS_LAST,
    utils::constants::CONTIGUOUS_FORMAT,
    utils::constants::PRESERVE_FORMAT,
    JIT,
};

// TorchHostObject Methods
const std::vector<std::string> METHODS = {
    RANDINT,
    TENSOR,
    ZEROS,
};

namespace {
/**
 * Creates a 1-D tensor of size `(end - start) / step` with values from the
 * interval `[start, end)` taken with common difference `step` beginning from
 * `start`.
 *
 * See https://pytorch.org/docs/stable/generated/torch.arange.html
 */
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

/**
 * Returns a tensor filled with uninitialized data. The shape of the tensor
 * is defined by the variable argument size.
 *
 * See https://pytorch.org/docs/stable/generated/torch.empty.html
 */
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

/**
 * Returns an eye tensor with the given dimensions:
 *   * eye(n, m) if two integer arguments n, m given,
 *   * eye(n, n) if one integer argument n given
 *
 * See https://pytorch.org/docs/stable/generated/torch.eye.html
 */
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
  auto size = blob->getDirectSize();
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

/**
 * Creates a tensor of size `size` filled with `fill_value`. The tensor’s dtype
 * is inferred from `fill_value`.
 *
 * See https://pytorch.org/docs/stable/generated/torch.full.html
 */
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

/**
 * Creates a one-dimensional tensor of size steps whose values are evenly spaced
 * from base^start to base^end, inclusive, on a logarithmic scale.
 *
 * See
 * https://pytorch.org/docs/stable/generated/torch.logspace.html#torch.logspace
 */
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

/**
 * Returns a tensor filled with the scalar value 1,
 * with the shape defined by the variable argument size.
 *
 * See: https://pytorch.org/docs/stable/generated/torch.ones.html
 */
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

/**
 * Returns a tensor filled with random numbers from a normal distribution with
 * mean 0 and variance 1 (also called the standard normal distribution).
 *
 * See https://pytorch.org/docs/stable/generated/torch.randn.html#torch.randn
 */
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
} // namespace

TorchHostObject::TorchHostObject(
    jsi::Runtime& runtime,
    torchlive::RuntimeExecutor runtimeExecutor)
    : BaseHostObject(runtime),
      randint_(createRandint(runtime)),
      tensor_(createTensor(runtime)),
      zeros_(createZeros(runtime)),
      runtimeExecutor_(runtimeExecutor),
      methods{
          {RANDINT, &randint_},
          {TENSOR, &tensor_},
          {ZEROS, &zeros_},
      },
      properties{
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
          {utils::constants::CONTIGUOUS_FORMAT,
           utils::constants::CONTIGUOUS_FORMAT},
          {utils::constants::PRESERVE_FORMAT,
           utils::constants::PRESERVE_FORMAT},
      },
      jit_(torchlive::torch::jit::buildNamespace(runtime, runtimeExecutor)) {
  setPropertyHostFunction(runtime, "arange", 1, arangeImpl);
  setPropertyHostFunction(runtime, "cat", 2, catImpl);
  setPropertyHostFunction(runtime, "empty", 1, emptyImpl);
  setPropertyHostFunction(runtime, "eye", 1, eyeImpl);
  setPropertyHostFunction(runtime, "fromBlob", 2, fromBlobImpl);
  setPropertyHostFunction(runtime, "full", 2, fullImpl);
  setPropertyHostFunction(runtime, "linspace", 3, linspaceImpl);
  setPropertyHostFunction(runtime, "logspace", 3, logspaceImpl);
  setPropertyHostFunction(runtime, "ones", 1, onesImpl);
  setPropertyHostFunction(runtime, "rand", 1, randImpl);
  setPropertyHostFunction(runtime, "randn", 2, randnImpl);
  setPropertyHostFunction(runtime, "randperm", 2, randpermImpl);
}

std::vector<jsi::PropNameID> TorchHostObject::getPropertyNames(
    jsi::Runtime& rt) {
  auto result = BaseHostObject::getPropertyNames(rt);
  for (std::string property : PROPERTIES) {
    result.push_back(jsi::PropNameID::forUtf8(rt, property));
  }

  for (std::string method : METHODS) {
    result.push_back(jsi::PropNameID::forUtf8(rt, method));
  }
  return result;
}

jsi::Value TorchHostObject::get(
    jsi::Runtime& runtime,
    const jsi::PropNameID& propName) {
  auto name = propName.utf8(runtime);

  auto method = methods.find(name);
  if (method != methods.end()) {
    return jsi::Value(runtime, *(method->second));
  }

  auto property = properties.find(name);
  if (property != properties.end()) {
    return jsi::String::createFromAscii(runtime, property->second);
  }

  if (name == JIT) {
    return jsi::Value(runtime, jit_);
  }

  return BaseHostObject::get(runtime, propName);
};

jsi::Function TorchHostObject::createRandint(jsi::Runtime& runtime) {
  auto randintImpl = [](jsi::Runtime& runtime,
                        const jsi::Value& thisValue,
                        const jsi::Value* arguments,
                        size_t count) {
    if (count < 2) {
      throw jsi::JSError(
          runtime, "This function requires at least 2 arguments");
    }

    auto low = 0;
    auto high = 0;
    jsi::Array size = jsi::Array::createWithElements(runtime, {});
    torch_::TensorOptions tensorOptions = torch_::TensorOptions();
    if (count == 2) {
      high = arguments[0].asNumber();
      size = arguments[1].asObject(runtime).asArray(runtime);
    } else if (arguments[1].isObject()) {
      high = arguments[0].asNumber();
      size = arguments[1].asObject(runtime).asArray(runtime);
      tensorOptions =
          utils::helpers::parseTensorOptions(runtime, arguments, 2, count);
    } else {
      low = arguments[0].asNumber();
      high = arguments[1].asNumber();
      size = arguments[2].asObject(runtime).asArray(runtime);
      tensorOptions =
          utils::helpers::parseTensorOptions(runtime, arguments, 3, count);
    }

    auto shapeLength = size.size(runtime);
    std::vector<int64_t> dims = {};
    for (int i = 0; i < shapeLength; i++) {
      int x = size.getValueAtIndex(runtime, i).asNumber();
      dims.push_back(x);
    }
    auto tensor = torch_::randint(low, high, dims, tensorOptions);

    auto tensorHostObject =
        std::make_shared<torchlive::torch::TensorHostObject>(runtime, tensor);
    return jsi::Object::createFromHostObject(runtime, tensorHostObject);
  };
  return jsi::Function::createFromHostFunction(
      runtime, jsi::PropNameID::forUtf8(runtime, RANDINT), 1, randintImpl);
}

jsi::Function TorchHostObject::createTensor(jsi::Runtime& runtime) {
  auto tensorImpl = [](jsi::Runtime& runtime,
                       const jsi::Value& thisValue,
                       const jsi::Value* arguments,
                       size_t count) {
    if (count == 0) {
      throw jsi::JSError(
          runtime, "This function requires at least one argument.");
    }
    std::vector<double> data =
        utils::helpers::parseJSIArrayData(runtime, arguments[0]);
    std::vector<int64_t> shape =
        utils::helpers::parseJSIArrayShape(runtime, arguments[0]);
    auto tensorOptions =
        utils::helpers::parseTensorOptions(runtime, arguments, 1, count);
    auto tensor =
        torch_::tensor(data, tensorOptions).reshape(at::IntArrayRef(shape));
    auto tensorHostObject =
        std::make_shared<torchlive::torch::TensorHostObject>(runtime, tensor);
    return jsi::Object::createFromHostObject(runtime, tensorHostObject);
  };
  return jsi::Function::createFromHostFunction(
      runtime, jsi::PropNameID::forUtf8(runtime, TENSOR), 1, tensorImpl);
}

/**
 * Returns a tensor filled with the scalar value 0, with the shape defined by
 * the variable argument size.
 */
jsi::Function TorchHostObject::createZeros(jsi::Runtime& runtime) {
  auto zerosImpl = [](jsi::Runtime& runtime,
                      const jsi::Value& thisValue,
                      const jsi::Value* arguments,
                      size_t count) {
    if (count == 0) {
      throw jsi::JSError(
          runtime, "This function requires at least one argument.");
    }
    std::vector<int64_t> dims = {};
    int nextArgumentIndex =
        utils::helpers::parseSize(runtime, arguments, 0, count, &dims);

    torch_::TensorOptions tensorOptions = utils::helpers::parseTensorOptions(
        runtime, arguments, nextArgumentIndex, count);

    auto tensor = torch_::zeros(c10::ArrayRef<int64_t>(dims), tensorOptions);

    auto tensorHostObject =
        std::make_shared<torchlive::torch::TensorHostObject>(runtime, tensor);

    return jsi::Object::createFromHostObject(runtime, tensorHostObject);
  };

  return jsi::Function::createFromHostFunction(
      runtime, jsi::PropNameID::forUtf8(runtime, ZEROS), 1, zerosImpl);
}

} // namespace torch
} // namespace torchlive
