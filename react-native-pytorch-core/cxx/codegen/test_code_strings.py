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
