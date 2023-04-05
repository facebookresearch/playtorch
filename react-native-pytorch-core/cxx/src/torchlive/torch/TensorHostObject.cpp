/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include <c10/core/MemoryFormat.h>
#include <c10/util/Optional.h>

#include "TensorHostObject.h"
#include "TensorHostObjectDeprecated.h"
#include "utils/ArgumentParser.h"
#include "utils/constants.h"
#include "utils/helpers.h"

// Namespace alias for torch to avoid namespace conflicts with torchlive::torch
namespace torch_ = torch;

namespace torchlive {
namespace torch {

// TensorHostObject Method Names
static const std::string SIZE = "size";
static const std::string TOSTRING = "toString";

// TensorHostObject Property Names
static const std::string DATA = "data";
static const std::string DTYPE = "dtype";
static const std::string SHAPE = "shape";

// TensorHostObject Properties
static const std::vector<std::string> PROPERTIES = {DATA, DTYPE, SHAPE};

// TensorHostObject Methods
static const std::vector<std::string> METHODS = {SIZE, TOSTRING};

using namespace facebook;
namespace {
jsi::Value absImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.abs();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op abs do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value addImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0) &&
      args.isScalarKwarg(1, "alpha", false)) {
    auto other = args.asHostObject<TensorHostObject>(0)->tensor;
    auto alpha = args.asScalarKwarg(1, "alpha", at::Scalar(1));
    at::Tensor result = self->tensor.add(other, alpha);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }

  if (args.atLeastNumArguments(1) && args.isScalar(0) &&
      args.isScalarKwarg(1, "alpha", false)) {
    auto other = args.asScalar(0);
    auto alpha = args.asScalarKwarg(1, "alpha", at::Scalar(1));
    at::Tensor result = self->tensor.add(other, alpha);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op add do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &, const at::Scalar &), at::Tensor (const at::Tensor &, const at::Scalar &, const at::Scalar &)");
}

jsi::Value argmaxImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0) &&
      args.isC10OptionalInt64Kwarg(0, "dim", false) &&
      args.isBoolKwarg(0, "keepdim", false)) {
    auto dim = args.asC10OptionalInt64Kwarg(0, "dim", c10::nullopt);
    auto keepdim = args.asBoolKwarg(0, "keepdim", false);
    at::Tensor result = self->tensor.argmax(dim, keepdim);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op argmax do not match any of the following signatures:at::Tensor (const at::Tensor &, c10::optional<int64_t>, bool)");
}

jsi::Value argminImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0) &&
      args.isC10OptionalInt64Kwarg(0, "dim", false) &&
      args.isBoolKwarg(0, "keepdim", false)) {
    auto dim = args.asC10OptionalInt64Kwarg(0, "dim", c10::nullopt);
    auto keepdim = args.asBoolKwarg(0, "keepdim", false);
    at::Tensor result = self->tensor.argmin(dim, keepdim);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op argmin do not match any of the following signatures:at::Tensor (const at::Tensor &, c10::optional<int64_t>, bool)");
}

jsi::Value contiguousImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0) &&
      args.isMemoryFormatKwarg(0, "memoryFormat", false)) {
    auto memoryFormat = args.asMemoryFormatKwarg(
        0, "memoryFormat", at::MemoryFormat::Contiguous);
    at::Tensor result = self->tensor.contiguous(memoryFormat);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op contiguous do not match any of the following signatures:at::Tensor (const at::Tensor &, at::MemoryFormat)");
}

