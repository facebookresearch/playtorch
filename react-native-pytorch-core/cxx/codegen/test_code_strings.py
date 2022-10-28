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
