/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include <ATen/NativeFunctions.h>
#include <jsi/jsi.h>
#include <torch/script.h>
#include <string>
#include <vector>

#include "utils/ArgumentParser.h"
#include "utils/constants.h"
#include "utils/helpers.h"

namespace torch_ = torch;

namespace torchlive {
namespace torch {

using namespace facebook;

class TensorHostObjectDeprecated {
 public:
  static jsi::Value argmaxImpl(
      jsi::Runtime& runtime,
      const jsi::Value& thisValue,
      const jsi::Value* arguments,
      size_t count) {
    utils::ArgumentParser args(runtime, thisValue, arguments, count);
    auto thiz = args.thisAsHostObject<TensorHostObject>();

    auto dimValue = args.keywordValue(0, "dim");
    c10::optional<int64_t> dim = c10::nullopt;
    if (!dimValue.isUndefined()) {
      dim = dimValue.asNumber();
    }

    auto keepdimValue = args.keywordValue(0, "keepdim");
    bool keepdim = false;
    if (keepdimValue.isBool()) {
      keepdim = keepdimValue.getBool();
    } else if (!keepdimValue.isUndefined()) {
      throw jsi::JSError(
          runtime,
          "expect 'keepdim' to be boolean, but another type is given.");
    }

    // transform the tensor to dtype of Int32 because Hermes doesn't support
    // BigInt yet.
    auto tensor = thiz->tensor.argmax(dim, keepdim)
                      .to(torch_::TensorOptions().dtype(torch_::kInt32));
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(tensor));
  };

  static jsi::Value argminImpl(
      jsi::Runtime& runtime,
      const jsi::Value& thisValue,
      const jsi::Value* arguments,
      size_t count) {
    utils::ArgumentParser args(runtime, thisValue, arguments, count);
    auto thiz = args.thisAsHostObject<TensorHostObject>();

    auto dimValue = args.keywordValue(0, "dim");
    c10::optional<int64_t> dim = c10::nullopt;
    if (!dimValue.isUndefined()) {
      dim = dimValue.asNumber();
    }

    auto keepdimValue = args.keywordValue(0, "keepdim");
    bool keepdim = false;
    if (keepdimValue.isBool()) {
      keepdim = keepdimValue.getBool();
    } else if (!keepdimValue.isUndefined()) {
      throw jsi::JSError(
          runtime,
          "expect 'keepdim' to be boolean, but another type is given.");
    }

    // transform the tensor to dtype of Int32 because Hermes doesn't support
    // BigInt yet.
    auto tensor = thiz->tensor.argmin(dim, keepdim)
                      .to(torch_::TensorOptions().dtype(torch_::kInt32));
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(tensor));
  };

