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
jsi::Value _And_Impl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isScalar(0)) {
    auto other = args.asScalar(0);
    at::Tensor result = self->tensor.__and__(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }

  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0)) {
    auto other = args.asHostObject<TensorHostObject>(0)->tensor;
    at::Tensor result = self->tensor.__and__(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op __and__ do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Scalar &), at::Tensor (const at::Tensor &, const at::Tensor &)");
}

jsi::Value _Lshift_Impl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isScalar(0)) {
    auto other = args.asScalar(0);
    at::Tensor result = self->tensor.__lshift__(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }

  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0)) {
    auto other = args.asHostObject<TensorHostObject>(0)->tensor;
    at::Tensor result = self->tensor.__lshift__(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op __lshift__ do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Scalar &), at::Tensor (const at::Tensor &, const at::Tensor &)");
}

jsi::Value _Or_Impl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isScalar(0)) {
    auto other = args.asScalar(0);
    at::Tensor result = self->tensor.__or__(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }

  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0)) {
    auto other = args.asHostObject<TensorHostObject>(0)->tensor;
    at::Tensor result = self->tensor.__or__(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op __or__ do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Scalar &), at::Tensor (const at::Tensor &, const at::Tensor &)");
}

jsi::Value _Rshift_Impl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isScalar(0)) {
    auto other = args.asScalar(0);
    at::Tensor result = self->tensor.__rshift__(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }

  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0)) {
    auto other = args.asHostObject<TensorHostObject>(0)->tensor;
    at::Tensor result = self->tensor.__rshift__(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op __rshift__ do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Scalar &), at::Tensor (const at::Tensor &, const at::Tensor &)");
}

jsi::Value _Xor_Impl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isScalar(0)) {
    auto other = args.asScalar(0);
    at::Tensor result = self->tensor.__xor__(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }

  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0)) {
    auto other = args.asHostObject<TensorHostObject>(0)->tensor;
    at::Tensor result = self->tensor.__xor__(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op __xor__ do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Scalar &), at::Tensor (const at::Tensor &, const at::Tensor &)");
}

jsi::Value _addmmActivationImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(2);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(2) && args.isHostObject<TensorHostObject>(0) &&
      args.isHostObject<TensorHostObject>(1) &&
      args.isScalarKwarg(2, "beta", false) &&
      args.isScalarKwarg(2, "alpha", false) &&
      args.isBoolKwarg(2, "useGelu", false)) {
    auto mat1 = args.asHostObject<TensorHostObject>(0)->tensor;
    auto mat2 = args.asHostObject<TensorHostObject>(1)->tensor;
    auto beta = args.asScalarKwarg(2, "beta", at::Scalar(1));
    auto alpha = args.asScalarKwarg(2, "alpha", at::Scalar(1));
    auto useGelu = args.asBoolKwarg(2, "useGelu", false);
    at::Tensor result =
        self->tensor._addmm_activation(mat1, mat2, beta, alpha, useGelu);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op _addmm_activation do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &, const at::Tensor &, const at::Scalar &, const at::Scalar &, bool)");
}

jsi::Value _conjImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor._conj();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op _conj do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value _conjPhysicalImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor._conj_physical();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op _conj_physical do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value _fwPrimalImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isInt64(0)) {
    auto level = args.asInt64(0);
    at::Tensor result = self->tensor._fw_primal(level);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op _fw_primal do not match any of the following signatures:at::Tensor (const at::Tensor &, int64_t)");
}

jsi::Value _indicesImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor._indices();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op _indices do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value _negViewImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor._neg_view();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op _neg_view do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value _nestedTensorSizeImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor._nested_tensor_size();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op _nested_tensor_size do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value _nestedTensorStridesImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor._nested_tensor_strides();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op _nested_tensor_strides do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value _reshapeAliasImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(2);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(2) && args.isIntArrayRef(0) &&
      args.isIntArrayRef(1)) {
    auto sizePointer = args.asIntArrayRefPtr(0);
    auto size = c10::ArrayRef(*sizePointer);
    auto stridePointer = args.asIntArrayRefPtr(1);
    auto stride = c10::ArrayRef(*stridePointer);
    at::Tensor result = self->tensor._reshape_alias(size, stride);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op _reshape_alias do not match any of the following signatures:at::Tensor (const at::Tensor &, at::IntArrayRef, at::IntArrayRef)");
}

jsi::Value _valuesImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor._values();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op _values do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

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

jsi::Value absoluteImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.absolute();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op absolute do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value acosImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.acos();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op acos do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value acoshImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.acosh();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op acosh do not match any of the following signatures:at::Tensor (const at::Tensor &)");
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

jsi::Value addbmmImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(2);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(2) && args.isHostObject<TensorHostObject>(0) &&
      args.isHostObject<TensorHostObject>(1) &&
      args.isScalarKwarg(2, "beta", false) &&
      args.isScalarKwarg(2, "alpha", false)) {
    auto batch1 = args.asHostObject<TensorHostObject>(0)->tensor;
    auto batch2 = args.asHostObject<TensorHostObject>(1)->tensor;
    auto beta = args.asScalarKwarg(2, "beta", at::Scalar(1));
    auto alpha = args.asScalarKwarg(2, "alpha", at::Scalar(1));
    at::Tensor result = self->tensor.addbmm(batch1, batch2, beta, alpha);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op addbmm do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &, const at::Tensor &, const at::Scalar &, const at::Scalar &)");
}

jsi::Value addcdivImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(2);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(2) && args.isHostObject<TensorHostObject>(0) &&
      args.isHostObject<TensorHostObject>(1) &&
      args.isScalarKwarg(2, "value", false)) {
    auto tensor1 = args.asHostObject<TensorHostObject>(0)->tensor;
    auto tensor2 = args.asHostObject<TensorHostObject>(1)->tensor;
    auto value = args.asScalarKwarg(2, "value", at::Scalar(1));
    at::Tensor result = self->tensor.addcdiv(tensor1, tensor2, value);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op addcdiv do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &, const at::Tensor &, const at::Scalar &)");
}

jsi::Value addcmulImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(2);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(2) && args.isHostObject<TensorHostObject>(0) &&
      args.isHostObject<TensorHostObject>(1) &&
      args.isScalarKwarg(2, "value", false)) {
    auto tensor1 = args.asHostObject<TensorHostObject>(0)->tensor;
    auto tensor2 = args.asHostObject<TensorHostObject>(1)->tensor;
    auto value = args.asScalarKwarg(2, "value", at::Scalar(1));
    at::Tensor result = self->tensor.addcmul(tensor1, tensor2, value);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op addcmul do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &, const at::Tensor &, const at::Scalar &)");
}

jsi::Value addmmImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(2);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(2) && args.isHostObject<TensorHostObject>(0) &&
      args.isHostObject<TensorHostObject>(1) &&
      args.isScalarKwarg(2, "beta", false) &&
      args.isScalarKwarg(2, "alpha", false)) {
    auto mat1 = args.asHostObject<TensorHostObject>(0)->tensor;
    auto mat2 = args.asHostObject<TensorHostObject>(1)->tensor;
    auto beta = args.asScalarKwarg(2, "beta", at::Scalar(1));
    auto alpha = args.asScalarKwarg(2, "alpha", at::Scalar(1));
    at::Tensor result = self->tensor.addmm(mat1, mat2, beta, alpha);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op addmm do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &, const at::Tensor &, const at::Scalar &, const at::Scalar &)");
}

jsi::Value addmvImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(2);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(2) && args.isHostObject<TensorHostObject>(0) &&
      args.isHostObject<TensorHostObject>(1) &&
      args.isScalarKwarg(2, "beta", false) &&
      args.isScalarKwarg(2, "alpha", false)) {
    auto mat = args.asHostObject<TensorHostObject>(0)->tensor;
    auto vec = args.asHostObject<TensorHostObject>(1)->tensor;
    auto beta = args.asScalarKwarg(2, "beta", at::Scalar(1));
    auto alpha = args.asScalarKwarg(2, "alpha", at::Scalar(1));
    at::Tensor result = self->tensor.addmv(mat, vec, beta, alpha);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op addmv do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &, const at::Tensor &, const at::Scalar &, const at::Scalar &)");
}

jsi::Value addrImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(2);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(2) && args.isHostObject<TensorHostObject>(0) &&
      args.isHostObject<TensorHostObject>(1) &&
      args.isScalarKwarg(2, "beta", false) &&
      args.isScalarKwarg(2, "alpha", false)) {
    auto vec1 = args.asHostObject<TensorHostObject>(0)->tensor;
    auto vec2 = args.asHostObject<TensorHostObject>(1)->tensor;
    auto beta = args.asScalarKwarg(2, "beta", at::Scalar(1));
    auto alpha = args.asScalarKwarg(2, "alpha", at::Scalar(1));
    at::Tensor result = self->tensor.addr(vec1, vec2, beta, alpha);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op addr do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &, const at::Tensor &, const at::Scalar &, const at::Scalar &)");
}

jsi::Value adjointImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.adjoint();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op adjoint do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value aliasImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.alias();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op alias do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value alignAsImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0)) {
    auto other = args.asHostObject<TensorHostObject>(0)->tensor;
    at::Tensor result = self->tensor.align_as(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op align_as do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &)");
}

jsi::Value aminmaxImpl(
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

    ::std::tuple<at::Tensor, at::Tensor> intermediateTuple =
        self->tensor.aminmax(dim, keepdim);
    auto minTensor = std::get<0>(intermediateTuple);
    if (minTensor.dtype() == utils::constants::getDtypeFromString("int64")) {
      minTensor = minTensor.to(c10::ScalarType::Int);
    }
    auto min = utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, minTensor);
    auto maxTensor = std::get<1>(intermediateTuple);
    if (maxTensor.dtype() == utils::constants::getDtypeFromString("int64")) {
      maxTensor = maxTensor.to(c10::ScalarType::Int);
    }
    auto max = utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, maxTensor);
    return jsi::Array::createWithElements(runtime, min, max);
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op aminmax do not match any of the following signatures:::std::tuple<at::Tensor,at::Tensor> (const at::Tensor &, c10::optional<int64_t>, bool)");
}

jsi::Value angleImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.angle();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op angle do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value arccosImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.arccos();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op arccos do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value arccoshImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.arccosh();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op arccosh do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value arcsinImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.arcsin();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op arcsin do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value arcsinhImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.arcsinh();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op arcsinh do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value arctanImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.arctan();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op arctan do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value arctan2Impl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0)) {
    auto other = args.asHostObject<TensorHostObject>(0)->tensor;
    at::Tensor result = self->tensor.arctan2(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op arctan2 do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &)");
}

jsi::Value arctanhImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.arctanh();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op arctanh do not match any of the following signatures:at::Tensor (const at::Tensor &)");
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

jsi::Value argwhereImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.argwhere();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op argwhere do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value asStridedImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(2);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(2) && args.isIntArrayRef(0) &&
      args.isIntArrayRef(1) &&
      args.isC10OptionalInt64Kwarg(2, "storageOffset", false)) {
    auto sizePointer = args.asIntArrayRefPtr(0);
    auto size = c10::ArrayRef(*sizePointer);
    auto stridePointer = args.asIntArrayRefPtr(1);
    auto stride = c10::ArrayRef(*stridePointer);
    auto storageOffset =
        args.asC10OptionalInt64Kwarg(2, "storageOffset", c10::nullopt);
    at::Tensor result = self->tensor.as_strided(size, stride, storageOffset);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op as_strided do not match any of the following signatures:at::Tensor (const at::Tensor &, at::IntArrayRef, at::IntArrayRef, c10::optional<int64_t>)");
}

