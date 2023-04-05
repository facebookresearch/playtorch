# Copyright (c) Meta Platforms, Inc. and affiliates.
#
# This source code is licensed under the MIT license found in the
# LICENSE file in the root directory of this source tree.

gen_cpp_func_add0 = """
    if(args.atLeastNumArguments(1) && args[0].isObject() && args[0].asObject(runtime).isHostObject<TensorHostObject>(runtime) && (args.keywordValue(1, "alpha").isUndefined() || args.keywordValue(1, "alpha").isNumber())) {
        try {
            auto self = args.thisAsHostObject<TensorHostObject>();
            auto other = args.asHostObject<TensorHostObject>(0)->tensor;
            auto alphaValue = args.keywordValue(1, "alpha");
            auto alpha = alphaValue.isUndefined() ? at::Scalar(1) : at::Scalar(alphaValue.asNumber());

            at::Tensor result = self->tensor.add(other, alpha);
            return utils::helpers::createFromHostObject<TensorHostObject>(runtime, std::move(result));
        } catch (jsi::JSError& error) {
        // Arguments do not match signature at::Tensor (const at::Tensor &, const at::Tensor &, const at::Scalar &)
        } catch (std::exception& ex) {
            throw std::move(ex);
        }
    }
"""

gen_cpp_func_add1 = """
    if(args.atLeastNumArguments(1) && args[0].isNumber() && (args.keywordValue(1, "alpha").isUndefined() || args.keywordValue(1, "alpha").isNumber())) {
        try {
            auto self = args.thisAsHostObject<TensorHostObject>();
            auto other = args[0].asNumber();
            auto alphaValue = args.keywordValue(1, "alpha");
            auto alpha = alphaValue.isUndefined() ? at::Scalar(1) : at::Scalar(alphaValue.asNumber());

            at::Tensor result = self->tensor.add(other, alpha);
            return utils::helpers::createFromHostObject<TensorHostObject>(runtime, std::move(result));
        } catch (jsi::JSError& error) {
        // Arguments do not match signature at::Tensor (const at::Tensor &, const at::Scalar &, const at::Scalar &)
        } catch (std::exception& ex) {
            throw std::move(ex);
        }
    }
"""

gen_cpp_func_reshape = """
    if(false) {
        try {
            auto self = args.thisAsHostObject<TensorHostObject>();
            throw facebook::jsi::JSError(runtime, "Argument parsing for type at::IntArrayRef has not been implemented yet");

        } catch (jsi::JSError& error) {
        // Arguments do not match signature at::Tensor (const at::Tensor &, at::IntArrayRef)
        } catch (std::exception& ex) {
            throw std::move(ex);
        }
    }
"""

gen_cpp_func_item = """
    if(args.atLeastNumArguments(0)) {
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
"""

