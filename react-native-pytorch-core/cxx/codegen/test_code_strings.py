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