jsi::Value asStridedScatterImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(3);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(3) && args.isHostObject<TensorHostObject>(0) &&
      args.isIntArrayRef(1) && args.isIntArrayRef(2) &&
      args.isC10OptionalInt64Kwarg(3, "storageOffset", false)) {
    auto src = args.asHostObject<TensorHostObject>(0)->tensor;
    auto sizePointer = args.asIntArrayRefPtr(1);
    auto size = c10::ArrayRef(*sizePointer);
    auto stridePointer = args.asIntArrayRefPtr(2);
    auto stride = c10::ArrayRef(*stridePointer);
    auto storageOffset =
        args.asC10OptionalInt64Kwarg(3, "storageOffset", c10::nullopt);
    at::Tensor result =
        self->tensor.as_strided_scatter(src, size, stride, storageOffset);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op as_strided_scatter do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &, at::IntArrayRef, at::IntArrayRef, c10::optional<int64_t>)");
}

jsi::Value asinImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.asin();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op asin do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value asinhImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.asinh();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op asinh do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value atanImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.atan();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op atan do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value atan2Impl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0)) {
    auto other = args.asHostObject<TensorHostObject>(0)->tensor;
    at::Tensor result = self->tensor.atan2(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op atan2 do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &)");
}

jsi::Value atanhImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.atanh();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op atanh do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value baddbmmImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(2);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(2) && args.isHostObject<TensorHostObject>(0) &&
      args.isHostObject<TensorHostObject>(1) &&
      args.isScalarKwarg(2, "beta", false) &&
      args.isScalarKwarg(2, "alpha", false)) {
    auto batch1 = args.asHostObject<TensorHostObject>(0)->tensor;
    auto batch2 = args.asHostObject<TensorHostObject>(1)->tensor;
    auto beta = args.asScalarKwarg(2, "beta", at::Scalar(1));
    auto alpha = args.asScalarKwarg(2, "alpha", at::Scalar(1));
    at::Tensor result = self->tensor.baddbmm(batch1, batch2, beta, alpha);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op baddbmm do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &, const at::Tensor &, const at::Scalar &, const at::Scalar &)");
}

jsi::Value bitwiseAndImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isScalar(0)) {
    auto other = args.asScalar(0);
    at::Tensor result = self->tensor.bitwise_and(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }

  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0)) {
    auto other = args.asHostObject<TensorHostObject>(0)->tensor;
    at::Tensor result = self->tensor.bitwise_and(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op bitwise_and do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Scalar &), at::Tensor (const at::Tensor &, const at::Tensor &)");
}

jsi::Value bitwiseLeftShiftImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0)) {
    auto other = args.asHostObject<TensorHostObject>(0)->tensor;
    at::Tensor result = self->tensor.bitwise_left_shift(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }

  if (args.atLeastNumArguments(1) && args.isScalar(0)) {
    auto other = args.asScalar(0);
    at::Tensor result = self->tensor.bitwise_left_shift(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op bitwise_left_shift do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &), at::Tensor (const at::Tensor &, const at::Scalar &)");
}

jsi::Value bitwiseNotImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.bitwise_not();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op bitwise_not do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value bitwiseOrImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isScalar(0)) {
    auto other = args.asScalar(0);
    at::Tensor result = self->tensor.bitwise_or(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }

  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0)) {
    auto other = args.asHostObject<TensorHostObject>(0)->tensor;
    at::Tensor result = self->tensor.bitwise_or(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op bitwise_or do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Scalar &), at::Tensor (const at::Tensor &, const at::Tensor &)");
}

jsi::Value bitwiseRightShiftImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0)) {
    auto other = args.asHostObject<TensorHostObject>(0)->tensor;
    at::Tensor result = self->tensor.bitwise_right_shift(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }

  if (args.atLeastNumArguments(1) && args.isScalar(0)) {
    auto other = args.asScalar(0);
    at::Tensor result = self->tensor.bitwise_right_shift(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op bitwise_right_shift do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &), at::Tensor (const at::Tensor &, const at::Scalar &)");
}

jsi::Value bitwiseXorImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isScalar(0)) {
    auto other = args.asScalar(0);
    at::Tensor result = self->tensor.bitwise_xor(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }

  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0)) {
    auto other = args.asHostObject<TensorHostObject>(0)->tensor;
    at::Tensor result = self->tensor.bitwise_xor(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op bitwise_xor do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Scalar &), at::Tensor (const at::Tensor &, const at::Tensor &)");
}

jsi::Value bmmImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0)) {
    auto mat2 = args.asHostObject<TensorHostObject>(0)->tensor;
    at::Tensor result = self->tensor.bmm(mat2);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op bmm do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &)");
}

jsi::Value broadcastToImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isIntArrayRef(0)) {
    auto sizePointer = args.asIntArrayRefPtr(0);
    auto size = c10::ArrayRef(*sizePointer);
    at::Tensor result = self->tensor.broadcast_to(size);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op broadcast_to do not match any of the following signatures:at::Tensor (const at::Tensor &, at::IntArrayRef)");
}

jsi::Value ccolIndicesImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.ccol_indices();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op ccol_indices do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value ceilImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.ceil();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op ceil do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value choleskyImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0) && args.isBoolKwarg(0, "upper", false)) {
    auto upper = args.asBoolKwarg(0, "upper", false);
    at::Tensor result = self->tensor.cholesky(upper);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op cholesky do not match any of the following signatures:at::Tensor (const at::Tensor &, bool)");
}

jsi::Value choleskyInverseImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0) && args.isBoolKwarg(0, "upper", false)) {
    auto upper = args.asBoolKwarg(0, "upper", false);
    at::Tensor result = self->tensor.cholesky_inverse(upper);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op cholesky_inverse do not match any of the following signatures:at::Tensor (const at::Tensor &, bool)");
}

jsi::Value choleskySolveImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0) &&
      args.isBoolKwarg(1, "upper", false)) {
    auto input2 = args.asHostObject<TensorHostObject>(0)->tensor;
    auto upper = args.asBoolKwarg(1, "upper", false);
    at::Tensor result = self->tensor.cholesky_solve(input2, upper);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op cholesky_solve do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &, bool)");
}

jsi::Value clampImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (false) {
    throw facebook::jsi::JSError(
        runtime,
        "Argument parsing for type const c10::optional<at::Scalar> & has not been implemented yet");
    throw facebook::jsi::JSError(
        runtime,
        "Argument parsing for type const c10::optional<at::Scalar> & has not been implemented yet");
  }

  if (false) {
    throw facebook::jsi::JSError(
        runtime,
        "Argument parsing for type const c10::optional<at::Tensor> & has not been implemented yet");
    throw facebook::jsi::JSError(
        runtime,
        "Argument parsing for type const c10::optional<at::Tensor> & has not been implemented yet");
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op clamp do not match any of the following signatures:at::Tensor (const at::Tensor &, const c10::optional<at::Scalar> &, const c10::optional<at::Scalar> &), at::Tensor (const at::Tensor &, const c10::optional<at::Tensor> &, const c10::optional<at::Tensor> &)");
}

jsi::Value clampMaxImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isScalar(0)) {
    auto max = args.asScalar(0);
    at::Tensor result = self->tensor.clamp_max(max);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }

  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0)) {
    auto max = args.asHostObject<TensorHostObject>(0)->tensor;
    at::Tensor result = self->tensor.clamp_max(max);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op clamp_max do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Scalar &), at::Tensor (const at::Tensor &, const at::Tensor &)");
}

jsi::Value clampMinImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isScalar(0)) {
    auto min = args.asScalar(0);
    at::Tensor result = self->tensor.clamp_min(min);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }

  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0)) {
    auto min = args.asHostObject<TensorHostObject>(0)->tensor;
    at::Tensor result = self->tensor.clamp_min(min);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op clamp_min do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Scalar &), at::Tensor (const at::Tensor &, const at::Tensor &)");
}

jsi::Value coalesceImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.coalesce();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op coalesce do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value colIndicesImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.col_indices();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op col_indices do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value conjImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.conj();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op conj do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value conjPhysicalImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.conj_physical();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op conj_physical do not match any of the following signatures:at::Tensor (const at::Tensor &)");
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

jsi::Value copysignImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0)) {
    auto other = args.asHostObject<TensorHostObject>(0)->tensor;
    at::Tensor result = self->tensor.copysign(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }

  if (args.atLeastNumArguments(1) && args.isScalar(0)) {
    auto other = args.asScalar(0);
    at::Tensor result = self->tensor.copysign(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op copysign do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &), at::Tensor (const at::Tensor &, const at::Scalar &)");
}

jsi::Value corrcoefImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.corrcoef();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op corrcoef do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value cosImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.cos();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op cos do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value coshImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.cosh();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op cosh do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value countNonzeroImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isIntArrayRef(0)) {
    auto dimPointer = args.asIntArrayRefPtr(0);
    auto dim = c10::ArrayRef(*dimPointer);
    at::Tensor result = self->tensor.count_nonzero(dim);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }

  if (args.atLeastNumArguments(0) &&
      args.isC10OptionalInt64Kwarg(0, "dim", false)) {
    auto dim = args.asC10OptionalInt64Kwarg(0, "dim", c10::nullopt);
    at::Tensor result = self->tensor.count_nonzero(dim);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op count_nonzero do not match any of the following signatures:at::Tensor (const at::Tensor &, at::IntArrayRef), at::Tensor (const at::Tensor &, c10::optional<int64_t>)");
}

jsi::Value crossImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0) &&
      args.isC10OptionalInt64Kwarg(1, "dim", false)) {
    auto other = args.asHostObject<TensorHostObject>(0)->tensor;
    auto dim = args.asC10OptionalInt64Kwarg(1, "dim", c10::nullopt);
    at::Tensor result = self->tensor.cross(other, dim);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op cross do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &, c10::optional<int64_t>)");
}

jsi::Value crowIndicesImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.crow_indices();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op crow_indices do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value deg2radImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.deg2rad();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op deg2rad do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value dequantizeImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.dequantize();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op dequantize do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value detImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.det();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op det do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value detachImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.detach();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op detach do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value diagImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0) && args.isInt64Kwarg(0, "diagonal", false)) {
    auto diagonal = args.asInt64Kwarg(0, "diagonal", 0);
    at::Tensor result = self->tensor.diag(diagonal);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op diag do not match any of the following signatures:at::Tensor (const at::Tensor &, int64_t)");
}

jsi::Value diagEmbedImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0) && args.isInt64Kwarg(0, "offset", false) &&
      args.isInt64Kwarg(0, "dim1", false) &&
      args.isInt64Kwarg(0, "dim2", false)) {
    auto offset = args.asInt64Kwarg(0, "offset", 0);
    auto dim1 = args.asInt64Kwarg(0, "dim1", -2);
    auto dim2 = args.asInt64Kwarg(0, "dim2", -1);
    at::Tensor result = self->tensor.diag_embed(offset, dim1, dim2);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op diag_embed do not match any of the following signatures:at::Tensor (const at::Tensor &, int64_t, int64_t, int64_t)");
}

jsi::Value diagflatImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0) && args.isInt64Kwarg(0, "offset", false)) {
    auto offset = args.asInt64Kwarg(0, "offset", 0);
    at::Tensor result = self->tensor.diagflat(offset);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op diagflat do not match any of the following signatures:at::Tensor (const at::Tensor &, int64_t)");
}

jsi::Value diagonalScatterImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0) &&
      args.isInt64Kwarg(1, "offset", false) &&
      args.isInt64Kwarg(1, "dim1", false) &&
      args.isInt64Kwarg(1, "dim2", false)) {
    auto src = args.asHostObject<TensorHostObject>(0)->tensor;
    auto offset = args.asInt64Kwarg(1, "offset", 0);
    auto dim1 = args.asInt64Kwarg(1, "dim1", 0);
    auto dim2 = args.asInt64Kwarg(1, "dim2", 1);
    at::Tensor result = self->tensor.diagonal_scatter(src, offset, dim1, dim2);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op diagonal_scatter do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &, int64_t, int64_t, int64_t)");
}

jsi::Value digammaImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.digamma();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op digamma do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value distImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0) &&
      args.isScalarKwarg(1, "p", false)) {
    auto other = args.asHostObject<TensorHostObject>(0)->tensor;
    auto p = args.asScalarKwarg(1, "p", at::Scalar(2));
    at::Tensor result = self->tensor.dist(other, p);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op dist do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &, const at::Scalar &)");
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

