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
  if (args.atLeastNumArguments(0)) {
    try {
      auto self = args.thisAsHostObject<TensorHostObject>();

      at::Tensor result = self->tensor.abs();
      return utils::helpers::createFromHostObject<TensorHostObject>(
          runtime, std::move(result));
    } catch (jsi::JSError& error) {
      // Arguments do not match signature at::Tensor (const at::Tensor &)
    } catch (std::exception& ex) {
      throw std::move(ex);
    }
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
  if (args.atLeastNumArguments(1) && args[0].isObject() &&
      args[0].asObject(runtime).isHostObject<TensorHostObject>(runtime) &&
      (args.keywordValue(1, "alpha").isUndefined() ||
       args.keywordValue(1, "alpha").isNumber())) {
    try {
      auto self = args.thisAsHostObject<TensorHostObject>();
      auto other = args.asHostObject<TensorHostObject>(0)->tensor;
      auto alphaValue = args.keywordValue(1, "alpha");
      auto alpha = alphaValue.isUndefined() ? at::Scalar(1)
                                            : at::Scalar(alphaValue.asNumber());

      at::Tensor result = self->tensor.add(other, alpha);
      return utils::helpers::createFromHostObject<TensorHostObject>(
          runtime, std::move(result));
    } catch (jsi::JSError& error) {
      // Arguments do not match signature at::Tensor (const at::Tensor &, const
      // at::Tensor &, const at::Scalar &)
    } catch (std::exception& ex) {
      throw std::move(ex);
    }
  }

  if (args.atLeastNumArguments(1) && args[0].isNumber() &&
      (args.keywordValue(1, "alpha").isUndefined() ||
       args.keywordValue(1, "alpha").isNumber())) {
    try {
      auto self = args.thisAsHostObject<TensorHostObject>();
      auto other = args[0].asNumber();
      auto alphaValue = args.keywordValue(1, "alpha");
      auto alpha = alphaValue.isUndefined() ? at::Scalar(1)
                                            : at::Scalar(alphaValue.asNumber());

      at::Tensor result = self->tensor.add(other, alpha);
      return utils::helpers::createFromHostObject<TensorHostObject>(
          runtime, std::move(result));
    } catch (jsi::JSError& error) {
      // Arguments do not match signature at::Tensor (const at::Tensor &, const
      // at::Scalar &, const at::Scalar &)
    } catch (std::exception& ex) {
      throw std::move(ex);
    }
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
  if (args.atLeastNumArguments(0) &&
      (args.keywordValue(0, "dim").isUndefined() ||
       args.keywordValue(0, "dim").isNumber()) &&
      (args.keywordValue(0, "keepdim").isUndefined() ||
       args.keywordValue(0, "keepdim").isBool())) {
    try {
      auto self = args.thisAsHostObject<TensorHostObject>();
      auto dimValue = args.keywordValue(0, "dim");
      c10::optional<int64_t> dim = dimValue.isUndefined()
          ? c10::nullopt
          : (c10::optional<int64_t>)dimValue.asNumber();
      auto keepdimValue = args.keywordValue(0, "keepdim");
      auto keepdim =
          keepdimValue.isUndefined() ? false : keepdimValue.getBool();

      at::Tensor result =
          self->tensor.argmax(dim, keepdim)
              .to(torch_::TensorOptions().dtype(torch_::kInt32));
      return utils::helpers::createFromHostObject<TensorHostObject>(
          runtime, std::move(result));
    } catch (jsi::JSError& error) {
      // Arguments do not match signature at::Tensor (const at::Tensor &,
      // c10::optional<int64_t>, bool)
    } catch (std::exception& ex) {
      throw std::move(ex);
    }
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
  if (args.atLeastNumArguments(0) &&
      (args.keywordValue(0, "dim").isUndefined() ||
       args.keywordValue(0, "dim").isNumber()) &&
      (args.keywordValue(0, "keepdim").isUndefined() ||
       args.keywordValue(0, "keepdim").isBool())) {
    try {
      auto self = args.thisAsHostObject<TensorHostObject>();
      auto dimValue = args.keywordValue(0, "dim");
      c10::optional<int64_t> dim = dimValue.isUndefined()
          ? c10::nullopt
          : (c10::optional<int64_t>)dimValue.asNumber();
      auto keepdimValue = args.keywordValue(0, "keepdim");
      auto keepdim =
          keepdimValue.isUndefined() ? false : keepdimValue.getBool();

      at::Tensor result =
          self->tensor.argmin(dim, keepdim)
              .to(torch_::TensorOptions().dtype(torch_::kInt32));
      return utils::helpers::createFromHostObject<TensorHostObject>(
          runtime, std::move(result));
    } catch (jsi::JSError& error) {
      // Arguments do not match signature at::Tensor (const at::Tensor &,
      // c10::optional<int64_t>, bool)
    } catch (std::exception& ex) {
      throw std::move(ex);
    }
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op argmin do not match any of the following signatures:at::Tensor (const at::Tensor &, c10::optional<int64_t>, bool)");
}

jsi::Value expandImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  if (args.atLeastNumArguments(1) &&
      (args[0].isNumber() ||
       (args[0].isObject() && args[0].asObject(runtime).isArray(runtime))) &&
      (args.keywordValue(1, "implicit").isUndefined() ||
       args.keywordValue(1, "implicit").isBool())) {
    try {
      auto self = args.thisAsHostObject<TensorHostObject>();
      std::vector<int64_t> vector;
      utils::helpers::parseSize(runtime, arguments, 0, count, &vector);
      auto size = c10::ArrayRef<int64_t>(vector);
      auto implicitValue = args.keywordValue(1, "implicit");
      auto implicit =
          implicitValue.isUndefined() ? false : implicitValue.getBool();

      at::Tensor result = self->tensor.expand(size, implicit);
      return utils::helpers::createFromHostObject<TensorHostObject>(
          runtime, std::move(result));
    } catch (jsi::JSError& error) {
      // Arguments do not match signature at::Tensor (const at::Tensor &,
      // at::IntArrayRef, bool)
    } catch (std::exception& ex) {
      throw std::move(ex);
    }
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
  if (args.atLeastNumArguments(1) &&
      (args[0].isNumber() ||
       (args[0].isObject() && args[0].asObject(runtime).isArray(runtime)))) {
    try {
      auto self = args.thisAsHostObject<TensorHostObject>();
      std::vector<int64_t> vector;
      utils::helpers::parseSize(runtime, arguments, 0, count, &vector);
      auto dims = c10::ArrayRef<int64_t>(vector);

      at::Tensor result = self->tensor.flip(dims);
      return utils::helpers::createFromHostObject<TensorHostObject>(
          runtime, std::move(result));
    } catch (jsi::JSError& error) {
      // Arguments do not match signature at::Tensor (const at::Tensor &,
      // at::IntArrayRef)
    } catch (std::exception& ex) {
      throw std::move(ex);
    }
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

  if (args.atLeastNumArguments(0)) {
    try {
      auto self = args.thisAsHostObject<TensorHostObject>();

      auto result = self->tensor.item();
      if (result.isIntegral(/*includeBool=*/false)) {
        return jsi::Value(result.toInt());
      } else if (result.isFloatingPoint()) {
        return jsi::Value(result.toDouble());
      } else {
        throw jsi::JSError(runtime, "unsupported dtype for item().");
      }
    } catch (jsi::JSError& error) {
      // Arguments do not match signature at::Scalar (const at::Tensor &)
    } catch (std::exception& ex) {
      throw std::move(ex);
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
  if (args.atLeastNumArguments(1) && args[0].isObject() &&
      args[0].asObject(runtime).isHostObject<TensorHostObject>(runtime)) {
    try {
      auto self = args.thisAsHostObject<TensorHostObject>();
      auto other = args.asHostObject<TensorHostObject>(0)->tensor;

      at::Tensor result = self->tensor.matmul(other);
      return utils::helpers::createFromHostObject<TensorHostObject>(
          runtime, std::move(result));
    } catch (jsi::JSError& error) {
      // Arguments do not match signature at::Tensor (const at::Tensor &, const
      // at::Tensor &)
    } catch (std::exception& ex) {
      throw std::move(ex);
    }
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
  if (args.atLeastNumArguments(1) && args[0].isObject() &&
      args[0].asObject(runtime).isHostObject<TensorHostObject>(runtime)) {
    try {
      auto self = args.thisAsHostObject<TensorHostObject>();
      auto other = args.asHostObject<TensorHostObject>(0)->tensor;

      at::Tensor result = self->tensor.mul(other);
      return utils::helpers::createFromHostObject<TensorHostObject>(
          runtime, std::move(result));
    } catch (jsi::JSError& error) {
      // Arguments do not match signature at::Tensor (const at::Tensor &, const
      // at::Tensor &)
    } catch (std::exception& ex) {
      throw std::move(ex);
    }
  }

  if (args.atLeastNumArguments(1) && args[0].isNumber()) {
    try {
      auto self = args.thisAsHostObject<TensorHostObject>();
      auto other = args[0].asNumber();

      at::Tensor result = self->tensor.mul(other);
      return utils::helpers::createFromHostObject<TensorHostObject>(
          runtime, std::move(result));
    } catch (jsi::JSError& error) {
      // Arguments do not match signature at::Tensor (const at::Tensor &, const
      // at::Scalar &)
    } catch (std::exception& ex) {
      throw std::move(ex);
    }
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
  if (args.atLeastNumArguments(1) &&
      (args[0].isNumber() ||
       (args[0].isObject() && args[0].asObject(runtime).isArray(runtime)))) {
    try {
      auto self = args.thisAsHostObject<TensorHostObject>();
      std::vector<int64_t> vector;
      utils::helpers::parseSize(runtime, arguments, 0, count, &vector);
      auto dims = c10::ArrayRef<int64_t>(vector);

      at::Tensor result = self->tensor.permute(dims);
      return utils::helpers::createFromHostObject<TensorHostObject>(
          runtime, std::move(result));
    } catch (jsi::JSError& error) {
      // Arguments do not match signature at::Tensor (const at::Tensor &,
      // at::IntArrayRef)
    } catch (std::exception& ex) {
      throw std::move(ex);
    }
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
  if (args.atLeastNumArguments(1) &&
      (args[0].isNumber() ||
       (args[0].isObject() && args[0].asObject(runtime).isArray(runtime)))) {
    try {
      auto self = args.thisAsHostObject<TensorHostObject>();
      std::vector<int64_t> vector;
      utils::helpers::parseSize(runtime, arguments, 0, count, &vector);
      auto shape = c10::ArrayRef<int64_t>(vector);

      at::Tensor result = self->tensor.reshape(shape);
      return utils::helpers::createFromHostObject<TensorHostObject>(
          runtime, std::move(result));
    } catch (jsi::JSError& error) {
      // Arguments do not match signature at::Tensor (const at::Tensor &,
      // at::IntArrayRef)
    } catch (std::exception& ex) {
      throw std::move(ex);
    }
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
  if (args.atLeastNumArguments(0)) {
    try {
      auto self = args.thisAsHostObject<TensorHostObject>();

      at::Tensor result = self->tensor.sqrt();
      return utils::helpers::createFromHostObject<TensorHostObject>(
          runtime, std::move(result));
    } catch (jsi::JSError& error) {
      // Arguments do not match signature at::Tensor (const at::Tensor &)
    } catch (std::exception& ex) {
      throw std::move(ex);
    }
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
  if (args.atLeastNumArguments(1) && args[0].isObject() &&
      args[0].asObject(runtime).isHostObject<TensorHostObject>(runtime) &&
      (args.keywordValue(1, "alpha").isUndefined() ||
       args.keywordValue(1, "alpha").isNumber())) {
    try {
      auto self = args.thisAsHostObject<TensorHostObject>();
      auto other = args.asHostObject<TensorHostObject>(0)->tensor;
      auto alphaValue = args.keywordValue(1, "alpha");
      auto alpha = alphaValue.isUndefined() ? at::Scalar(1)
                                            : at::Scalar(alphaValue.asNumber());

      at::Tensor result = self->tensor.sub(other, alpha);
      return utils::helpers::createFromHostObject<TensorHostObject>(
          runtime, std::move(result));
    } catch (jsi::JSError& error) {
      // Arguments do not match signature at::Tensor (const at::Tensor &, const
      // at::Tensor &, const at::Scalar &)
    } catch (std::exception& ex) {
      throw std::move(ex);
    }
  }

  if (args.atLeastNumArguments(1) && args[0].isNumber() &&
      (args.keywordValue(1, "alpha").isUndefined() ||
       args.keywordValue(1, "alpha").isNumber())) {
    try {
      auto self = args.thisAsHostObject<TensorHostObject>();
      auto other = args[0].asNumber();
      auto alphaValue = args.keywordValue(1, "alpha");
      auto alpha = alphaValue.isUndefined() ? at::Scalar(1)
                                            : at::Scalar(alphaValue.asNumber());

      at::Tensor result = self->tensor.sub(other, alpha);
      return utils::helpers::createFromHostObject<TensorHostObject>(
          runtime, std::move(result));
    } catch (jsi::JSError& error) {
      // Arguments do not match signature at::Tensor (const at::Tensor &, const
      // at::Scalar &, const at::Scalar &)
    } catch (std::exception& ex) {
      throw std::move(ex);
    }
  }
  throw facebook::jsi::JSError(
      runtime,
      "Arguments for op sub do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &, const at::Scalar &), at::Tensor (const at::Tensor &, const at::Scalar &, const at::Scalar &)");
}

jsi::Value unsqueezeImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  if (args.atLeastNumArguments(1) && args[0].isNumber()) {
    try {
      auto self = args.thisAsHostObject<TensorHostObject>();
      auto dim = args.asInteger(0);

      at::Tensor result = self->tensor.unsqueeze(dim);
      return utils::helpers::createFromHostObject<TensorHostObject>(
          runtime, std::move(result));
    } catch (jsi::JSError& error) {
      // Arguments do not match signature at::Tensor (const at::Tensor &,
      // int64_t)
    } catch (std::exception& ex) {
      throw std::move(ex);
    }
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
  setPropertyHostFunction(
      runtime, "contiguous", 0, TensorHostObjectDeprecated::contiguousImpl);
  setPropertyHostFunction(
      runtime, "data", 0, TensorHostObjectDeprecated::dataImpl);
  setPropertyHostFunction(
      runtime, "div", 1, TensorHostObjectDeprecated::divImpl);
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
  setPropertyHostFunction(
      runtime, "topk", 1, TensorHostObjectDeprecated::topkImpl);
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
    std::ostringstream stream;
    stream << this->tensor;
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
    torch_::IntArrayRef dims = this->tensor.sizes();
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