gen_cpp_func_impl_add = """

jsi::Value addImpl(
  jsi::Runtime& runtime,
  const jsi::Value& thisValue,
  const jsi::Value* arguments,
  size_t count) {
    utils::ArgumentParser args(runtime, thisValue, arguments, count);
    args.requireNumArguments(1);
    if(args.atLeastNumArguments(1) && args[0].isObject() && args[0].asObject(runtime).isHostObject<TensorHostObject>(runtime) && (args.keywordValue(1, "alpha").isUndefined() || args.keywordValue(1, "alpha").isNumber())) {
        try {
            auto self = args.thisAsHostObject<TensorHostObject>();
            auto other = args.asHostObject<TensorHostObject>(0)->tensor;
            auto alphaValue = args.keywordValue(1, "alpha");
            auto alpha = alphaValue.isUndefined() ? at::Scalar(1) : at::Scalar(alphaValue.asNumber());

            at::Tensor result = self->tensor.add(other, alpha);
            return utils::helpers::createFromHostObject<TensorHostObject>(runtime, std::move(result));
        } catch (jsi::JSError& error) {
        // Arguments do not match signature at::Tensor (const at::Tensor &, const at::Tensor &, const at::Scalar &)
        } catch (std::exception& ex) {
            throw std::move(ex);
        }
    }

    if(args.atLeastNumArguments(1) && args[0].isNumber() && (args.keywordValue(1, "alpha").isUndefined() || args.keywordValue(1, "alpha").isNumber())) {
        try {
            auto self = args.thisAsHostObject<TensorHostObject>();
            auto other = args[0].asNumber();
            auto alphaValue = args.keywordValue(1, "alpha");
            auto alpha = alphaValue.isUndefined() ? at::Scalar(1) : at::Scalar(alphaValue.asNumber());

            at::Tensor result = self->tensor.add(other, alpha);
            return utils::helpers::createFromHostObject<TensorHostObject>(runtime, std::move(result));
        } catch (jsi::JSError& error) {
        // Arguments do not match signature at::Tensor (const at::Tensor &, const at::Scalar &, const at::Scalar &)
        } catch (std::exception& ex) {
            throw std::move(ex);
        }
    }
    throw facebook::jsi::JSError(runtime, "Arguments for op add do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &, const at::Scalar &), at::Tensor (const at::Tensor &, const at::Scalar &, const at::Scalar &)");
  }
"""

gen_cpp_func_impl_reshape = """

jsi::Value reshapeImpl(
  jsi::Runtime& runtime,
  const jsi::Value& thisValue,
  const jsi::Value* arguments,
  size_t count) {
    utils::ArgumentParser args(runtime, thisValue, arguments, count);
    args.requireNumArguments(1);
    if(false) {
        try {
            auto self = args.thisAsHostObject<TensorHostObject>();
            throw facebook::jsi::JSError(runtime, "Argument parsing for type at::IntArrayRef has not been implemented yet");

        } catch (jsi::JSError& error) {
        // Arguments do not match signature at::Tensor (const at::Tensor &, at::IntArrayRef)
        } catch (std::exception& ex) {
            throw std::move(ex);
        }
    }
    throw facebook::jsi::JSError(runtime, "Arguments for op reshape do not match any of the following signatures:at::Tensor (const at::Tensor &, at::IntArrayRef)");
  }
"""

gen_cpp_func_impl_item = """

jsi::Value itemImpl(
  jsi::Runtime& runtime,
  const jsi::Value& thisValue,
  const jsi::Value* arguments,
  size_t count) {
    utils::ArgumentParser args(runtime, thisValue, arguments, count);
    args.requireNumArguments(0);

    // TODO(T113480543): enable BigInt once Hermes supports it
    if (thisValue.asObject(runtime).asHostObject<TensorHostObject>(runtime)->tensor.dtype() == torch_::kInt64) {
      throw jsi::JSError(
        runtime,
        "the property 'item' for a tensor of dtype torch.int64 is not"
        " supported. Work around this with .to({dtype: torch.int32})"
        " This might alter the tensor values.");
    }

    if(args.atLeastNumArguments(0)) {
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
    throw facebook::jsi::JSError(runtime, "Arguments for op item do not match any of the following signatures:at::Scalar (const at::Tensor &)");
  }
"""