jsi::Value divideImpl(
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
    at::Tensor result = self->tensor.divide(other, roundingMode);
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
    at::Tensor result = self->tensor.divide(other, roundingMode);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }

  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0)) {
    auto other = args.asHostObject<TensorHostObject>(0)->tensor;
    at::Tensor result = self->tensor.divide(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }

  if (args.atLeastNumArguments(1) && args.isScalar(0)) {
    auto other = args.asScalar(0);
    at::Tensor result = self->tensor.divide(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op divide do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &, c10::optional<c10::string_view>), at::Tensor (const at::Tensor &, const at::Scalar &, c10::optional<c10::string_view>), at::Tensor (const at::Tensor &, const at::Tensor &), at::Tensor (const at::Tensor &, const at::Scalar &)");
}

jsi::Value dotImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0)) {
    auto tensor = args.asHostObject<TensorHostObject>(0)->tensor;
    at::Tensor result = self->tensor.dot(tensor);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op dot do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &)");
}

jsi::Value eqImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isScalar(0)) {
    auto other = args.asScalar(0);
    at::Tensor result = self->tensor.eq(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }

  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0)) {
    auto other = args.asHostObject<TensorHostObject>(0)->tensor;
    at::Tensor result = self->tensor.eq(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op eq do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Scalar &), at::Tensor (const at::Tensor &, const at::Tensor &)");
}

jsi::Value erfImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.erf();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op erf do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value erfcImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.erfc();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op erfc do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value erfinvImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.erfinv();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op erfinv do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value expImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.exp();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op exp do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value exp2Impl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.exp2();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op exp2 do not match any of the following signatures:at::Tensor (const at::Tensor &)");
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

jsi::Value expandAsImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0)) {
    auto other = args.asHostObject<TensorHostObject>(0)->tensor;
    at::Tensor result = self->tensor.expand_as(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op expand_as do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &)");
}

jsi::Value expm1Impl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.expm1();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op expm1 do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value fixImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.fix();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op fix do not match any of the following signatures:at::Tensor (const at::Tensor &)");
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

jsi::Value fliplrImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.fliplr();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op fliplr do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value flipudImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.flipud();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op flipud do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value floatPowerImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0)) {
    auto exponent = args.asHostObject<TensorHostObject>(0)->tensor;
    at::Tensor result = self->tensor.float_power(exponent);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }

  if (args.atLeastNumArguments(1) && args.isScalar(0)) {
    auto exponent = args.asScalar(0);
    at::Tensor result = self->tensor.float_power(exponent);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op float_power do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &), at::Tensor (const at::Tensor &, const at::Scalar &)");
}

jsi::Value floorImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.floor();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op floor do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value floorDivideImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0)) {
    auto other = args.asHostObject<TensorHostObject>(0)->tensor;
    at::Tensor result = self->tensor.floor_divide(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }

  if (args.atLeastNumArguments(1) && args.isScalar(0)) {
    auto other = args.asScalar(0);
    at::Tensor result = self->tensor.floor_divide(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op floor_divide do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &), at::Tensor (const at::Tensor &, const at::Scalar &)");
}

jsi::Value fmaxImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0)) {
    auto other = args.asHostObject<TensorHostObject>(0)->tensor;
    at::Tensor result = self->tensor.fmax(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op fmax do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &)");
}

jsi::Value fminImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0)) {
    auto other = args.asHostObject<TensorHostObject>(0)->tensor;
    at::Tensor result = self->tensor.fmin(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op fmin do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &)");
}

jsi::Value fmodImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isScalar(0)) {
    auto other = args.asScalar(0);
    at::Tensor result = self->tensor.fmod(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }

  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0)) {
    auto other = args.asHostObject<TensorHostObject>(0)->tensor;
    at::Tensor result = self->tensor.fmod(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op fmod do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Scalar &), at::Tensor (const at::Tensor &, const at::Tensor &)");
}

jsi::Value fracImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.frac();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op frac do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value frexpImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    ::std::tuple<at::Tensor, at::Tensor> intermediateTuple =
        self->tensor.frexp();
    auto mantissaTensor = std::get<0>(intermediateTuple);
    if (mantissaTensor.dtype() ==
        utils::constants::getDtypeFromString("int64")) {
      mantissaTensor = mantissaTensor.to(c10::ScalarType::Int);
    }
    auto mantissa = utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, mantissaTensor);
    auto exponentTensor = std::get<1>(intermediateTuple);
    if (exponentTensor.dtype() ==
        utils::constants::getDtypeFromString("int64")) {
      exponentTensor = exponentTensor.to(c10::ScalarType::Int);
    }
    auto exponent = utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, exponentTensor);
    return jsi::Array::createWithElements(runtime, mantissa, exponent);
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op frexp do not match any of the following signatures:::std::tuple<at::Tensor,at::Tensor> (const at::Tensor &)");
}

jsi::Value gcdImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0)) {
    auto other = args.asHostObject<TensorHostObject>(0)->tensor;
    at::Tensor result = self->tensor.gcd(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op gcd do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &)");
}

jsi::Value geImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isScalar(0)) {
    auto other = args.asScalar(0);
    at::Tensor result = self->tensor.ge(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }

  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0)) {
    auto other = args.asHostObject<TensorHostObject>(0)->tensor;
    at::Tensor result = self->tensor.ge(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op ge do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Scalar &), at::Tensor (const at::Tensor &, const at::Tensor &)");
}

jsi::Value geqrfImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    ::std::tuple<at::Tensor, at::Tensor> intermediateTuple =
        self->tensor.geqrf();
    auto aTensor = std::get<0>(intermediateTuple);
    if (aTensor.dtype() == utils::constants::getDtypeFromString("int64")) {
      aTensor = aTensor.to(c10::ScalarType::Int);
    }
    auto a = utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, aTensor);
    auto tauTensor = std::get<1>(intermediateTuple);
    if (tauTensor.dtype() == utils::constants::getDtypeFromString("int64")) {
      tauTensor = tauTensor.to(c10::ScalarType::Int);
    }
    auto tau = utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, tauTensor);
    return jsi::Array::createWithElements(runtime, a, tau);
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op geqrf do not match any of the following signatures:::std::tuple<at::Tensor,at::Tensor> (const at::Tensor &)");
}

jsi::Value gerImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0)) {
    auto vec2 = args.asHostObject<TensorHostObject>(0)->tensor;
    at::Tensor result = self->tensor.ger(vec2);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op ger do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &)");
}

jsi::Value greaterImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isScalar(0)) {
    auto other = args.asScalar(0);
    at::Tensor result = self->tensor.greater(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }

  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0)) {
    auto other = args.asHostObject<TensorHostObject>(0)->tensor;
    at::Tensor result = self->tensor.greater(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op greater do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Scalar &), at::Tensor (const at::Tensor &, const at::Tensor &)");
}

jsi::Value greaterEqualImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isScalar(0)) {
    auto other = args.asScalar(0);
    at::Tensor result = self->tensor.greater_equal(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }

  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0)) {
    auto other = args.asHostObject<TensorHostObject>(0)->tensor;
    at::Tensor result = self->tensor.greater_equal(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op greater_equal do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Scalar &), at::Tensor (const at::Tensor &, const at::Tensor &)");
}

jsi::Value gtImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isScalar(0)) {
    auto other = args.asScalar(0);
    at::Tensor result = self->tensor.gt(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }

  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0)) {
    auto other = args.asHostObject<TensorHostObject>(0)->tensor;
    at::Tensor result = self->tensor.gt(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op gt do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Scalar &), at::Tensor (const at::Tensor &, const at::Tensor &)");
}

jsi::Value hardshrinkImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0) && args.isScalarKwarg(0, "lambd", false)) {
    auto lambd = args.asScalarKwarg(0, "lambd", at::Scalar(0.5));
    at::Tensor result = self->tensor.hardshrink(lambd);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op hardshrink do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Scalar &)");
}

jsi::Value heavisideImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0)) {
    auto values = args.asHostObject<TensorHostObject>(0)->tensor;
    at::Tensor result = self->tensor.heaviside(values);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op heaviside do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &)");
}

jsi::Value histcImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0) && args.isInt64Kwarg(0, "bins", false) &&
      args.isScalarKwarg(0, "min", false) &&
      args.isScalarKwarg(0, "max", false)) {
    auto bins = args.asInt64Kwarg(0, "bins", 100);
    auto min = args.asScalarKwarg(0, "min", at::Scalar(0));
    auto max = args.asScalarKwarg(0, "max", at::Scalar(0));
    at::Tensor result = self->tensor.histc(bins, min, max);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op histc do not match any of the following signatures:at::Tensor (const at::Tensor &, int64_t, const at::Scalar &, const at::Scalar &)");
}

jsi::Value hypotImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0)) {
    auto other = args.asHostObject<TensorHostObject>(0)->tensor;
    at::Tensor result = self->tensor.hypot(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op hypot do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &)");
}

jsi::Value i0Impl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.i0();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op i0 do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value igammaImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0)) {
    auto other = args.asHostObject<TensorHostObject>(0)->tensor;
    at::Tensor result = self->tensor.igamma(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op igamma do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &)");
}

jsi::Value igammacImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0)) {
    auto other = args.asHostObject<TensorHostObject>(0)->tensor;
    at::Tensor result = self->tensor.igammac(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op igammac do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &)");
}

jsi::Value indicesImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.indices();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op indices do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value innerImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0)) {
    auto other = args.asHostObject<TensorHostObject>(0)->tensor;
    at::Tensor result = self->tensor.inner(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op inner do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &)");
}

jsi::Value intReprImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.int_repr();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op int_repr do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value inverseImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.inverse();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op inverse do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value isfiniteImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.isfinite();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op isfinite do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value isinfImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.isinf();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op isinf do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value isnanImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.isnan();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op isnan do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value isneginfImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.isneginf();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op isneginf do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value isposinfImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.isposinf();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op isposinf do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value isrealImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.isreal();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op isreal do not match any of the following signatures:at::Tensor (const at::Tensor &)");
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

jsi::Value kronImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0)) {
    auto other = args.asHostObject<TensorHostObject>(0)->tensor;
    at::Tensor result = self->tensor.kron(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op kron do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &)");
}

jsi::Value lcmImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0)) {
    auto other = args.asHostObject<TensorHostObject>(0)->tensor;
    at::Tensor result = self->tensor.lcm(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op lcm do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &)");
}

jsi::Value ldexpImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0)) {
    auto other = args.asHostObject<TensorHostObject>(0)->tensor;
    at::Tensor result = self->tensor.ldexp(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op ldexp do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &)");
}

jsi::Value leImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isScalar(0)) {
    auto other = args.asScalar(0);
    at::Tensor result = self->tensor.le(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }

  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0)) {
    auto other = args.asHostObject<TensorHostObject>(0)->tensor;
    at::Tensor result = self->tensor.le(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op le do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Scalar &), at::Tensor (const at::Tensor &, const at::Tensor &)");
}

jsi::Value lerpImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(2);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(2) && args.isHostObject<TensorHostObject>(0) &&
      args.isScalar(1)) {
    auto end = args.asHostObject<TensorHostObject>(0)->tensor;
    auto weight = args.asScalar(1);
    at::Tensor result = self->tensor.lerp(end, weight);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }

  if (args.atLeastNumArguments(2) && args.isHostObject<TensorHostObject>(0) &&
      args.isHostObject<TensorHostObject>(1)) {
    auto end = args.asHostObject<TensorHostObject>(0)->tensor;
    auto weight = args.asHostObject<TensorHostObject>(1)->tensor;
    at::Tensor result = self->tensor.lerp(end, weight);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op lerp do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &, const at::Scalar &), at::Tensor (const at::Tensor &, const at::Tensor &, const at::Tensor &)");
}

