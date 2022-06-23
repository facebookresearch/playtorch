/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include <c10/core/MemoryFormat.h>
#include <c10/util/Optional.h>

#include "TensorHostObject.h"
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
  auto tensor = args.thisAsHostObject<TensorHostObject>()->tensor.abs();
  return utils::helpers::createFromHostObject<TensorHostObject>(
      runtime, std::move(tensor));
}

jsi::Value addImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto thiz = args.thisAsHostObject<TensorHostObject>();

  auto alphaValue = args.keywordValue(1, "alpha");
  auto alphaScalar = alphaValue.isUndefined()
      ? at::Scalar(1)
      : at::Scalar(alphaValue.asNumber());

  torch_::Tensor tensor;
  if (args[0].isNumber()) {
    auto scalar = args[0].asNumber();
    tensor = thiz->tensor.add(scalar, alphaScalar);
  } else {
    auto otherTensor = args.asHostObject<TensorHostObject>(0)->tensor;
    tensor = thiz->tensor.add(otherTensor, alphaScalar);
  }

  return utils::helpers::createFromHostObject<TensorHostObject>(
      runtime, std::move(tensor));
}

jsi::Value argmaxImpl(
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
        runtime, "expect 'keepdim' to be boolean, but another type is given.");
  }

  // transform the tensor to dtype of Int32 because Hermes doesn't support
  // BigInt yet.
  auto tensor = thiz->tensor.argmax(dim, keepdim)
                    .to(torch_::TensorOptions().dtype(torch_::kInt32));
  return utils::helpers::createFromHostObject<TensorHostObject>(
      runtime, std::move(tensor));
};

jsi::Value clampImp(
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

jsi::Value contiguousImpl(
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

jsi::Value dataImpl(
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

jsi::Value divImpl(
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

jsi::Value itemImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  auto thiz =
      thisValue.asObject(runtime).asHostObject<TensorHostObject>(runtime);

  // TODO(T113480543): enable BigInt once Hermes supports it
  if (thiz->tensor.dtype() == torch_::kInt64) {
    throw jsi::JSError(
        runtime,
        "the property 'item' for a tensor of dtype torch.int64 is not"
        " supported. Work around this with .to({dtype: torch.int32})"
        " This might alter the tensor values.");
  }

  auto scalar = thiz->tensor.item();
  if (scalar.isIntegral(/*includeBool=*/false)) {
    return jsi::Value(scalar.toInt());
  } else if (scalar.isFloatingPoint()) {
    return jsi::Value(scalar.toDouble());
  } else {
    throw jsi::JSError(runtime, "unsupported dtype for item().");
  }
}

jsi::Value mulImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto thiz = args.thisAsHostObject<TensorHostObject>();

  torch_::Tensor tensor;
  if (args[0].isNumber()) {
    auto scalar = args[0].asNumber();
    tensor = thiz->tensor.mul(scalar);
  } else {
    auto otherTensor = args.asHostObject<TensorHostObject>(0)->tensor;
    tensor = thiz->tensor.mul(otherTensor);
  }
  return utils::helpers::createFromHostObject<TensorHostObject>(
      runtime, std::move(tensor));
}

jsi::Value permuteImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto dims = args.dimsVarArgs(0);
  auto tensor = args.thisAsHostObject<TensorHostObject>()->tensor.permute(dims);
  return utils::helpers::createFromHostObject<TensorHostObject>(
      runtime, std::move(tensor));
}

jsi::Value reshapeImpl(
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

jsi::Value softmaxImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto dim = args.asInteger(0);
  auto tensor = args.thisAsHostObject<TensorHostObject>()->tensor.softmax(dim);
  return utils::helpers::createFromHostObject<TensorHostObject>(
      runtime, std::move(tensor));
};

jsi::Value squeezeImpl(
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

jsi::Value sqrtImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  auto tensor = args.thisAsHostObject<TensorHostObject>()->tensor.sqrt();
  return utils::helpers::createFromHostObject<TensorHostObject>(
      runtime, std::move(tensor));
}

jsi::Value strideImpl(
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

jsi::Value subImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);
  auto thiz = args.thisAsHostObject<TensorHostObject>();

  auto alphaValue = args.keywordValue(1, "alpha");
  auto alphaScalar = alphaValue.isUndefined()
      ? at::Scalar(1)
      : at::Scalar(alphaValue.asNumber());

  torch_::Tensor tensor;
  if (args[0].isNumber()) {
    auto scalar = args[0].asNumber();
    tensor = thiz->tensor.sub(scalar, alphaScalar);
  } else {
    auto otherTensor = args.asHostObject<TensorHostObject>(0)->tensor;
    tensor = thiz->tensor.sub(otherTensor, alphaScalar);
  }

  return utils::helpers::createFromHostObject<TensorHostObject>(
      runtime, std::move(tensor));
}

jsi::Value sumImpl(
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

jsi::Value toImpl(
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

jsi::Value topkImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  utils::ArgumentParser args(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);

  auto k = args[0].asNumber();
  auto resultTuple = args.thisAsHostObject<TensorHostObject>()->tensor.topk(k);
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

jsi::Value unsqueezeImpl(
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

} // namespace

TensorHostObject::TensorHostObject(jsi::Runtime& runtime, torch_::Tensor t)
    : BaseHostObject(runtime),
      size_(createSize(runtime)),
      toString_(createToString(runtime)),
      tensor(t) {
  setPropertyHostFunction(runtime, "abs", 0, absImpl);
  setPropertyHostFunction(runtime, "add", 1, addImpl);
  setPropertyHostFunction(runtime, "argmax", 0, argmaxImpl);
  setPropertyHostFunction(runtime, "clamp", 1, clampImp);
  setPropertyHostFunction(runtime, "contiguous", 0, contiguousImpl);
  setPropertyHostFunction(runtime, "data", 0, dataImpl);
  setPropertyHostFunction(runtime, "div", 1, divImpl);
  setPropertyHostFunction(runtime, "item", 0, itemImpl);
  setPropertyHostFunction(runtime, "mul", 1, mulImpl);
  setPropertyHostFunction(runtime, "permute", 1, permuteImpl);
  setPropertyHostFunction(runtime, "reshape", 1, reshapeImpl);
  setPropertyHostFunction(runtime, "softmax", 1, softmaxImpl);
  setPropertyHostFunction(runtime, "squeeze", 1, squeezeImpl);
  setPropertyHostFunction(runtime, "sqrt", 0, sqrtImpl);
  setPropertyHostFunction(runtime, "stride", 0, strideImpl);
  setPropertyHostFunction(runtime, "sub", 1, subImpl);
  setPropertyHostFunction(runtime, "sum", 0, sumImpl);
  setPropertyHostFunction(runtime, "to", 1, toImpl);
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
  } catch (const std::exception& e) {
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