cpp_file_str = """#include <c10/core/MemoryFormat.h>
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

jsi::Value addImpl(
  jsi::Runtime& runtime,
  const jsi::Value& thisValue,
  const jsi::Value* arguments,
  size_t count) {
    utils::ArgumentParser args(runtime, thisValue, arguments, count);
    args.requireNumArguments(1);
    if(args.atLeastNumArguments(1) && args[0].isObject() && args[0].asObject(runtime).isHostObject<TensorHostObject>(runtime) && (args.keywordValue(1, "alpha").isUndefined() || args.keywordValue(1, "alpha").isNumber())) {
        try {
            auto self = args.thisAsHostObject<TensorHostObject>();
            auto other = args.asHostObject<TensorHostObject>(0)->tensor;
            auto alphaValue = args.keywordValue(1, "alpha");
            auto alpha = alphaValue.isUndefined() ? at::Scalar(1) : at::Scalar(alphaValue.asNumber());

            at::Tensor result = self->tensor.add(other, alpha);
            return utils::helpers::createFromHostObject<TensorHostObject>(runtime, std::move(result));
        } catch (jsi::JSError& error) {
        // Arguments do not match signature at::Tensor (const at::Tensor &, const at::Tensor &, const at::Scalar &)
        } catch (std::exception& ex) {
            throw std::move(ex);
        }
    }

    if(args.atLeastNumArguments(1) && args[0].isNumber() && (args.keywordValue(1, "alpha").isUndefined() || args.keywordValue(1, "alpha").isNumber())) {
        try {
            auto self = args.thisAsHostObject<TensorHostObject>();
            auto other = args[0].asNumber();
            auto alphaValue = args.keywordValue(1, "alpha");
            auto alpha = alphaValue.isUndefined() ? at::Scalar(1) : at::Scalar(alphaValue.asNumber());

            at::Tensor result = self->tensor.add(other, alpha);
            return utils::helpers::createFromHostObject<TensorHostObject>(runtime, std::move(result));
        } catch (jsi::JSError& error) {
        // Arguments do not match signature at::Tensor (const at::Tensor &, const at::Scalar &, const at::Scalar &)
        } catch (std::exception& ex) {
            throw std::move(ex);
        }
    }
    throw facebook::jsi::JSError(runtime, "Arguments for op add do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &, const at::Scalar &), at::Tensor (const at::Tensor &, const at::Scalar &, const at::Scalar &)");
  }


jsi::Value itemImpl(
  jsi::Runtime& runtime,
  const jsi::Value& thisValue,
  const jsi::Value* arguments,
  size_t count) {
    utils::ArgumentParser args(runtime, thisValue, arguments, count);
    args.requireNumArguments(0);

    // TODO(T113480543): enable BigInt once Hermes supports it
    if (thisValue.asObject(runtime).asHostObject<TensorHostObject>(runtime)->tensor.dtype() == torch_::kInt64) {
      throw jsi::JSError(
        runtime,
        "the property 'item' for a tensor of dtype torch.int64 is not"
        " supported. Work around this with .to({dtype: torch.int32})"
        " This might alter the tensor values.");
    }

    if(args.atLeastNumArguments(0)) {
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
    throw facebook::jsi::JSError(runtime, "Arguments for op item do not match any of the following signatures:at::Scalar (const at::Tensor &)");
  }


jsi::Value mulImpl(
  jsi::Runtime& runtime,
  const jsi::Value& thisValue,
  const jsi::Value* arguments,
  size_t count) {
    utils::ArgumentParser args(runtime, thisValue, arguments, count);
    args.requireNumArguments(1);
    if(args.atLeastNumArguments(1) && args[0].isObject() && args[0].asObject(runtime).isHostObject<TensorHostObject>(runtime)) {
        try {
            auto self = args.thisAsHostObject<TensorHostObject>();
            auto other = args.asHostObject<TensorHostObject>(0)->tensor;

            at::Tensor result = self->tensor.mul(other);
            return utils::helpers::createFromHostObject<TensorHostObject>(runtime, std::move(result));
        } catch (jsi::JSError& error) {
        // Arguments do not match signature at::Tensor (const at::Tensor &, const at::Tensor &)
        } catch (std::exception& ex) {
            throw std::move(ex);
        }
    }

    if(args.atLeastNumArguments(1) && args[0].isNumber()) {
        try {
            auto self = args.thisAsHostObject<TensorHostObject>();
            auto other = args[0].asNumber();

            at::Tensor result = self->tensor.mul(other);
            return utils::helpers::createFromHostObject<TensorHostObject>(runtime, std::move(result));
        } catch (jsi::JSError& error) {
        // Arguments do not match signature at::Tensor (const at::Tensor &, const at::Scalar &)
        } catch (std::exception& ex) {
            throw std::move(ex);
        }
    }
    throw facebook::jsi::JSError(runtime, "Arguments for op mul do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &), at::Tensor (const at::Tensor &, const at::Scalar &)");
  }


jsi::Value subImpl(
  jsi::Runtime& runtime,
  const jsi::Value& thisValue,
  const jsi::Value* arguments,
  size_t count) {
    utils::ArgumentParser args(runtime, thisValue, arguments, count);
    args.requireNumArguments(1);
    if(args.atLeastNumArguments(1) && args[0].isObject() && args[0].asObject(runtime).isHostObject<TensorHostObject>(runtime) && (args.keywordValue(1, "alpha").isUndefined() || args.keywordValue(1, "alpha").isNumber())) {
        try {
            auto self = args.thisAsHostObject<TensorHostObject>();
            auto other = args.asHostObject<TensorHostObject>(0)->tensor;
            auto alphaValue = args.keywordValue(1, "alpha");
            auto alpha = alphaValue.isUndefined() ? at::Scalar(1) : at::Scalar(alphaValue.asNumber());

            at::Tensor result = self->tensor.sub(other, alpha);
            return utils::helpers::createFromHostObject<TensorHostObject>(runtime, std::move(result));
        } catch (jsi::JSError& error) {
        // Arguments do not match signature at::Tensor (const at::Tensor &, const at::Tensor &, const at::Scalar &)
        } catch (std::exception& ex) {
            throw std::move(ex);
        }
    }

    if(args.atLeastNumArguments(1) && args[0].isNumber() && (args.keywordValue(1, "alpha").isUndefined() || args.keywordValue(1, "alpha").isNumber())) {
        try {
            auto self = args.thisAsHostObject<TensorHostObject>();
            auto other = args[0].asNumber();
            auto alphaValue = args.keywordValue(1, "alpha");
            auto alpha = alphaValue.isUndefined() ? at::Scalar(1) : at::Scalar(alphaValue.asNumber());

            at::Tensor result = self->tensor.sub(other, alpha);
            return utils::helpers::createFromHostObject<TensorHostObject>(runtime, std::move(result));
        } catch (jsi::JSError& error) {
        // Arguments do not match signature at::Tensor (const at::Tensor &, const at::Scalar &, const at::Scalar &)
        } catch (std::exception& ex) {
            throw std::move(ex);
        }
    }
    throw facebook::jsi::JSError(runtime, "Arguments for op sub do not match any of the following signatures:at::Tensor (const at::Tensor &, const at::Tensor &, const at::Scalar &), at::Tensor (const at::Tensor &, const at::Scalar &, const at::Scalar &)");
  }

}

TensorHostObject::TensorHostObject(jsi::Runtime& runtime, torch_::Tensor t)
  : BaseHostObject(runtime),
  size_(createSize(runtime)),
  toString_(createToString(runtime)),
  tensor(t) {
    setPropertyHostFunction(runtime, "add", 1, addImpl);
    setPropertyHostFunction(runtime, "item", 0, itemImpl);
    setPropertyHostFunction(runtime, "mul", 1, mulImpl);
    setPropertyHostFunction(runtime, "reshape", 1, TensorHostObjectDeprecated::reshapeImpl);
    setPropertyHostFunction(runtime, "sub", 1, subImpl);
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
"""