jsi::Value lessImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isScalar(0)) {
    auto other = args.asScalar(0);
    at::Tensor result = self->tensor.less(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }

  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0)) {
    auto other = args.asHostObject<TensorHostObject>(0)->tensor;
    at::Tensor result = self->tensor.less(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op less do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Scalar &), at::Tensor (const at::Tensor &, const at::Tensor &)");
}

jsi::Value lessEqualImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isScalar(0)) {
    auto other = args.asScalar(0);
    at::Tensor result = self->tensor.less_equal(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }

  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0)) {
    auto other = args.asHostObject<TensorHostObject>(0)->tensor;
    at::Tensor result = self->tensor.less_equal(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op less_equal do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Scalar &), at::Tensor (const at::Tensor &, const at::Tensor &)");
}

jsi::Value lgammaImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.lgamma();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op lgamma do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value logImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.log();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op log do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value log10Impl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.log10();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op log10 do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value log1pImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.log1p();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op log1p do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value log2Impl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.log2();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op log2 do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value logaddexpImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0)) {
    auto other = args.asHostObject<TensorHostObject>(0)->tensor;
    at::Tensor result = self->tensor.logaddexp(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op logaddexp do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &)");
}

jsi::Value logaddexp2Impl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0)) {
    auto other = args.asHostObject<TensorHostObject>(0)->tensor;
    at::Tensor result = self->tensor.logaddexp2(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op logaddexp2 do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &)");
}

jsi::Value logdetImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.logdet();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op logdet do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value logicalAndImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0)) {
    auto other = args.asHostObject<TensorHostObject>(0)->tensor;
    at::Tensor result = self->tensor.logical_and(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op logical_and do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &)");
}

jsi::Value logicalNotImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.logical_not();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op logical_not do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value logicalOrImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0)) {
    auto other = args.asHostObject<TensorHostObject>(0)->tensor;
    at::Tensor result = self->tensor.logical_or(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op logical_or do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &)");
}

jsi::Value logicalXorImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0)) {
    auto other = args.asHostObject<TensorHostObject>(0)->tensor;
    at::Tensor result = self->tensor.logical_xor(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op logical_xor do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &)");
}

jsi::Value ltImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isScalar(0)) {
    auto other = args.asScalar(0);
    at::Tensor result = self->tensor.lt(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }

  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0)) {
    auto other = args.asHostObject<TensorHostObject>(0)->tensor;
    at::Tensor result = self->tensor.lt(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op lt do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Scalar &), at::Tensor (const at::Tensor &, const at::Tensor &)");
}

jsi::Value luSolveImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(2);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(2) && args.isHostObject<TensorHostObject>(0) &&
      args.isHostObject<TensorHostObject>(1)) {
    auto LUData = args.asHostObject<TensorHostObject>(0)->tensor;
    auto LUPivots = args.asHostObject<TensorHostObject>(1)->tensor;
    at::Tensor result = self->tensor.lu_solve(LUData, LUPivots);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op lu_solve do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &, const at::Tensor &)");
}

jsi::Value mHImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.mH();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op mH do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value mTImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.mT();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op mT do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value maskedFillImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(2);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(2) && args.isHostObject<TensorHostObject>(0) &&
      args.isScalar(1)) {
    auto mask = args.asHostObject<TensorHostObject>(0)->tensor;
    auto value = args.asScalar(1);
    at::Tensor result = self->tensor.masked_fill(mask, value);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }

  if (args.atLeastNumArguments(2) && args.isHostObject<TensorHostObject>(0) &&
      args.isHostObject<TensorHostObject>(1)) {
    auto mask = args.asHostObject<TensorHostObject>(0)->tensor;
    auto value = args.asHostObject<TensorHostObject>(1)->tensor;
    at::Tensor result = self->tensor.masked_fill(mask, value);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op masked_fill do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &, const at::Scalar &), at::Tensor (const at::Tensor &, const at::Tensor &, const at::Tensor &)");
}

jsi::Value maskedScatterImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(2);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(2) && args.isHostObject<TensorHostObject>(0) &&
      args.isHostObject<TensorHostObject>(1)) {
    auto mask = args.asHostObject<TensorHostObject>(0)->tensor;
    auto source = args.asHostObject<TensorHostObject>(1)->tensor;
    at::Tensor result = self->tensor.masked_scatter(mask, source);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op masked_scatter do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &, const at::Tensor &)");
}

jsi::Value maskedSelectImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0)) {
    auto mask = args.asHostObject<TensorHostObject>(0)->tensor;
    at::Tensor result = self->tensor.masked_select(mask);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op masked_select do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &)");
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

jsi::Value matrixExpImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.matrix_exp();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op matrix_exp do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value matrixHImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.matrix_H();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op matrix_H do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value matrixPowerImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isInt64(0)) {
    auto n = args.asInt64(0);
    at::Tensor result = self->tensor.matrix_power(n);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op matrix_power do not match any of the following signatures:at::Tensor (const at::Tensor &, int64_t)");
}

jsi::Value maximumImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0)) {
    auto other = args.asHostObject<TensorHostObject>(0)->tensor;
    at::Tensor result = self->tensor.maximum(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op maximum do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &)");
}

jsi::Value minimumImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0)) {
    auto other = args.asHostObject<TensorHostObject>(0)->tensor;
    at::Tensor result = self->tensor.minimum(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op minimum do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &)");
}

jsi::Value mmImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0)) {
    auto mat2 = args.asHostObject<TensorHostObject>(0)->tensor;
    at::Tensor result = self->tensor.mm(mat2);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op mm do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &)");
}

jsi::Value moveaxisImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(2);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(2) && args.isIntArrayRef(0) &&
      args.isIntArrayRef(1)) {
    auto sourcePointer = args.asIntArrayRefPtr(0);
    auto source = c10::ArrayRef(*sourcePointer);
    auto destinationPointer = args.asIntArrayRefPtr(1);
    auto destination = c10::ArrayRef(*destinationPointer);
    at::Tensor result = self->tensor.moveaxis(source, destination);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }

  if (args.atLeastNumArguments(2) && args.isInt64(0) && args.isInt64(1)) {
    auto source = args.asInt64(0);
    auto destination = args.asInt64(1);
    at::Tensor result = self->tensor.moveaxis(source, destination);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op moveaxis do not match any of the following signatures:at::Tensor (const at::Tensor &, at::IntArrayRef, at::IntArrayRef), at::Tensor (const at::Tensor &, int64_t, int64_t)");
}

jsi::Value movedimImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(2);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(2) && args.isIntArrayRef(0) &&
      args.isIntArrayRef(1)) {
    auto sourcePointer = args.asIntArrayRefPtr(0);
    auto source = c10::ArrayRef(*sourcePointer);
    auto destinationPointer = args.asIntArrayRefPtr(1);
    auto destination = c10::ArrayRef(*destinationPointer);
    at::Tensor result = self->tensor.movedim(source, destination);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }

  if (args.atLeastNumArguments(2) && args.isInt64(0) && args.isInt64(1)) {
    auto source = args.asInt64(0);
    auto destination = args.asInt64(1);
    at::Tensor result = self->tensor.movedim(source, destination);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op movedim do not match any of the following signatures:at::Tensor (const at::Tensor &, at::IntArrayRef, at::IntArrayRef), at::Tensor (const at::Tensor &, int64_t, int64_t)");
}

jsi::Value msortImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.msort();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op msort do not match any of the following signatures:at::Tensor (const at::Tensor &)");
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

jsi::Value multiplyImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0)) {
    auto other = args.asHostObject<TensorHostObject>(0)->tensor;
    at::Tensor result = self->tensor.multiply(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }

  if (args.atLeastNumArguments(1) && args.isScalar(0)) {
    auto other = args.asScalar(0);
    at::Tensor result = self->tensor.multiply(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op multiply do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &), at::Tensor (const at::Tensor &, const at::Scalar &)");
}

jsi::Value mvImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0)) {
    auto vec = args.asHostObject<TensorHostObject>(0)->tensor;
    at::Tensor result = self->tensor.mv(vec);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op mv do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &)");
}

jsi::Value mvlgammaImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isInt64(0)) {
    auto p = args.asInt64(0);
    at::Tensor result = self->tensor.mvlgamma(p);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op mvlgamma do not match any of the following signatures:at::Tensor (const at::Tensor &, int64_t)");
}

jsi::Value narrowImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(3);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(3) && args.isInt64(0) && args.isInt64(1) &&
      args.isInt64(2)) {
    auto dim = args.asInt64(0);
    auto start = args.asInt64(1);
    auto length = args.asInt64(2);
    at::Tensor result = self->tensor.narrow(dim, start, length);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }

  if (args.atLeastNumArguments(3) && args.isInt64(0) &&
      args.isHostObject<TensorHostObject>(1) && args.isInt64(2)) {
    auto dim = args.asInt64(0);
    auto start = args.asHostObject<TensorHostObject>(1)->tensor;
    auto length = args.asInt64(2);
    at::Tensor result = self->tensor.narrow(dim, start, length);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op narrow do not match any of the following signatures:at::Tensor (const at::Tensor &, int64_t, int64_t, int64_t), at::Tensor (const at::Tensor &, int64_t, const at::Tensor &, int64_t)");
}

jsi::Value narrowCopyImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(3);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(3) && args.isInt64(0) && args.isInt64(1) &&
      args.isInt64(2)) {
    auto dim = args.asInt64(0);
    auto start = args.asInt64(1);
    auto length = args.asInt64(2);
    at::Tensor result = self->tensor.narrow_copy(dim, start, length);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op narrow_copy do not match any of the following signatures:at::Tensor (const at::Tensor &, int64_t, int64_t, int64_t)");
}

jsi::Value neImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isScalar(0)) {
    auto other = args.asScalar(0);
    at::Tensor result = self->tensor.ne(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }

  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0)) {
    auto other = args.asHostObject<TensorHostObject>(0)->tensor;
    at::Tensor result = self->tensor.ne(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op ne do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Scalar &), at::Tensor (const at::Tensor &, const at::Tensor &)");
}

jsi::Value negImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.neg();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op neg do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value negativeImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.negative();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op negative do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value nextafterImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0)) {
    auto other = args.asHostObject<TensorHostObject>(0)->tensor;
    at::Tensor result = self->tensor.nextafter(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op nextafter do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &)");
}

jsi::Value nonzeroImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.nonzero();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op nonzero do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value notEqualImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isScalar(0)) {
    auto other = args.asScalar(0);
    at::Tensor result = self->tensor.not_equal(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }

  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0)) {
    auto other = args.asHostObject<TensorHostObject>(0)->tensor;
    at::Tensor result = self->tensor.not_equal(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op not_equal do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Scalar &), at::Tensor (const at::Tensor &, const at::Tensor &)");
}

jsi::Value numpyTImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.numpy_T();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op numpy_T do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value orgqrImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0)) {
    auto input2 = args.asHostObject<TensorHostObject>(0)->tensor;
    at::Tensor result = self->tensor.orgqr(input2);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op orgqr do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &)");
}

jsi::Value ormqrImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(2);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(2) && args.isHostObject<TensorHostObject>(0) &&
      args.isHostObject<TensorHostObject>(1) &&
      args.isBoolKwarg(2, "left", false) &&
      args.isBoolKwarg(2, "transpose", false)) {
    auto input2 = args.asHostObject<TensorHostObject>(0)->tensor;
    auto input3 = args.asHostObject<TensorHostObject>(1)->tensor;
    auto left = args.asBoolKwarg(2, "left", true);
    auto transpose = args.asBoolKwarg(2, "transpose", false);
    at::Tensor result = self->tensor.ormqr(input2, input3, left, transpose);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op ormqr do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &, const at::Tensor &, bool, bool)");
}

jsi::Value outerImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0)) {
    auto vec2 = args.asHostObject<TensorHostObject>(0)->tensor;
    at::Tensor result = self->tensor.outer(vec2);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op outer do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &)");
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