jsi::Value divImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(2) && args.isHostObject<TensorHostObject>(0) &&
      args.isStringKwarg(1, "roundingMode", true)) {
    auto other = args.asHostObject<TensorHostObject>(0)->tensor;
    auto roundingMode =
        c10::optional<c10::string_view>(args.asStringKwarg(1, "roundingMode"));
    at::Tensor result = self->tensor.div(other, roundingMode);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }

  if (args.atLeastNumArguments(2) && args.isScalar(0) &&
      args.isStringKwarg(1, "roundingMode", true)) {
    auto other = args.asScalar(0);
    auto roundingMode =
        c10::optional<c10::string_view>(args.asStringKwarg(1, "roundingMode"));
    at::Tensor result = self->tensor.div(other, roundingMode);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }

  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0)) {
    auto other = args.asHostObject<TensorHostObject>(0)->tensor;
    at::Tensor result = self->tensor.div(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }

  if (args.atLeastNumArguments(1) && args.isScalar(0)) {
    auto other = args.asScalar(0);
    at::Tensor result = self->tensor.div(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op div do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &, c10::optional<c10::string_view>), at::Tensor (const at::Tensor &, const at::Scalar &, c10::optional<c10::string_view>), at::Tensor (const at::Tensor &, const at::Tensor &), at::Tensor (const at::Tensor &, const at::Scalar &)");
}

jsi::Value expandImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isIntArrayRef(0) &&
      args.isBoolKwarg(1, "implicit", false)) {
    auto sizePointer = args.asIntArrayRefPtr(0);
    auto size = c10::ArrayRef(*sizePointer);
    auto implicit = args.asBoolKwarg(1, "implicit", false);
    at::Tensor result = self->tensor.expand(size, implicit);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op expand do not match any of the following signatures:at::Tensor (const at::Tensor &, at::IntArrayRef, bool)");
}

jsi::Value flipImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isIntArrayRef(0)) {
    auto dimsPointer = args.asIntArrayRefPtr(0);
    auto dims = c10::ArrayRef(*dimsPointer);
    at::Tensor result = self->tensor.flip(dims);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op flip do not match any of the following signatures:at::Tensor (const at::Tensor &, at::IntArrayRef)");
}

jsi::Value itemImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);

  // TODO(T113480543): enable BigInt once Hermes supports it
  if (thisValue.asObject(runtime)
          .asHostObject<TensorHostObject>(runtime)
          ->tensor.dtype() == torch_::kInt64) {
    throw jsi::JSError(
        runtime,
        "the property 'item' for a tensor of dtype torch.int64 is not"
        " supported. Work around this with .to({dtype: torch.int32})"
        " This might alter the tensor values.");
  }
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    auto result = self->tensor.item();
    if (result.isIntegral(/*includeBool=*/false)) {
      return jsi::Value(result.toInt());
    } else if (result.isFloatingPoint()) {
      return jsi::Value(result.toDouble());
    } else {
      throw jsi::JSError(runtime, "unsupported dtype for item().");
    }
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op item do not match any of the following signatures:at::Scalar (const at::Tensor &)");
}

jsi::Value matmulImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0)) {
    auto other = args.asHostObject<TensorHostObject>(0)->tensor;
    at::Tensor result = self->tensor.matmul(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op matmul do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &)");
}

jsi::Value mulImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0)) {
    auto other = args.asHostObject<TensorHostObject>(0)->tensor;
    at::Tensor result = self->tensor.mul(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }

  if (args.atLeastNumArguments(1) && args.isScalar(0)) {
    auto other = args.asScalar(0);
    at::Tensor result = self->tensor.mul(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op mul do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &), at::Tensor (const at::Tensor &, const at::Scalar &)");
}

jsi::Value permuteImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isIntArrayRef(0)) {
    auto dimsPointer = args.asIntArrayRefPtr(0);
    auto dims = c10::ArrayRef(*dimsPointer);
    at::Tensor result = self->tensor.permute(dims);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op permute do not match any of the following signatures:at::Tensor (const at::Tensor &, at::IntArrayRef)");
}

jsi::Value reshapeImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isIntArrayRef(0)) {
    auto shapePointer = args.asIntArrayRefPtr(0);
    auto shape = c10::ArrayRef(*shapePointer);
    at::Tensor result = self->tensor.reshape(shape);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op reshape do not match any of the following signatures:at::Tensor (const at::Tensor &, at::IntArrayRef)");
}

jsi::Value sqrtImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.sqrt();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op sqrt do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value subImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0) &&
      args.isScalarKwarg(1, "alpha", false)) {
    auto other = args.asHostObject<TensorHostObject>(0)->tensor;
    auto alpha = args.asScalarKwarg(1, "alpha", at::Scalar(1));
    at::Tensor result = self->tensor.sub(other, alpha);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }

  if (args.atLeastNumArguments(1) && args.isScalar(0) &&
      args.isScalarKwarg(1, "alpha", false)) {
    auto other = args.asScalar(0);
    auto alpha = args.asScalarKwarg(1, "alpha", at::Scalar(1));
    at::Tensor result = self->tensor.sub(other, alpha);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op sub do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &, const at::Scalar &), at::Tensor (const at::Tensor &, const at::Scalar &, const at::Scalar &)");
}