  static jsi::Value clampImpl(
      jsi::Runtime& runtime,
      const jsi::Value& thisValue,
      const jsi::Value* arguments,
      size_t count) {
    utils::ArgumentParser args(runtime, thisValue, arguments, count);
    args.requireNumArguments(1);

    auto thiz = args.thisAsHostObject<TensorHostObject>();
    auto minValue = args.keywordValue(0, "min");
    auto maxValue = args.keywordValue(0, "max");
    torch_::Tensor tensor;

    if (minValue.isUndefined() && maxValue.isUndefined()) {
      // No keyword arguments
      if (args[0].isNumber()) {
        auto min = args[0].asNumber();
        c10::optional<at::Scalar> max = c10::nullopt;
        if (count > 1) {
          max = args[1].asNumber();
        }
        tensor = thiz->tensor.clamp(min, max);
      } else {
        auto minTensor = args.asHostObject<TensorHostObject>(0)->tensor;
        c10::optional<at::Tensor> maxTensor = {};
        if (count > 1) {
          maxTensor = args.asHostObject<TensorHostObject>(1)->tensor;
        }
        tensor = thiz->tensor.clamp(minTensor, maxTensor);
      }
    } else {
      // Keyword arguments
      c10::optional<at::Scalar> minScalar = c10::nullopt;
      c10::optional<at::Scalar> maxScalar = c10::nullopt;
      c10::optional<at::Tensor> minTensor = {};
      c10::optional<at::Tensor> maxTensor = {};
      bool isScalarArg = false;

      if (!minValue.isUndefined()) {
        if (minValue.isNumber()) {
          minScalar = minValue.asNumber();
          isScalarArg = true;
        } else {
          minTensor = utils::helpers::parseTensor(runtime, &minValue)->tensor;
        }
      }

      if (!maxValue.isUndefined()) {
        if (maxValue.isNumber()) {
          maxScalar = maxValue.asNumber();
          isScalarArg = true;
        } else {
          maxTensor = utils::helpers::parseTensor(runtime, &maxValue)->tensor;
        }
      }

      if (isScalarArg) {
        tensor = thiz->tensor.clamp(minScalar, maxScalar);
      } else {
        tensor = thiz->tensor.clamp(minTensor, maxTensor);
      }
    }

    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(tensor));
  }

  static jsi::Value contiguousImpl(
      jsi::Runtime& runtime,
      const jsi::Value& thisValue,
      const jsi::Value* arguments,
      size_t count) {
    /*
    Note that memory format is not a positional argument:

    >>> torch.ones(3).contiguous(torch.contiguous_format)
    Traceback (most recent call last):
      File "<stdin>", line 1, in <module>
    TypeError: contiguous() takes 0 positional arguments but 1 was given
    */
    utils::ArgumentParser args(runtime, thisValue, arguments, count);

    torch_::Tensor tensor;
    auto memoryFormatValue = args.keywordValue(0, "memoryFormat");
    if (memoryFormatValue.isUndefined()) {
      tensor = args.thisAsHostObject<TensorHostObject>()->tensor.contiguous();
    } else {
      auto memoryFormatArg = memoryFormatValue.asString(runtime).utf8(runtime);
      c10::MemoryFormat memoryFormat;
      if (memoryFormatArg == utils::constants::CHANNELS_LAST) {
        memoryFormat = c10::MemoryFormat::ChannelsLast;
      } else if (memoryFormatArg == utils::constants::CONTIGUOUS_FORMAT) {
        memoryFormat = c10::MemoryFormat::Contiguous;
      } else if (memoryFormatArg == utils::constants::PRESERVE_FORMAT) {
        memoryFormat = c10::MemoryFormat::Preserve;
      } else {
        throw jsi::JSError(runtime, "unknown memory format " + memoryFormatArg);
      }
      tensor = args.thisAsHostObject<TensorHostObject>()->tensor.contiguous(
          memoryFormat);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(tensor));
  }

  static jsi::Value dataImpl(
      jsi::Runtime& runtime,
      const jsi::Value& thisValue,
      const jsi::Value* arguments,
      size_t count) {
    utils::ArgumentParser args(runtime, thisValue, arguments, count);
    const auto& tensor = args.thisAsHostObject<TensorHostObject>()->tensor;

    int byteLength = tensor.nbytes();
    auto type = tensor.dtype();

    // TODO(T113480543): enable BigInt data view once Hermes support the
    // BigIntArray
    if (type == torch_::kInt64) {
      throw jsi::JSError(
          runtime,
          "the property 'data' for a tensor of dtype torch.int64 is not"
          " supported. Work around this with .to({dtype: torch.int32})"
          " This might alter the tensor values.");
    }

    std::string typedArrayName;
    if (type == torch_::kUInt8) {
      typedArrayName = "Uint8Array";
    } else if (type == torch_::kInt8) {
      typedArrayName = "Int8Array";
    } else if (type == torch_::kInt16) {
      typedArrayName = "Int16Array";
    } else if (type == torch_::kInt32) {
      typedArrayName = "Int32Array";
    } else if (type == torch_::kFloat32) {
      typedArrayName = "Float32Array";
    } else if (type == torch_::kFloat64) {
      typedArrayName = "Float64Array";
    } else {
      throw jsi::JSError(runtime, "tensor data dtype is not supported");
    }

    jsi::ArrayBuffer buffer = runtime.global()
                                  .getPropertyAsFunction(runtime, "ArrayBuffer")
                                  .callAsConstructor(runtime, byteLength)
                                  .asObject(runtime)
                                  .getArrayBuffer(runtime);

    std::memcpy(buffer.data(runtime), tensor.data_ptr(), byteLength);

    return runtime.global()
        .getPropertyAsFunction(runtime, typedArrayName.c_str())
        .callAsConstructor(runtime, buffer)
        .asObject(runtime);
  }

  static jsi::Value divImpl(
      jsi::Runtime& runtime,
      const jsi::Value& thisValue,
      const jsi::Value* arguments,
      size_t count) {
    utils::ArgumentParser args(runtime, thisValue, arguments, count);
    args.requireNumArguments(1);
    auto thiz = args.thisAsHostObject<TensorHostObject>();

    auto roundingModeValue = args.keywordValue(1, "roundingMode");

    c10::optional<c10::string_view> roundingMode;
    if (!roundingModeValue.isUndefined()) {
      roundingMode = roundingModeValue.asString(runtime).utf8(runtime);
    }

    torch_::Tensor tensor;
    if (args[0].isNumber()) {
      auto scalar = args[0].asNumber();
      tensor = thiz->tensor.div(scalar, roundingMode);
    } else {
      auto otherTensor = args.asHostObject<TensorHostObject>(0)->tensor;
      tensor = thiz->tensor.div(otherTensor, roundingMode);
    }
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(tensor));
  }

  static jsi::Value expandImpl(
      jsi::Runtime& runtime,
      const jsi::Value& thisValue,
      const jsi::Value* arguments,
      size_t count) {
    utils::ArgumentParser args(runtime, thisValue, arguments, count);
    auto thiz = args.thisAsHostObject<TensorHostObject>();
    args.requireNumArguments(1);

    std::vector<int64_t> dimensions = {};
    utils::helpers::parseSize(runtime, arguments, 0, count, &dimensions);

    auto tensor = thiz->tensor.expand(c10::ArrayRef<int64_t>(dimensions));

    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(tensor));
  }

  static jsi::Value flipImpl(
      jsi::Runtime& runtime,
      const jsi::Value& thisValue,
      const jsi::Value* arguments,
      size_t count) {
    utils::ArgumentParser args(runtime, thisValue, arguments, count);
    args.requireNumArguments(1);
    auto thiz = args.thisAsHostObject<TensorHostObject>();

    std::vector<int64_t> dims = {};
    utils::helpers::parseSize(runtime, arguments, 0, count, &dims);

    auto tensor = thiz->tensor.flip(dims);

    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(tensor));
  }

  static jsi::Value permuteImpl(
      jsi::Runtime& runtime,
      const jsi::Value& thisValue,
      const jsi::Value* arguments,
      size_t count) {
    utils::ArgumentParser args(runtime, thisValue, arguments, count);
    args.requireNumArguments(1);
    auto dims = args.dimsVarArgs(0);
    auto tensor =
        args.thisAsHostObject<TensorHostObject>()->tensor.permute(dims);
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(tensor));
  }

  static jsi::Value reshapeImpl(
      jsi::Runtime& runtime,
      const jsi::Value& thisValue,
      const jsi::Value* arguments,
      size_t count) {
    utils::ArgumentParser args(runtime, thisValue, arguments, count);
    args.requireNumArguments(1);
    auto shape = args.dimsVarArgs(0);
    auto tensor =
        args.thisAsHostObject<TensorHostObject>()->tensor.reshape(shape);
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(tensor));
  }

  static jsi::Value softmaxImpl(
      jsi::Runtime& runtime,
      const jsi::Value& thisValue,
      const jsi::Value* arguments,
      size_t count) {
    utils::ArgumentParser args(runtime, thisValue, arguments, count);
    args.requireNumArguments(1);
    auto dim = args.asInteger(0);
    auto tensor =
        args.thisAsHostObject<TensorHostObject>()->tensor.softmax(dim);
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(tensor));
  };

  static jsi::Value squeezeImpl(
      jsi::Runtime& runtime,
      const jsi::Value& thisValue,
      const jsi::Value* arguments,
      size_t count) {
    utils::ArgumentParser args(runtime, thisValue, arguments, count);
    auto thiz = args.thisAsHostObject<TensorHostObject>();

    torch_::Tensor tensor;
    if (count >= 1) {
      auto dim = args.asInteger(0);
      tensor = thiz->tensor.squeeze(dim);
    } else { // count == 0
      tensor = thiz->tensor.squeeze();
    }

    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(tensor));
  }

  static jsi::Value strideImpl(
      jsi::Runtime& runtime,
      const jsi::Value& thisValue,
      const jsi::Value* arguments,
      size_t count) {
    utils::ArgumentParser args(runtime, thisValue, arguments, count);
    const auto& tensor = args.thisAsHostObject<TensorHostObject>()->tensor;

    if (count > 0) {
      // Return stride of the specified dimension
      auto dim = args.asInteger(0);
      return static_cast<int>(tensor.stride(dim));
    } else {
      // Return strides of all dimensions
      const torch_::IntArrayRef strides = tensor.strides();
      jsi::Array jsStrides{runtime, strides.size()};
      for (auto i = 0; i < strides.size(); i++) {
        jsStrides.setValueAtIndex(runtime, i, static_cast<int>(strides[i]));
      }
      return jsStrides;
    }
  }

  static jsi::Value sumImpl(
      jsi::Runtime& runtime,
      const jsi::Value& thisValue,
      const jsi::Value* arguments,
      size_t count) {
    utils::ArgumentParser args(runtime, thisValue, arguments, count);
    auto thiz = args.thisAsHostObject<TensorHostObject>();

    torch_::Tensor tensor;
    if (count == 0) {
      tensor = thiz->tensor.sum();
    } else {
      size_t nextArgIdx;
      auto dims = args.dimsVarArgs(0, &nextArgIdx);
      auto keepdimValue = args.keywordValue(nextArgIdx, "keepdim");
      if (keepdimValue.isUndefined()) {
        tensor = thiz->tensor.sum(dims);
      } else if (keepdimValue.isBool()) {
        auto keepdim = keepdimValue.getBool();
        tensor = thiz->tensor.sum(dims, keepdim);
      } else {
        throw jsi::JSError(
            runtime,
            "expect 'keepdim' to be boolean, but another type is given.");
      }
    }

    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(tensor));
  };

  static jsi::Value toImpl(
      jsi::Runtime& runtime,
      const jsi::Value& thisValue,
      const jsi::Value* arguments,
      size_t count) {
    utils::ArgumentParser args(runtime, thisValue, arguments, count);
    args.requireNumArguments(1);
    auto tensorOptions = args.tensorOptions(0);
    auto tensor =
        args.thisAsHostObject<TensorHostObject>()->tensor.to(tensorOptions);
    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(tensor));
  };

  static jsi::Value topkImpl(
      jsi::Runtime& runtime,
      const jsi::Value& thisValue,
      const jsi::Value* arguments,
      size_t count) {
    utils::ArgumentParser args(runtime, thisValue, arguments, count);
    args.requireNumArguments(1);

    auto k = args[0].asNumber();

    auto dimValue = args.keywordValue(1, "dim");
    int64_t dim = -1;
    if (!dimValue.isUndefined()) {
      dim = dimValue.asNumber();
    }

    auto largestValue = args.keywordValue(1, "largest");
    bool largest = true;
    if (largestValue.isBool()) {
      largest = largestValue.getBool();
    } else if (!largestValue.isUndefined()) {
      throw jsi::JSError(
          runtime,
          "expect 'largest' to be boolean, but another type is given.");
    }

    auto sortedValue = args.keywordValue(1, "sorted");
    bool sorted = true;
    if (sortedValue.isBool()) {
      sorted = sortedValue.getBool();
    } else if (!sortedValue.isUndefined()) {
      throw jsi::JSError(
          runtime, "expect 'sorted' to be boolean, but another type is given.");
    }

    auto resultTuple = args.thisAsHostObject<TensorHostObject>()->tensor.topk(
        k, dim, largest, sorted);
    auto values = utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::get<0>(resultTuple));
    /**
     * NOTE: We need to convert the int64 type to int32 since Hermes does not
     * support Int64 data types yet.
     */
    auto indicesInt64Tensor = std::get<1>(resultTuple);
    auto indices = utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, indicesInt64Tensor.to(c10::ScalarType::Int));

    return jsi::Array::createWithElements(runtime, values, indices);
  };

  static jsi::Value unsqueezeImpl(
      jsi::Runtime& runtime,
      const jsi::Value& thisValue,
      const jsi::Value* arguments,
      size_t count) {
    utils::ArgumentParser args(runtime, thisValue, arguments, count);
    args.requireNumArguments(1);

    auto dim = args.asInteger(0);
    auto tensor =
        args.thisAsHostObject<TensorHostObject>()->tensor.unsqueeze(dim);

    return utils::helpers::createFromHostObject<TensorHostObject>(
        runtime, std::move(tensor));
  }
};
} // namespace torch
} // namespace torchlive