jsi::Value positiveImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.positive();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op positive do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value powImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0)) {
    auto exponent = args.asHostObject<TensorHostObject>(0)->tensor;
    at::Tensor result = self->tensor.pow(exponent);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }

  if (args.atLeastNumArguments(1) && args.isScalar(0)) {
    auto exponent = args.asScalar(0);
    at::Tensor result = self->tensor.pow(exponent);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op pow do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &), at::Tensor (const at::Tensor &, const at::Scalar &)");
}

jsi::Value preluImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0)) {
    auto weight = args.asHostObject<TensorHostObject>(0)->tensor;
    at::Tensor result = self->tensor.prelu(weight);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op prelu do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &)");
}

jsi::Value putImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(2);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(2) && args.isHostObject<TensorHostObject>(0) &&
      args.isHostObject<TensorHostObject>(1) &&
      args.isBoolKwarg(2, "accumulate", false)) {
    auto index = args.asHostObject<TensorHostObject>(0)->tensor;
    auto source = args.asHostObject<TensorHostObject>(1)->tensor;
    auto accumulate = args.asBoolKwarg(2, "accumulate", false);
    at::Tensor result = self->tensor.put(index, source, accumulate);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op put do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &, const at::Tensor &, bool)");
}

jsi::Value qPerChannelScalesImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.q_per_channel_scales();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op q_per_channel_scales do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value qPerChannelZeroPointsImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.q_per_channel_zero_points();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op q_per_channel_zero_points do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value qrImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0) && args.isBoolKwarg(0, "some", false)) {
    auto some = args.asBoolKwarg(0, "some", true);

    ::std::tuple<at::Tensor, at::Tensor> intermediateTuple =
        self->tensor.qr(some);
    auto QTensor = std::get<0>(intermediateTuple);
    if (QTensor.dtype() == utils::constants::getDtypeFromString("int64")) {
      QTensor = QTensor.to(c10::ScalarType::Int);
    }
    auto Q = utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, QTensor);
    auto RTensor = std::get<1>(intermediateTuple);
    if (RTensor.dtype() == utils::constants::getDtypeFromString("int64")) {
      RTensor = RTensor.to(c10::ScalarType::Int);
    }
    auto R = utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, RTensor);
    return jsi::Array::createWithElements(runtime, Q, R);
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op qr do not match any of the following signatures:::std::tuple<at::Tensor,at::Tensor> (const at::Tensor &, bool)");
}

jsi::Value rad2degImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.rad2deg();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op rad2deg do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value ravelImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.ravel();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op ravel do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value reciprocalImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.reciprocal();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op reciprocal do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value reluImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.relu();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op relu do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value remainderImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isScalar(0)) {
    auto other = args.asScalar(0);
    at::Tensor result = self->tensor.remainder(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }

  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0)) {
    auto other = args.asHostObject<TensorHostObject>(0)->tensor;
    at::Tensor result = self->tensor.remainder(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op remainder do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Scalar &), at::Tensor (const at::Tensor &, const at::Tensor &)");
}

jsi::Value renormImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(3);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(3) && args.isScalar(0) && args.isInt64(1) &&
      args.isScalar(2)) {
    auto p = args.asScalar(0);
    auto dim = args.asInt64(1);
    auto maxnorm = args.asScalar(2);
    at::Tensor result = self->tensor.renorm(p, dim, maxnorm);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op renorm do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Scalar &, int64_t, const at::Scalar &)");
}

jsi::Value repeatImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isIntArrayRef(0)) {
    auto repeatsPointer = args.asIntArrayRefPtr(0);
    auto repeats = c10::ArrayRef(*repeatsPointer);
    at::Tensor result = self->tensor.repeat(repeats);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op repeat do not match any of the following signatures:at::Tensor (const at::Tensor &, at::IntArrayRef)");
}

jsi::Value repeatInterleaveImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0) &&
      args.isC10OptionalInt64Kwarg(1, "dim", false) &&
      args.isC10OptionalInt64Kwarg(1, "outputSize", false)) {
    auto repeats = args.asHostObject<TensorHostObject>(0)->tensor;
    auto dim = args.asC10OptionalInt64Kwarg(1, "dim", c10::nullopt);
    auto outputSize =
        args.asC10OptionalInt64Kwarg(1, "outputSize", c10::nullopt);
    at::Tensor result =
        self->tensor.repeat_interleave(repeats, dim, outputSize);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }

  if (args.atLeastNumArguments(1) && args.isInt64(0) &&
      args.isC10OptionalInt64Kwarg(1, "dim", false) &&
      args.isC10OptionalInt64Kwarg(1, "outputSize", false)) {
    auto repeats = args.asInt64(0);
    auto dim = args.asC10OptionalInt64Kwarg(1, "dim", c10::nullopt);
    auto outputSize =
        args.asC10OptionalInt64Kwarg(1, "outputSize", c10::nullopt);
    at::Tensor result =
        self->tensor.repeat_interleave(repeats, dim, outputSize);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op repeat_interleave do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &, c10::optional<int64_t>, c10::optional<int64_t>), at::Tensor (const at::Tensor &, int64_t, c10::optional<int64_t>, c10::optional<int64_t>)");
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

jsi::Value reshapeAsImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0)) {
    auto other = args.asHostObject<TensorHostObject>(0)->tensor;
    at::Tensor result = self->tensor.reshape_as(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op reshape_as do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &)");
}

jsi::Value resolveConjImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.resolve_conj();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op resolve_conj do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value resolveNegImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.resolve_neg();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op resolve_neg do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value rowIndicesImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.row_indices();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op row_indices do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value rsqrtImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.rsqrt();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op rsqrt do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value selectScatterImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(3);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(3) && args.isHostObject<TensorHostObject>(0) &&
      args.isInt64(1) && args.isInt64(2)) {
    auto src = args.asHostObject<TensorHostObject>(0)->tensor;
    auto dim = args.asInt64(1);
    auto index = args.asInt64(2);
    at::Tensor result = self->tensor.select_scatter(src, dim, index);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op select_scatter do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &, int64_t, int64_t)");
}

jsi::Value sgnImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.sgn();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op sgn do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value sigmoidImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.sigmoid();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op sigmoid do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value signImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.sign();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op sign do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value signbitImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.signbit();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op signbit do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value sinImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.sin();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op sin do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value sincImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.sinc();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op sinc do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value sinhImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.sinh();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op sinh do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value sliceImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0) && args.isInt64Kwarg(0, "dim", false) &&
      args.isC10OptionalInt64Kwarg(0, "start", false) &&
      args.isC10OptionalInt64Kwarg(0, "end", false) &&
      args.isInt64Kwarg(0, "step", false)) {
    auto dim = args.asInt64Kwarg(0, "dim", 0);
    auto start = args.asC10OptionalInt64Kwarg(0, "start", c10::nullopt);
    auto end = args.asC10OptionalInt64Kwarg(0, "end", c10::nullopt);
    auto step = args.asInt64Kwarg(0, "step", 1);
    at::Tensor result = self->tensor.slice(dim, start, end, step);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op slice do not match any of the following signatures:at::Tensor (const at::Tensor &, int64_t, c10::optional<int64_t>, c10::optional<int64_t>, int64_t)");
}

jsi::Value sliceScatterImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0) &&
      args.isInt64Kwarg(1, "dim", false) &&
      args.isC10OptionalInt64Kwarg(1, "start", false) &&
      args.isC10OptionalInt64Kwarg(1, "end", false) &&
      args.isInt64Kwarg(1, "step", false)) {
    auto src = args.asHostObject<TensorHostObject>(0)->tensor;
    auto dim = args.asInt64Kwarg(1, "dim", 0);
    auto start = args.asC10OptionalInt64Kwarg(1, "start", c10::nullopt);
    auto end = args.asC10OptionalInt64Kwarg(1, "end", c10::nullopt);
    auto step = args.asInt64Kwarg(1, "step", 1);
    at::Tensor result = self->tensor.slice_scatter(src, dim, start, end, step);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op slice_scatter do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &, int64_t, c10::optional<int64_t>, c10::optional<int64_t>, int64_t)");
}

jsi::Value slogdetImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    ::std::tuple<at::Tensor, at::Tensor> intermediateTuple =
        self->tensor.slogdet();
    auto signTensor = std::get<0>(intermediateTuple);
    if (signTensor.dtype() == utils::constants::getDtypeFromString("int64")) {
      signTensor = signTensor.to(c10::ScalarType::Int);
    }
    auto sign = utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, signTensor);
    auto logabsdetTensor = std::get<1>(intermediateTuple);
    if (logabsdetTensor.dtype() ==
        utils::constants::getDtypeFromString("int64")) {
      logabsdetTensor = logabsdetTensor.to(c10::ScalarType::Int);
    }
    auto logabsdet = utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, logabsdetTensor);
    return jsi::Array::createWithElements(runtime, sign, logabsdet);
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op slogdet do not match any of the following signatures:::std::tuple<at::Tensor,at::Tensor> (const at::Tensor &)");
}

jsi::Value smmImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0)) {
    auto mat2 = args.asHostObject<TensorHostObject>(0)->tensor;
    at::Tensor result = self->tensor.smm(mat2);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op smm do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &)");
}

jsi::Value softmaxImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (false) {
    auto dim = args.asInt64(0);
    throw facebook::jsi::JSError(
        runtime,
        "Argument parsing for type c10::optional<at::ScalarType> has not been implemented yet");
  }

  if (false) {
    throw facebook::jsi::JSError(
        runtime,
        "Argument parsing for type at::Dimname has not been implemented yet");
    throw facebook::jsi::JSError(
        runtime,
        "Argument parsing for type c10::optional<at::ScalarType> has not been implemented yet");
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op softmax do not match any of the following signatures:at::Tensor (const at::Tensor &, int64_t, c10::optional<at::ScalarType>), at::Tensor (const at::Tensor &, at::Dimname, c10::optional<at::ScalarType>)");
}

jsi::Value sparseMaskImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0)) {
    auto mask = args.asHostObject<TensorHostObject>(0)->tensor;
    at::Tensor result = self->tensor.sparse_mask(mask);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op sparse_mask do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &)");
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

jsi::Value squareImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.square();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op square do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value squeezeImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isInt64(0)) {
    auto dim = args.asInt64(0);
    at::Tensor result = self->tensor.squeeze(dim);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }

  if (false) {
    throw facebook::jsi::JSError(
        runtime,
        "Argument parsing for type at::Dimname has not been implemented yet");
  }

  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.squeeze();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op squeeze do not match any of the following signatures:at::Tensor (const at::Tensor &, int64_t), at::Tensor (const at::Tensor &, at::Dimname), at::Tensor (const at::Tensor &)");
}

jsi::Value sspaddmmImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(2);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(2) && args.isHostObject<TensorHostObject>(0) &&
      args.isHostObject<TensorHostObject>(1) &&
      args.isScalarKwarg(2, "beta", false) &&
      args.isScalarKwarg(2, "alpha", false)) {
    auto mat1 = args.asHostObject<TensorHostObject>(0)->tensor;
    auto mat2 = args.asHostObject<TensorHostObject>(1)->tensor;
    auto beta = args.asScalarKwarg(2, "beta", at::Scalar(1));
    auto alpha = args.asScalarKwarg(2, "alpha", at::Scalar(1));
    at::Tensor result = self->tensor.sspaddmm(mat1, mat2, beta, alpha);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op sspaddmm do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &, const at::Tensor &, const at::Scalar &, const at::Scalar &)");
}

jsi::Value strideImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (false) {
    throw facebook::jsi::JSError(
        runtime,
        "Argument parsing for type at::Dimname has not been implemented yet");
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op stride do not match any of the following signatures:int64_t (const at::Tensor &, at::Dimname)");
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

jsi::Value subtractImpl(
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
    at::Tensor result = self->tensor.subtract(other, alpha);
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
    at::Tensor result = self->tensor.subtract(other, alpha);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op subtract do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &, const at::Scalar &), at::Tensor (const at::Tensor &, const at::Scalar &, const at::Scalar &)");
}