ts_interface = """export interface Tensor {
  /**
   * Computes the absolute value of each element in input.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.abs.html}
   */
  abs(): Tensor;
  /**
   * Add a scalar or tensor to this tensor.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.add.html}
   *
   * @param other Scalar or tensor to be added to each element in this tensor.
   * @param options.alpha The multiplier for `other`. Default: `1`.
   */
  add(other: Scalar | Tensor, options?: {alpha?: Number}): Tensor;
  /**
   * Returns the indices of the maximum value of all elements in the input
   * tensor.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.argmax.html}
   *
   * @param options argmax Options as keywords argument in pytorch
   * @param options.dim The dimension to reduce. If `undefined`, the argmax of the flattened input is returned.
   * @param options.keepdim Whether the output tensor has `dim` retained or not. Ignored if `dim` is `undefined`.
   */
  argmax(options?: {dim?: number; keepdim?: boolean}): Tensor;
  /**
   * Returns the indices of the minimum value(s) of the flattened tensor or along a dimension
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.argmin.html}
   *
   * @param options argmin Options as keywords argument in pytorch
   * @param options.dim The dimension to reduce. If `undefined`, the argmin of the flattened input is returned.
   * @param options.keepdim Whether the output tensor has `dim` retained or not. Ignored if `dim` is `undefined`.
   */
  argmin(options?: {dim?: number; keepdim?: boolean}): Tensor;
  /**
   * Clamps all elements in input into the range `[ min, max ]`.
   *
   * If `min` is `undefined`, there is no lower bound. Or, if `max` is `undefined` there is no upper bound.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.clamp.html}
   *
   * @param min Lower-bound of the range to be clamped to
   * @param max Upper-bound of the range to be clamped to
   */
  clamp(min: Scalar | Tensor, max?: Scalar | Tensor): Tensor;
  /**
   * Clamps all elements in input into the range `[ min, max ]`.
   *
   * If `min` is `undefined`, there is no lower bound. Or, if `max` is `undefined` there is no upper bound.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.clamp.html}
   *
   * @param options.min Lower-bound of the range to be clamped to
   * @param options.max Upper-bound of the range to be clamped to
   */
  clamp(options: {min?: Scalar | Tensor; max?: Scalar | Tensor}): Tensor;
  /**
   * Returns a contiguous in memory tensor containing the same data as this
   * tensor. If this tensor is already in the specified memory format, this
   * function returns this tensor.
   *
   * @param options.memoryFormat The desired memory format of returned Tensor. Default: torch.contiguousFormat.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.contiguous.html}
   */
  contiguous(options?: {memoryFormat: MemoryFormat}): Tensor;
  /**
   * Returns the tensor data as `TypedArray` buffer.
   *
   * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray}
   *
   * A valid TypeScript expression is as follows:
   *
   * ```typescript
   * torch.rand([2, 3]).data()[3];
   * ```
   *
   * :::note
   *
   * The function only exists in JavaScript.
   *
   * :::
   *
   * @experimental
   */
  data(): TypedArray;
  /**
   * Divides each element of the input input by the corresponding element of
   * other.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.div.html}
   *
   * @param other Scalar or tensor that divides each element in this tensor.
   * @param options.roundingMode Type of rounding applied to the result
   */
  div(
    other: Scalar | Tensor,
    options?: {roundingMode?: 'trunc' | 'floor'},
  ): Tensor;
  /**
   * A dtype is an string that represents the data type of a torch.Tensor.
   *
   * {@link https://pytorch.org/docs/1.12/tensor_attributes.html}
   */
  dtype: Dtype;
  /**
   * Returns a new view of the tensor expanded to a larger size.
   *
   * {@link https://pytorch.org/docs/stable/generated/torch.Tensor.expand.html}
   *
   * @param sizes The expanded size, eg: ([3, 4]).
   */
  expand(sizes: number[]): Tensor;
  /**
   * Reverse the order of a n-D tensor along given axis in dims.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.flip.html}
   *
   * @param dims Axis to flip on.
   */
  flip(dims: number[]): Tensor;
  /**
   * Returns the value of this tensor as a `number`. This only works for
   * tensors with one element.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.item.html}
   */
  item(): number;
  /**
   * Performs matrix multiplication with other tensor.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.matmul.html}
   *
   * @param other tensor matrix multiplied this tensor.
   */
  matmul(other: Tensor): Tensor;
  /**
   * Multiplies input by other scalar or tensor.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.mul.html}
   *
   * @param other Scalar or tensor multiplied with each element in this tensor.
   */
  mul(other: Scalar | Tensor): Tensor;
  /**
   * Returns a view of the original tensor input with its dimensions permuted.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.permute.html}
   *
   * @param dims The desired ordering of dimensions.
   */
  permute(dims: number[]): Tensor;
  /**
   * Returns a tensor with the same data and number of elements as input, but
   * with the specified shape.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.reshape.html}
   *
   * @param shape The new shape.
   */
  reshape(shape: number[]): Tensor;
  /**
   * Returns the size of the tensor.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.size.html}
   */
  shape: number[];
  /**
   * Returns the size of the tensor.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.size.html}
   */
  size(): number[];
  /**
   * Applies a softmax function. It is applied to all slices along dim, and
   * will re-scale them so that the elements lie in the range `[0, 1]` and sum
   * to `1`.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.nn.functional.softmax.html}
   *
   * @param dim A dimension along which softmax will be computed.
   */
  softmax(dim: number): Tensor;
  /**
   * Computes the square-root value of each element in input.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.sqrt.html}
   */
  sqrt(): Tensor;
  /**
   * Returns a tensor with all the dimensions of input of size 1 removed.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.squeeze.html}
   *
   * @param dim If given, the input will be squeezed only in this dimension.
   */
  squeeze(dim?: number): Tensor;
  /**
   * Returns the stride of the tensor.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.stride.html}
   */
  stride(): number[];
  /**
   * Returns the stride of the tensor.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.stride.html}
   *
   * @param dim The desired dimension in which stride is required.
   */
  stride(dim: number): number;
  /**
   * Subtracts other from input.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.sub.html}
   *
   * @param other The scalar or tensor to subtract from input.
   * @param options.alpha The multiplier for `other`. Default: `1`.
   */
  sub(other: Scalar | Tensor, options?: {alpha?: Number}): Tensor;
  /**
   * Returns the sum of all elements in the input tensor.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.sum.html}
   */
  sum(): Tensor;
  /**
   * Returns the sum of each row of the input tensor in the given dimension dim.
   * If dim is a list of dimensions, reduce over all of them.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.sum.html}
   *
   * @param dim The dimension or dimensions to reduce.
   * @param options.keepdim Whether the output tensor has `dim` retained or not.
   */
  sum(dim: number | number[], options?: {keepdim?: boolean}): Tensor;
  /**
   * Performs Tensor conversion.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.to.html}
   *
   * @param options Tensor options.
   */
  to(options: TensorOptions): Tensor;
  /**
   * Returns a list of two Tensors where the first represents the k largest elements of the given input tensor,
   * and the second represents the indices of the k largest elements.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.topk.html}
   *
   * @param k The k in "top-k"
   * @param options topk Options as keywords argument in pytorch
   * @param options.dim The dimension to sort along. If dim is not given, the last dimension of the input is chosen.
   * @param options.largest Controls whether to return largest or smallest elements. It is set to True by default.
   * @param options.sorted Controls whether to return the elements in sorted order. It is set to True by default.
   */
  topk(
    k: number,
    options?: {dim?: number; largest?: boolean; sorted?: boolean},
  ): [Tensor, Tensor];
  /**
   * Returns a new tensor with a dimension of size one inserted at the
   * specified position.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.unsqueeze.html}
   *
   * @param dim The index at which to insert the singleton dimension.
   */
  unsqueeze(dim: number): Tensor;
  /**
   * Access tensor with index.
   *
   * ```typescript
   * const tensor = torch.rand([2]);
   * console.log(tensor.data, tensor[0].data);
   * // [0.8339180946350098, 0.17733973264694214], [0.8339180946350098]
   * ```
   *
   * {@link https://pytorch.org/cppdocs/notes/tensor_indexing.html}
   */
  [index: number]: Tensor;
}
"""