jsi::Value topkImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isInt64(0) &&
      args.isInt64Kwarg(1, "dim", false) &&
      args.isBoolKwarg(1, "largest", false) &&
      args.isBoolKwarg(1, "sorted", false)) {
    auto k = args.asInt64(0);
    auto dim = args.asInt64Kwarg(1, "dim", -1);
    auto largest = args.asBoolKwarg(1, "largest", true);
    auto sorted = args.asBoolKwarg(1, "sorted", true);

    ::std::tuple<at::Tensor, at::Tensor> intermediateTuple =
        self->tensor.topk(k, dim, largest, sorted);
    auto valuesTensor = std::get<0>(intermediateTuple);
    if (valuesTensor.dtype() == utils::constants::getDtypeFromString("int64")) {
      valuesTensor = valuesTensor.to(c10::ScalarType::Int);
    }
    auto values = utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, valuesTensor);
    auto indicesTensor = std::get<1>(intermediateTuple);
    if (indicesTensor.dtype() ==
        utils::constants::getDtypeFromString("int64")) {
      indicesTensor = indicesTensor.to(c10::ScalarType::Int);
    }
    auto indices = utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, indicesTensor);
    return jsi::Array::createWithElements(runtime, values, indices);
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op topk do not match any of the following signatures:::std::tuple<at::Tensor,at::Tensor> (const at::Tensor &, int64_t, int64_t, bool, bool)");
}

jsi::Value unsqueezeImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isInt64(0)) {
    auto dim = args.asInt64(0);
    at::Tensor result = self->tensor.unsqueeze(dim);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op unsqueeze do not match any of the following signatures:at::Tensor (const at::Tensor &, int64_t)");
}

} // namespace

TensorHostObject::TensorHostObject(jsi::Runtime& runtime, torch_::Tensor t)
    : BaseHostObject(runtime),
      size_(createSize(runtime)),
      toString_(createToString(runtime)),
      tensor(t) {
  setPropertyHostFunction(runtime, "abs", 0, absImpl);
  setPropertyHostFunction(runtime, "add", 1, addImpl);
  setPropertyHostFunction(runtime, "argmax", 0, argmaxImpl);
  setPropertyHostFunction(runtime, "argmin", 0, argminImpl);
  setPropertyHostFunction(
      runtime, "clamp", 0, TensorHostObjectDeprecated::clampImpl);
  setPropertyHostFunction(runtime, "contiguous", 0, contiguousImpl);
  setPropertyHostFunction(
      runtime, "data", 0, TensorHostObjectDeprecated::dataImpl);
  setPropertyHostFunction(runtime, "div", 1, divImpl);
  setPropertyHostFunction(runtime, "expand", 1, expandImpl);
  setPropertyHostFunction(runtime, "flip", 1, flipImpl);
  setPropertyHostFunction(runtime, "item", 0, itemImpl);
  setPropertyHostFunction(runtime, "matmul", 1, matmulImpl);
  setPropertyHostFunction(runtime, "mul", 1, mulImpl);
  setPropertyHostFunction(runtime, "permute", 1, permuteImpl);
  setPropertyHostFunction(runtime, "reshape", 1, reshapeImpl);
  setPropertyHostFunction(
      runtime, "softmax", 1, TensorHostObjectDeprecated::softmaxImpl);
  setPropertyHostFunction(runtime, "sqrt", 0, sqrtImpl);
  setPropertyHostFunction(
      runtime, "squeeze", 0, TensorHostObjectDeprecated::squeezeImpl);
  setPropertyHostFunction(
      runtime, "stride", 1, TensorHostObjectDeprecated::strideImpl);
  setPropertyHostFunction(runtime, "sub", 1, subImpl);
  setPropertyHostFunction(
      runtime, "sum", 0, TensorHostObjectDeprecated::sumImpl);
  setPropertyHostFunction(runtime, "to", 0, TensorHostObjectDeprecated::toImpl);
  setPropertyHostFunction(runtime, "topk", 1, topkImpl);
  setPropertyHostFunction(runtime, "unsqueeze", 1, unsqueezeImpl);
}

TensorHostObject::~TensorHostObject() {}