jsi::Value sumImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (false) {
    throw facebook::jsi::JSError(
        runtime,
        "Argument parsing for type at::OptionalIntArrayRef has not been implemented yet");
    auto keepdim = args.asBoolKwarg(1, "keepdim", false);
    throw facebook::jsi::JSError(
        runtime,
        "Argument parsing for type c10::optional<at::ScalarType> has not been implemented yet");
  }

  if (false) {
    throw facebook::jsi::JSError(
        runtime,
        "Argument parsing for type at::DimnameList has not been implemented yet");
    auto keepdim = args.asBoolKwarg(1, "keepdim", false);
    throw facebook::jsi::JSError(
        runtime,
        "Argument parsing for type c10::optional<at::ScalarType> has not been implemented yet");
  }

  if (false) {
    throw facebook::jsi::JSError(
        runtime,
        "Argument parsing for type c10::optional<at::ScalarType> has not been implemented yet");
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op sum do not match any of the following signatures:at::Tensor (const at::Tensor &, at::OptionalIntArrayRef, bool, c10::optional<at::ScalarType>), at::Tensor (const at::Tensor &, at::DimnameList, bool, c10::optional<at::ScalarType>), at::Tensor (const at::Tensor &, c10::optional<at::ScalarType>)");
}

jsi::Value sumToSizeImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isIntArrayRef(0)) {
    auto sizePointer = args.asIntArrayRefPtr(0);
    auto size = c10::ArrayRef(*sizePointer);
    at::Tensor result = self->tensor.sum_to_size(size);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op sum_to_size do not match any of the following signatures:at::Tensor (const at::Tensor &, at::IntArrayRef)");
}

jsi::Value swapaxesImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(2);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(2) && args.isInt64(0) && args.isInt64(1)) {
    auto axis0 = args.asInt64(0);
    auto axis1 = args.asInt64(1);
    at::Tensor result = self->tensor.swapaxes(axis0, axis1);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op swapaxes do not match any of the following signatures:at::Tensor (const at::Tensor &, int64_t, int64_t)");
}

jsi::Value swapdimsImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(2);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(2) && args.isInt64(0) && args.isInt64(1)) {
    auto dim0 = args.asInt64(0);
    auto dim1 = args.asInt64(1);
    at::Tensor result = self->tensor.swapdims(dim0, dim1);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op swapdims do not match any of the following signatures:at::Tensor (const at::Tensor &, int64_t, int64_t)");
}

jsi::Value symeigImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0) &&
      args.isBoolKwarg(0, "eigenvectors", false) &&
      args.isBoolKwarg(0, "upper", false)) {
    auto eigenvectors = args.asBoolKwarg(0, "eigenvectors", false);
    auto upper = args.asBoolKwarg(0, "upper", true);

    ::std::tuple<at::Tensor, at::Tensor> intermediateTuple =
        self->tensor.symeig(eigenvectors, upper);
    auto eigenvaluesTensor = std::get<0>(intermediateTuple);
    if (eigenvaluesTensor.dtype() ==
        utils::constants::getDtypeFromString("int64")) {
      eigenvaluesTensor = eigenvaluesTensor.to(c10::ScalarType::Int);
    }
    auto eigenvalues = utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, eigenvaluesTensor);
    auto eigenvectors_returnTensor = std::get<1>(intermediateTuple);
    if (eigenvectors_returnTensor.dtype() ==
        utils::constants::getDtypeFromString("int64")) {
      eigenvectors_returnTensor =
          eigenvectors_returnTensor.to(c10::ScalarType::Int);
    }
    auto eigenvectors_return =
        utils::helpers::createFromHostObject<TensorHostObject>(
            runtime, eigenvectors_returnTensor);
    return jsi::Array::createWithElements(
        runtime, eigenvalues, eigenvectors_return);
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op symeig do not match any of the following signatures:::std::tuple<at::Tensor,at::Tensor> (const at::Tensor &, bool, bool)");
}

jsi::Value tImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.t();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op t do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value takeImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0)) {
    auto index = args.asHostObject<TensorHostObject>(0)->tensor;
    at::Tensor result = self->tensor.take(index);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op take do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &)");
}

jsi::Value takeAlongDimImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0) &&
      args.isC10OptionalInt64Kwarg(1, "dim", false)) {
    auto indices = args.asHostObject<TensorHostObject>(0)->tensor;
    auto dim = args.asC10OptionalInt64Kwarg(1, "dim", c10::nullopt);
    at::Tensor result = self->tensor.take_along_dim(indices, dim);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op take_along_dim do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &, c10::optional<int64_t>)");
}

jsi::Value tanImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.tan();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op tan do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value tanhImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.tanh();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op tanh do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value tileImpl(
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
    at::Tensor result = self->tensor.tile(dims);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op tile do not match any of the following signatures:at::Tensor (const at::Tensor &, at::IntArrayRef)");
}

jsi::Value toImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (false) {
    throw facebook::jsi::JSError(
        runtime,
        "Argument parsing for type at::Device has not been implemented yet");
    throw facebook::jsi::JSError(
        runtime,
        "Argument parsing for type at::ScalarType has not been implemented yet");
    auto nonBlocking = args.asBoolKwarg(2, "nonBlocking", false);
    auto copy = args.asBoolKwarg(2, "copy", false);
    throw facebook::jsi::JSError(
        runtime,
        "Argument parsing for type c10::optional<at::MemoryFormat> has not been implemented yet");
  }

  if (false) {
    throw facebook::jsi::JSError(
        runtime,
        "Argument parsing for type at::ScalarType has not been implemented yet");
    auto nonBlocking = args.asBoolKwarg(1, "nonBlocking", false);
    auto copy = args.asBoolKwarg(1, "copy", false);
    throw facebook::jsi::JSError(
        runtime,
        "Argument parsing for type c10::optional<at::MemoryFormat> has not been implemented yet");
  }

  if (false) {
    auto other = args.asHostObject<TensorHostObject>(0)->tensor;
    auto nonBlocking = args.asBoolKwarg(1, "nonBlocking", false);
    auto copy = args.asBoolKwarg(1, "copy", false);
    throw facebook::jsi::JSError(
        runtime,
        "Argument parsing for type c10::optional<at::MemoryFormat> has not been implemented yet");
  }

  if (false) {
    throw facebook::jsi::JSError(
        runtime,
        "Argument parsing for type c10::optional<at::ScalarType> has not been implemented yet");
    throw facebook::jsi::JSError(
        runtime,
        "Argument parsing for type c10::optional<at::Layout> has not been implemented yet");
    throw facebook::jsi::JSError(
        runtime,
        "Argument parsing for type c10::optional<at::Device> has not been implemented yet");
    throw facebook::jsi::JSError(
        runtime,
        "Argument parsing for type c10::optional<bool> has not been implemented yet");
    auto nonBlocking = args.asBoolKwarg(0, "nonBlocking", false);
    auto copy = args.asBoolKwarg(0, "copy", false);
    throw facebook::jsi::JSError(
        runtime,
        "Argument parsing for type c10::optional<at::MemoryFormat> has not been implemented yet");
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op to do not match any of the following signatures:at::Tensor (const at::Tensor &, at::Device, at::ScalarType, bool, bool, c10::optional<at::MemoryFormat>), at::Tensor (const at::Tensor &, at::ScalarType, bool, bool, c10::optional<at::MemoryFormat>), at::Tensor (const at::Tensor &, const at::Tensor &, bool, bool, c10::optional<at::MemoryFormat>), at::Tensor (const at::Tensor &, c10::optional<at::ScalarType>, c10::optional<at::Layout>, c10::optional<at::Device>, c10::optional<bool>, bool, bool, c10::optional<at::MemoryFormat>)");
}

jsi::Value toSparseImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isInt64(0)) {
    auto sparseDim = args.asInt64(0);
    at::Tensor result = self->tensor.to_sparse(sparseDim);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }

  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.to_sparse();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op to_sparse do not match any of the following signatures:at::Tensor (const at::Tensor &, int64_t), at::Tensor (const at::Tensor &)");
}

jsi::Value toSparseBscImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isIntArrayRef(0)) {
    auto blocksizePointer = args.asIntArrayRefPtr(0);
    auto blocksize = c10::ArrayRef(*blocksizePointer);
    at::Tensor result = self->tensor.to_sparse_bsc(blocksize);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op to_sparse_bsc do not match any of the following signatures:at::Tensor (const at::Tensor &, at::IntArrayRef)");
}

jsi::Value toSparseBsrImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isIntArrayRef(0)) {
    auto blocksizePointer = args.asIntArrayRefPtr(0);
    auto blocksize = c10::ArrayRef(*blocksizePointer);
    at::Tensor result = self->tensor.to_sparse_bsr(blocksize);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op to_sparse_bsr do not match any of the following signatures:at::Tensor (const at::Tensor &, at::IntArrayRef)");
}

jsi::Value toSparseCscImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.to_sparse_csc();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op to_sparse_csc do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value toSparseCsrImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.to_sparse_csr();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op to_sparse_csr do not match any of the following signatures:at::Tensor (const at::Tensor &)");
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

jsi::Value traceImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.trace();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op trace do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value triangularSolveImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0) &&
      args.isBoolKwarg(1, "upper", false) &&
      args.isBoolKwarg(1, "transpose", false) &&
      args.isBoolKwarg(1, "unitriangular", false)) {
    auto A = args.asHostObject<TensorHostObject>(0)->tensor;
    auto upper = args.asBoolKwarg(1, "upper", true);
    auto transpose = args.asBoolKwarg(1, "transpose", false);
    auto unitriangular = args.asBoolKwarg(1, "unitriangular", false);

    ::std::tuple<at::Tensor, at::Tensor> intermediateTuple =
        self->tensor.triangular_solve(A, upper, transpose, unitriangular);
    auto solutionTensor = std::get<0>(intermediateTuple);
    if (solutionTensor.dtype() ==
        utils::constants::getDtypeFromString("int64")) {
      solutionTensor = solutionTensor.to(c10::ScalarType::Int);
    }
    auto solution = utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, solutionTensor);
    auto cloned_coefficientTensor = std::get<1>(intermediateTuple);
    if (cloned_coefficientTensor.dtype() ==
        utils::constants::getDtypeFromString("int64")) {
      cloned_coefficientTensor =
          cloned_coefficientTensor.to(c10::ScalarType::Int);
    }
    auto cloned_coefficient =
        utils::helpers::createFromHostObject<TensorHostObject>(
            runtime, cloned_coefficientTensor);
    return jsi::Array::createWithElements(
        runtime, solution, cloned_coefficient);
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op triangular_solve do not match any of the following signatures:::std::tuple<at::Tensor,at::Tensor> (const at::Tensor &, const at::Tensor &, bool, bool, bool)");
}

jsi::Value trilImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0) && args.isInt64Kwarg(0, "diagonal", false)) {
    auto diagonal = args.asInt64Kwarg(0, "diagonal", 0);
    at::Tensor result = self->tensor.tril(diagonal);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op tril do not match any of the following signatures:at::Tensor (const at::Tensor &, int64_t)");
}

jsi::Value triuImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0) && args.isInt64Kwarg(0, "diagonal", false)) {
    auto diagonal = args.asInt64Kwarg(0, "diagonal", 0);
    at::Tensor result = self->tensor.triu(diagonal);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op triu do not match any of the following signatures:at::Tensor (const at::Tensor &, int64_t)");
}

jsi::Value trueDivideImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0)) {
    auto other = args.asHostObject<TensorHostObject>(0)->tensor;
    at::Tensor result = self->tensor.true_divide(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }

  if (args.atLeastNumArguments(1) && args.isScalar(0)) {
    auto other = args.asScalar(0);
    at::Tensor result = self->tensor.true_divide(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op true_divide do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &), at::Tensor (const at::Tensor &, const at::Scalar &)");
}

jsi::Value truncImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.trunc();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op trunc do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value typeAsImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0)) {
    auto other = args.asHostObject<TensorHostObject>(0)->tensor;
    at::Tensor result = self->tensor.type_as(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op type_as do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &)");
}

jsi::Value unfoldImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(3);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(3) && args.isInt64(0) && args.isInt64(1) &&
      args.isInt64(2)) {
    auto dimension = args.asInt64(0);
    auto size = args.asInt64(1);
    auto step = args.asInt64(2);
    at::Tensor result = self->tensor.unfold(dimension, size, step);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op unfold do not match any of the following signatures:at::Tensor (const at::Tensor &, int64_t, int64_t, int64_t)");
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

jsi::Value valuesImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(0);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(0)) {
    at::Tensor result = self->tensor.values();
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op values do not match any of the following signatures:at::Tensor (const at::Tensor &)");
}

jsi::Value vdotImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0)) {
    auto other = args.asHostObject<TensorHostObject>(0)->tensor;
    at::Tensor result = self->tensor.vdot(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op vdot do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &)");
}

jsi::Value viewAsImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0)) {
    auto other = args.asHostObject<TensorHostObject>(0)->tensor;
    at::Tensor result = self->tensor.view_as(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op view_as do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &)");
}

jsi::Value xlogyImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto self = args.thisAsHostObject<TensorHostObject>();
  if (args.atLeastNumArguments(1) && args.isHostObject<TensorHostObject>(0)) {
    auto other = args.asHostObject<TensorHostObject>(0)->tensor;
    at::Tensor result = self->tensor.xlogy(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }

  if (args.atLeastNumArguments(1) && args.isScalar(0)) {
    auto other = args.asScalar(0);
    at::Tensor result = self->tensor.xlogy(other);
    if (result.dtype() == utils::constants::getDtypeFromString("int64")) {
      result = result.to(c10::ScalarType::Int);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(result));
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op xlogy do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &), at::Tensor (const at::Tensor &, const at::Scalar &)");
}

} // namespace