std::vector<jsi::PropNameID> TensorHostObject::getPropertyNames(
    jsi::Runtime& runtime) {
  auto result = BaseHostObject::getPropertyNames(runtime);
  for (std::string property : PROPERTIES) {
    result.push_back(jsi::PropNameID::forUtf8(runtime, property));
  }
  for (std::string method : METHODS) {
    result.push_back(jsi::PropNameID::forUtf8(runtime, method));
  }
  return result;
}

jsi::Value TensorHostObject::get(
    jsi::Runtime& runtime,
    const jsi::PropNameID& propNameId) {
  auto name = propNameId.utf8(runtime);

  if (name == DTYPE) {
    return jsi::String::createFromUtf8(
        runtime,
        utils::constants::getStringFromDtype(
            caffe2::typeMetaToScalarType(this->tensor.dtype())));
  } else if (name == SHAPE) {
    return this->size_.call(runtime);
  } else if (name == SIZE) {
    return jsi::Value(runtime, size_);
  } else if (name == TOSTRING) {
    return jsi::Value(runtime, toString_);
  }

  int idx = -1;
  try {
    idx = std::stoi(name.c_str());
  } catch (...) {
    // Cannot parse name value to int. This can happen when the name in bracket
    // or dot notion is not an int (e.g., tensor['foo']).
    // Let's ignore this exception here since this function will return
    // undefined if it reaches the function end.
  }
  // Check if index is within bounds of dimension 0
  if (idx >= 0 && idx < this->tensor.size(0)) {
    auto outputTensor = this->tensor.index({idx});
    auto tensorHostObject =
        std::make_shared<torchlive::torch::TensorHostObject>(
            runtime, std::move(outputTensor));
    return jsi::Object::createFromHostObject(runtime, tensorHostObject);
  }

  return BaseHostObject::get(runtime, propNameId);
}

void TensorHostObject::set(
    jsi::Runtime& runtime,
    const jsi::PropNameID& propNameId,
    const jsi::Value& value) {
  auto name = propNameId.utf8(runtime);

  int idx = -1;
  try {
    idx = std::stoi(name.c_str());
  } catch (...) {
    // Cannot parse name value to int. This can happen when the name in bracket
    // or dot notion is not an int (e.g., tensor['foo']).
    // Let's ignore this exception here and have the PyTorch C++ API throw an
    // error for index out of bounds.
    // Note: The Tensor Indexing API allows for a much broader range of indices
    // but for now, the PlayTorch API only supports single value index values.
  }
  if (value.isObject()) {
    // Get TensorHostObject with wrapped tensor, otherwise it will be nullptr
    auto tensorHostObject =
        value.asObject(runtime).asHostObject<TensorHostObject>(runtime);
    if (tensorHostObject != nullptr) {
      this->tensor.index_put_({idx}, tensorHostObject->tensor);
    }
  } else if (value.isNumber()) {
    this->tensor.index_put_({idx}, value.asNumber());
  } else {
    throw jsi::JSError(
        runtime,
        "Invalid value! The value has to be of type tensor or a number");
  }
}

jsi::Function TensorHostObject::createToString(jsi::Runtime& runtime) {
  auto toStringFunc = [this](
                          jsi::Runtime& runtime,
                          const jsi::Value& thisValue,
                          const jsi::Value* arguments,
                          size_t count) -> jsi::Value {
    auto tensor = this->tensor;
    std::ostringstream stream;
    stream << tensor;
    std::string tensor_string = stream.str();
    auto val = jsi::String::createFromUtf8(runtime, tensor_string);
    return jsi::Value(std::move(val));
  };
  return jsi::Function::createFromHostFunction(
      runtime, jsi::PropNameID::forUtf8(runtime, TOSTRING), 0, toStringFunc);
}

jsi::Function TensorHostObject::createSize(jsi::Runtime& runtime) {
  auto sizeFunc = [this](
                      jsi::Runtime& runtime,
                      const jsi::Value& thisValue,
                      const jsi::Value* arguments,
                      size_t count) -> jsi::Value {
    auto tensor = this->tensor;
    torch_::IntArrayRef dims = tensor.sizes();
    jsi::Array jsShape = jsi::Array(runtime, dims.size());
    for (int i = 0; i < dims.size(); i++) {
      jsShape.setValueAtIndex(runtime, i, jsi::Value((int)dims[i]));
    }
    return jsShape;
  };
  return jsi::Function::createFromHostFunction(
      runtime, jsi::PropNameID::forUtf8(runtime, SIZE), 0, sizeFunc);
}
} // namespace torch
} // namespace torchlive