TensorHostObject::TensorHostObject(jsi::Runtime& runtime, torch_::Tensor t)
    : BaseHostObject(runtime),
      size_(createSize(runtime)),
      toString_(createToString(runtime)),
      tensor(t) {
  setPropertyHostFunction(runtime, "_And_", 1, _And_Impl);

  setPropertyHostFunction(runtime, "_Lshift_", 1, _Lshift_Impl);
  setPropertyHostFunction(runtime, "_Or_", 1, _Or_Impl);
  setPropertyHostFunction(runtime, "_Rshift_", 1, _Rshift_Impl);
  setPropertyHostFunction(runtime, "_Xor_", 1, _Xor_Impl);
  setPropertyHostFunction(runtime, "_addmmActivation", 2, _addmmActivationImpl);

  setPropertyHostFunction(runtime, "_conj", 0, _conjImpl);
  setPropertyHostFunction(runtime, "_conjPhysical", 0, _conjPhysicalImpl);

  setPropertyHostFunction(runtime, "_fwPrimal", 1, _fwPrimalImpl);
  setPropertyHostFunction(runtime, "_indices", 0, _indicesImpl);

  setPropertyHostFunction(runtime, "_negView", 0, _negViewImpl);

  setPropertyHostFunction(
      runtime, "_nestedTensorSize", 0, _nestedTensorSizeImpl);
  setPropertyHostFunction(
      runtime, "_nestedTensorStrides", 0, _nestedTensorStridesImpl);

  setPropertyHostFunction(runtime, "_reshapeAlias", 2, _reshapeAliasImpl);

  setPropertyHostFunction(runtime, "_values", 0, _valuesImpl);

  setPropertyHostFunction(runtime, "abs", 0, absImpl);

  setPropertyHostFunction(runtime, "absolute", 0, absoluteImpl);

  setPropertyHostFunction(runtime, "acos", 0, acosImpl);

  setPropertyHostFunction(runtime, "acosh", 0, acoshImpl);

  setPropertyHostFunction(runtime, "add", 1, addImpl);

  setPropertyHostFunction(runtime, "addbmm", 2, addbmmImpl);

  setPropertyHostFunction(runtime, "addcdiv", 2, addcdivImpl);

  setPropertyHostFunction(runtime, "addcmul", 2, addcmulImpl);

  setPropertyHostFunction(runtime, "addmm", 2, addmmImpl);

  setPropertyHostFunction(runtime, "addmv", 2, addmvImpl);

  setPropertyHostFunction(runtime, "addr", 2, addrImpl);

  setPropertyHostFunction(runtime, "adjoint", 0, adjointImpl);
  setPropertyHostFunction(runtime, "alias", 0, aliasImpl);
  setPropertyHostFunction(runtime, "alignAs", 1, alignAsImpl);

  setPropertyHostFunction(runtime, "aminmax", 0, aminmaxImpl);
  setPropertyHostFunction(runtime, "angle", 0, angleImpl);

  setPropertyHostFunction(runtime, "arccos", 0, arccosImpl);

  setPropertyHostFunction(runtime, "arccosh", 0, arccoshImpl);

  setPropertyHostFunction(runtime, "arcsin", 0, arcsinImpl);

  setPropertyHostFunction(runtime, "arcsinh", 0, arcsinhImpl);

  setPropertyHostFunction(runtime, "arctan", 0, arctanImpl);
  setPropertyHostFunction(runtime, "arctan2", 1, arctan2Impl);

  setPropertyHostFunction(runtime, "arctanh", 0, arctanhImpl);

  setPropertyHostFunction(runtime, "argmax", 0, argmaxImpl);
  setPropertyHostFunction(runtime, "argmin", 0, argminImpl);

  setPropertyHostFunction(runtime, "argwhere", 0, argwhereImpl);
  setPropertyHostFunction(runtime, "asStrided", 2, asStridedImpl);
  setPropertyHostFunction(runtime, "asStridedScatter", 3, asStridedScatterImpl);

  setPropertyHostFunction(runtime, "asin", 0, asinImpl);

  setPropertyHostFunction(runtime, "asinh", 0, asinhImpl);

  setPropertyHostFunction(runtime, "atan", 0, atanImpl);
  setPropertyHostFunction(runtime, "atan2", 1, atan2Impl);

  setPropertyHostFunction(runtime, "atanh", 0, atanhImpl);

  setPropertyHostFunction(runtime, "baddbmm", 2, baddbmmImpl);

  setPropertyHostFunction(runtime, "bitwiseAnd", 1, bitwiseAndImpl);

  setPropertyHostFunction(runtime, "bitwiseLeftShift", 1, bitwiseLeftShiftImpl);

  setPropertyHostFunction(runtime, "bitwiseNot", 0, bitwiseNotImpl);

  setPropertyHostFunction(runtime, "bitwiseOr", 1, bitwiseOrImpl);

  setPropertyHostFunction(
      runtime, "bitwiseRightShift", 1, bitwiseRightShiftImpl);

  setPropertyHostFunction(runtime, "bitwiseXor", 1, bitwiseXorImpl);

  setPropertyHostFunction(runtime, "bmm", 1, bmmImpl);
  setPropertyHostFunction(runtime, "broadcastTo", 1, broadcastToImpl);

  setPropertyHostFunction(runtime, "ccolIndices", 0, ccolIndicesImpl);
  setPropertyHostFunction(runtime, "ceil", 0, ceilImpl);

  setPropertyHostFunction(runtime, "cholesky", 0, choleskyImpl);
  setPropertyHostFunction(runtime, "choleskyInverse", 0, choleskyInverseImpl);
  setPropertyHostFunction(runtime, "choleskySolve", 1, choleskySolveImpl);

  setPropertyHostFunction(
      runtime, "clamp", 0, TensorHostObjectDeprecated::clampImpl);
  setPropertyHostFunction(runtime, "clampMax", 1, clampMaxImpl);

  setPropertyHostFunction(runtime, "clampMin", 1, clampMinImpl);

  setPropertyHostFunction(runtime, "coalesce", 0, coalesceImpl);
  setPropertyHostFunction(runtime, "colIndices", 0, colIndicesImpl);
  setPropertyHostFunction(runtime, "conj", 0, conjImpl);
  setPropertyHostFunction(runtime, "conjPhysical", 0, conjPhysicalImpl);

  setPropertyHostFunction(runtime, "contiguous", 0, contiguousImpl);

  setPropertyHostFunction(runtime, "copysign", 1, copysignImpl);

  setPropertyHostFunction(runtime, "corrcoef", 0, corrcoefImpl);
  setPropertyHostFunction(runtime, "cos", 0, cosImpl);

  setPropertyHostFunction(runtime, "cosh", 0, coshImpl);

  setPropertyHostFunction(runtime, "countNonzero", 1, countNonzeroImpl);

  setPropertyHostFunction(runtime, "cross", 1, crossImpl);
  setPropertyHostFunction(runtime, "crowIndices", 0, crowIndicesImpl);

  setPropertyHostFunction(
      runtime, "data", 0, TensorHostObjectDeprecated::dataImpl);
  setPropertyHostFunction(runtime, "deg2rad", 0, deg2radImpl);

  setPropertyHostFunction(runtime, "dequantize", 0, dequantizeImpl);
  setPropertyHostFunction(runtime, "det", 0, detImpl);
  setPropertyHostFunction(runtime, "detach", 0, detachImpl);

  setPropertyHostFunction(runtime, "diag", 0, diagImpl);
  setPropertyHostFunction(runtime, "diagEmbed", 0, diagEmbedImpl);
  setPropertyHostFunction(runtime, "diagflat", 0, diagflatImpl);

  setPropertyHostFunction(runtime, "diagonalScatter", 1, diagonalScatterImpl);

  setPropertyHostFunction(runtime, "digamma", 0, digammaImpl);

  setPropertyHostFunction(runtime, "dist", 1, distImpl);
  setPropertyHostFunction(runtime, "div", 1, divImpl);

  setPropertyHostFunction(runtime, "divide", 1, divideImpl);

  setPropertyHostFunction(runtime, "dot", 1, dotImpl);

  setPropertyHostFunction(runtime, "eq", 1, eqImpl);

  setPropertyHostFunction(runtime, "erf", 0, erfImpl);

  setPropertyHostFunction(runtime, "erfc", 0, erfcImpl);

  setPropertyHostFunction(runtime, "erfinv", 0, erfinvImpl);

  setPropertyHostFunction(runtime, "exp", 0, expImpl);
  setPropertyHostFunction(runtime, "exp2", 0, exp2Impl);

  setPropertyHostFunction(runtime, "expand", 1, expandImpl);
  setPropertyHostFunction(runtime, "expandAs", 1, expandAsImpl);
  setPropertyHostFunction(runtime, "expm1", 0, expm1Impl);

  setPropertyHostFunction(runtime, "fix", 0, fixImpl);

  setPropertyHostFunction(runtime, "flip", 1, flipImpl);
  setPropertyHostFunction(runtime, "fliplr", 0, fliplrImpl);
  setPropertyHostFunction(runtime, "flipud", 0, flipudImpl);
  setPropertyHostFunction(runtime, "floatPower", 1, floatPowerImpl);

  setPropertyHostFunction(runtime, "floor", 0, floorImpl);
  setPropertyHostFunction(runtime, "floorDivide", 1, floorDivideImpl);

  setPropertyHostFunction(runtime, "fmax", 1, fmaxImpl);
  setPropertyHostFunction(runtime, "fmin", 1, fminImpl);
  setPropertyHostFunction(runtime, "fmod", 1, fmodImpl);

  setPropertyHostFunction(runtime, "frac", 0, fracImpl);

  setPropertyHostFunction(runtime, "frexp", 0, frexpImpl);

  setPropertyHostFunction(runtime, "gcd", 1, gcdImpl);

  setPropertyHostFunction(runtime, "ge", 1, geImpl);

  setPropertyHostFunction(runtime, "geqrf", 0, geqrfImpl);
  setPropertyHostFunction(runtime, "ger", 1, gerImpl);
  setPropertyHostFunction(runtime, "greater", 1, greaterImpl);
  setPropertyHostFunction(runtime, "greaterEqual", 1, greaterEqualImpl);

  setPropertyHostFunction(runtime, "gt", 1, gtImpl);

  setPropertyHostFunction(runtime, "hardshrink", 0, hardshrinkImpl);

  setPropertyHostFunction(runtime, "heaviside", 1, heavisideImpl);

  setPropertyHostFunction(runtime, "histc", 0, histcImpl);

  setPropertyHostFunction(runtime, "hypot", 1, hypotImpl);

  setPropertyHostFunction(runtime, "i0", 0, i0Impl);

  setPropertyHostFunction(runtime, "igamma", 1, igammaImpl);

  setPropertyHostFunction(runtime, "igammac", 1, igammacImpl);

  setPropertyHostFunction(runtime, "indices", 0, indicesImpl);
  setPropertyHostFunction(runtime, "inner", 1, innerImpl);
  setPropertyHostFunction(runtime, "intRepr", 0, intReprImpl);
  setPropertyHostFunction(runtime, "inverse", 0, inverseImpl);

  setPropertyHostFunction(runtime, "isfinite", 0, isfiniteImpl);
  setPropertyHostFunction(runtime, "isinf", 0, isinfImpl);
  setPropertyHostFunction(runtime, "isnan", 0, isnanImpl);
  setPropertyHostFunction(runtime, "isneginf", 0, isneginfImpl);
  setPropertyHostFunction(runtime, "isposinf", 0, isposinfImpl);
  setPropertyHostFunction(runtime, "isreal", 0, isrealImpl);

  setPropertyHostFunction(runtime, "item", 0, itemImpl);
  setPropertyHostFunction(runtime, "kron", 1, kronImpl);

  setPropertyHostFunction(runtime, "lcm", 1, lcmImpl);

  setPropertyHostFunction(runtime, "ldexp", 1, ldexpImpl);

  setPropertyHostFunction(runtime, "le", 1, leImpl);

  setPropertyHostFunction(runtime, "lerp", 2, lerpImpl);

  setPropertyHostFunction(runtime, "less", 1, lessImpl);
  setPropertyHostFunction(runtime, "lessEqual", 1, lessEqualImpl);

  setPropertyHostFunction(runtime, "lgamma", 0, lgammaImpl);

  setPropertyHostFunction(runtime, "log", 0, logImpl);
  setPropertyHostFunction(runtime, "log10", 0, log10Impl);

  setPropertyHostFunction(runtime, "log1p", 0, log1pImpl);

  setPropertyHostFunction(runtime, "log2", 0, log2Impl);

  setPropertyHostFunction(runtime, "logaddexp", 1, logaddexpImpl);
  setPropertyHostFunction(runtime, "logaddexp2", 1, logaddexp2Impl);

  setPropertyHostFunction(runtime, "logdet", 0, logdetImpl);
  setPropertyHostFunction(runtime, "logicalAnd", 1, logicalAndImpl);

  setPropertyHostFunction(runtime, "logicalNot", 0, logicalNotImpl);

  setPropertyHostFunction(runtime, "logicalOr", 1, logicalOrImpl);

  setPropertyHostFunction(runtime, "logicalXor", 1, logicalXorImpl);

  setPropertyHostFunction(runtime, "lt", 1, ltImpl);

  setPropertyHostFunction(runtime, "luSolve", 2, luSolveImpl);
  setPropertyHostFunction(runtime, "mH", 0, mHImpl);
  setPropertyHostFunction(runtime, "mT", 0, mTImpl);
  setPropertyHostFunction(runtime, "maskedFill", 2, maskedFillImpl);

  setPropertyHostFunction(runtime, "maskedScatter", 2, maskedScatterImpl);

  setPropertyHostFunction(runtime, "maskedSelect", 1, maskedSelectImpl);
  setPropertyHostFunction(runtime, "matmul", 1, matmulImpl);
  setPropertyHostFunction(runtime, "matrixExp", 0, matrixExpImpl);
  setPropertyHostFunction(runtime, "matrixH", 0, matrixHImpl);
  setPropertyHostFunction(runtime, "matrixPower", 1, matrixPowerImpl);

  setPropertyHostFunction(runtime, "maximum", 1, maximumImpl);

  setPropertyHostFunction(runtime, "minimum", 1, minimumImpl);
  setPropertyHostFunction(runtime, "mm", 1, mmImpl);

  setPropertyHostFunction(runtime, "moveaxis", 2, moveaxisImpl);
  setPropertyHostFunction(runtime, "movedim", 2, movedimImpl);
  setPropertyHostFunction(runtime, "msort", 0, msortImpl);
  setPropertyHostFunction(runtime, "mul", 1, mulImpl);

  setPropertyHostFunction(runtime, "multiply", 1, multiplyImpl);

  setPropertyHostFunction(runtime, "mv", 1, mvImpl);
  setPropertyHostFunction(runtime, "mvlgamma", 1, mvlgammaImpl);

  setPropertyHostFunction(runtime, "narrow", 3, narrowImpl);
  setPropertyHostFunction(runtime, "narrowCopy", 3, narrowCopyImpl);
  setPropertyHostFunction(runtime, "ne", 1, neImpl);

  setPropertyHostFunction(runtime, "neg", 0, negImpl);

  setPropertyHostFunction(runtime, "negative", 0, negativeImpl);

  setPropertyHostFunction(runtime, "nextafter", 1, nextafterImpl);

  setPropertyHostFunction(runtime, "nonzero", 0, nonzeroImpl);

  setPropertyHostFunction(runtime, "notEqual", 1, notEqualImpl);

  setPropertyHostFunction(runtime, "numpyT", 0, numpyTImpl);
  setPropertyHostFunction(runtime, "orgqr", 1, orgqrImpl);
  setPropertyHostFunction(runtime, "ormqr", 2, ormqrImpl);
  setPropertyHostFunction(runtime, "outer", 1, outerImpl);

  setPropertyHostFunction(runtime, "permute", 1, permuteImpl);

  setPropertyHostFunction(runtime, "positive", 0, positiveImpl);
  setPropertyHostFunction(runtime, "pow", 1, powImpl);

  setPropertyHostFunction(runtime, "prelu", 1, preluImpl);

  setPropertyHostFunction(runtime, "put", 2, putImpl);

  setPropertyHostFunction(
      runtime, "qPerChannelScales", 0, qPerChannelScalesImpl);
  setPropertyHostFunction(
      runtime, "qPerChannelZeroPoints", 0, qPerChannelZeroPointsImpl);

  setPropertyHostFunction(runtime, "qr", 0, qrImpl);

  setPropertyHostFunction(runtime, "rad2deg", 0, rad2degImpl);

  setPropertyHostFunction(runtime, "ravel", 0, ravelImpl);
  setPropertyHostFunction(runtime, "reciprocal", 0, reciprocalImpl);

  setPropertyHostFunction(runtime, "relu", 0, reluImpl);

  setPropertyHostFunction(runtime, "remainder", 1, remainderImpl);

  setPropertyHostFunction(runtime, "renorm", 3, renormImpl);

  setPropertyHostFunction(runtime, "repeat", 1, repeatImpl);
  setPropertyHostFunction(runtime, "repeatInterleave", 1, repeatInterleaveImpl);

  setPropertyHostFunction(runtime, "reshape", 1, reshapeImpl);
  setPropertyHostFunction(runtime, "reshapeAs", 1, reshapeAsImpl);

  setPropertyHostFunction(runtime, "resolveConj", 0, resolveConjImpl);
  setPropertyHostFunction(runtime, "resolveNeg", 0, resolveNegImpl);

  setPropertyHostFunction(runtime, "rowIndices", 0, rowIndicesImpl);
  setPropertyHostFunction(runtime, "rsqrt", 0, rsqrtImpl);

  setPropertyHostFunction(runtime, "selectScatter", 3, selectScatterImpl);

  setPropertyHostFunction(runtime, "sgn", 0, sgnImpl);

  setPropertyHostFunction(runtime, "sigmoid", 0, sigmoidImpl);

  setPropertyHostFunction(runtime, "sign", 0, signImpl);

  setPropertyHostFunction(runtime, "signbit", 0, signbitImpl);
  setPropertyHostFunction(runtime, "sin", 0, sinImpl);

  setPropertyHostFunction(runtime, "sinc", 0, sincImpl);

  setPropertyHostFunction(runtime, "sinh", 0, sinhImpl);

  setPropertyHostFunction(runtime, "slice", 0, sliceImpl);
  setPropertyHostFunction(runtime, "sliceScatter", 1, sliceScatterImpl);
  setPropertyHostFunction(runtime, "slogdet", 0, slogdetImpl);
  setPropertyHostFunction(runtime, "smm", 1, smmImpl);
  setPropertyHostFunction(
      runtime, "softmax", 1, TensorHostObjectDeprecated::softmaxImpl);

  setPropertyHostFunction(runtime, "sparseMask", 1, sparseMaskImpl);

  setPropertyHostFunction(runtime, "sqrt", 0, sqrtImpl);

  setPropertyHostFunction(runtime, "square", 0, squareImpl);

  setPropertyHostFunction(
      runtime, "squeeze", 0, TensorHostObjectDeprecated::squeezeImpl);

  setPropertyHostFunction(runtime, "sspaddmm", 2, sspaddmmImpl);

  setPropertyHostFunction(
      runtime, "stride", 1, TensorHostObjectDeprecated::strideImpl);
  setPropertyHostFunction(runtime, "sub", 1, subImpl);

  setPropertyHostFunction(runtime, "subtract", 1, subtractImpl);

  setPropertyHostFunction(
      runtime, "sum", 0, TensorHostObjectDeprecated::sumImpl);
  setPropertyHostFunction(runtime, "sumToSize", 1, sumToSizeImpl);

  setPropertyHostFunction(runtime, "swapaxes", 2, swapaxesImpl);

  setPropertyHostFunction(runtime, "swapdims", 2, swapdimsImpl);

  setPropertyHostFunction(runtime, "symeig", 0, symeigImpl);
  setPropertyHostFunction(runtime, "t", 0, tImpl);

  setPropertyHostFunction(runtime, "take", 1, takeImpl);
  setPropertyHostFunction(runtime, "takeAlongDim", 1, takeAlongDimImpl);
  setPropertyHostFunction(runtime, "tan", 0, tanImpl);

  setPropertyHostFunction(runtime, "tanh", 0, tanhImpl);

  setPropertyHostFunction(runtime, "tile", 1, tileImpl);
  setPropertyHostFunction(runtime, "to", 0, TensorHostObjectDeprecated::toImpl);

  setPropertyHostFunction(runtime, "toSparse", 1, toSparseImpl);
  setPropertyHostFunction(runtime, "toSparseBsc", 1, toSparseBscImpl);
  setPropertyHostFunction(runtime, "toSparseBsr", 1, toSparseBsrImpl);
  setPropertyHostFunction(runtime, "toSparseCsc", 0, toSparseCscImpl);
  setPropertyHostFunction(runtime, "toSparseCsr", 0, toSparseCsrImpl);
  setPropertyHostFunction(runtime, "topk", 1, topkImpl);
  setPropertyHostFunction(runtime, "trace", 0, traceImpl);

  setPropertyHostFunction(runtime, "triangularSolve", 1, triangularSolveImpl);
  setPropertyHostFunction(runtime, "tril", 0, trilImpl);

  setPropertyHostFunction(runtime, "triu", 0, triuImpl);

  setPropertyHostFunction(runtime, "trueDivide", 1, trueDivideImpl);

  setPropertyHostFunction(runtime, "trunc", 0, truncImpl);

  setPropertyHostFunction(runtime, "typeAs", 1, typeAsImpl);

  setPropertyHostFunction(runtime, "unfold", 3, unfoldImpl);

  setPropertyHostFunction(runtime, "unsqueeze", 1, unsqueezeImpl);

  setPropertyHostFunction(runtime, "values", 0, valuesImpl);

  setPropertyHostFunction(runtime, "vdot", 1, vdotImpl);

  setPropertyHostFunction(runtime, "viewAs", 1, viewAsImpl);

  setPropertyHostFunction(runtime, "xlogy", 1, xlogyImpl);
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
