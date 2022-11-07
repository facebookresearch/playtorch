# Copyright (c) Meta Platforms, Inc. and affiliates.
#
# This source code is licensed under the MIT license found in the
# LICENSE file in the root directory of this source tree.

from string import Template

from ..codegen.op_data_structures import Argument, OpInfo

# TensorHostObject.cpp

cpp_function_implementation_start = Template(
    """

jsi::Value ${operator_name}Impl(
  jsi::Runtime& runtime,
  const jsi::Value& thisValue,
  const jsi::Value* arguments,
  size_t count) {
    utils::ArgumentParser args(runtime, thisValue, arguments, count);
    args.requireNumArguments(${num_required_args});"""
)

cpp_throw_BigInt = Template(
    """

    // TODO(T113480543): enable BigInt once Hermes supports it
    if (thisValue.asObject(runtime).asHostObject<TensorHostObject>(runtime)->tensor.dtype() == torch_::kInt64) {
      throw jsi::JSError(
        runtime,
        "the property '${op_name}' for a tensor of dtype torch.int64 is not"
        " supported. Work around this with .to({dtype: torch.int32})"
        " This might alter the tensor values.");
    }
"""
)

cpp_at_least_num_arguments_template = Template("args.atLeastNumArguments(${num_args})")

cpp_try_signature_template = Template(
    """
    if(${check_argument_types}) {
        try {
${get_arguments_string}
${get_returns_string}
        } catch (jsi::JSError& error) {
        // Arguments do not match signature ${signature}
        } catch (std::exception& ex) {
            throw std::move(ex);
        }
    }
"""
)

cpp_throw_error_template = Template(
    '    throw facebook::jsi::JSError(runtime, "Arguments for op ${op_name} do not match any of the following signatures:${signatures}");'
)

cpp_function_implementation_end = "  }"

argument_string_templates = {
    "const at::Tensor &_self": Template(
        """            auto ${name} = args.thisAsHostObject<TensorHostObject>();"""
    ),
    "const at::Tensor &_required": Template(
        """            auto ${name} = args.asHostObject<TensorHostObject>(${arg_index})->tensor;"""
    ),
    "const at::Scalar &": Template(
        """            auto ${name}Value = args.keywordValue(${arg_index}, "${name}");
            auto ${name} = ${name}Value.isUndefined() ? at::Scalar(${default}) : at::Scalar(${name}Value.asNumber());"""
    ),
    "const at::Scalar &_required": Template(
        """            auto ${name} = args[${arg_index}].asNumber();"""
    ),
}


def get_argument_string(argument: Argument, index: int) -> str:
    try:
        substitutions = {
            "arg_index": index - 1,
            "name": argument.name,
            "default": argument.default,
        }
        argument_string_key = argument.type_
        if index == 0:
            argument_string_key += "_self"
        else:
            if argument.default is None:
                argument_string_key += "_required"
        argument_string = argument_string_templates[argument_string_key].substitute(
            substitutions
        )
        argument.implemented = True
        return argument_string
    except KeyError:
        error_template = Template(
            '            throw facebook::jsi::JSError(runtime, "Argument parsing for type ${arg_type} has not been implemented yet");'
        )
        return error_template.substitute({"arg_type": argument.type_})


returns_type_templates = {
    "at::Tensor": Template(
        """
            ${return_type} ${returns_name} = ${self}->tensor.${operator_name}(${arguments});
            return utils::helpers::createFromHostObject<TensorHostObject>(runtime, std::move(${returns_name}));"""
    ),
    "at::Scalar": Template(
        """
            auto ${returns_name} = ${self}->tensor.${operator_name}(${arguments});
            if (${returns_name}.isIntegral(/*includeBool=*/false)) {
                return jsi::Value(${returns_name}.toInt());
            } else if (${returns_name}.isFloatingPoint()) {
                return jsi::Value(${returns_name}.toDouble());
            } else {
                throw jsi::JSError(runtime, "unsupported dtype for item().");
            }"""
    ),
}


def get_returns_string(op: OpInfo) -> str:
    try:
        return returns_type_templates[op.returns_type].substitute(
            {
                "return_type": op.returns_type,
                "returns_name": op.returns_name,
                "operator_name": op.name,
                "arguments": ", ".join([arg.name for arg in op.arguments[1:]])
                if len(op.arguments) > 1
                else "",
                "self": op.arguments[0].name,
            }
        )
    except KeyError:
        op.implemented = False
        error_template = Template(
            'throw facebook::jsi::JSError(runtime, "Generating code for return type ${return_type} has not been implemented");'
        )
        return error_template.substitute({"return_type": op.returns_type})


jsi_type_mappings = {"const at::Scalar &": "Number", "const at::Tensor &": "HostObject"}

check_argument_types_template = {
    "Number_required": Template("args[${idx}].isNumber()"),
    "Number": Template(
        '(args.keywordValue(${idx}, "${name}").isUndefined() || args.keywordValue(${idx}, "${name}").isNumber())'
    ),
    "HostObject_required": Template(
        "args[${idx}].isObject() && args[${idx}].asObject(runtime).isHostObject<${HostObjectType}>(runtime)"
    ),
}


def get_check_argument_types_string(op: OpInfo):
    condition_list = [
        cpp_at_least_num_arguments_template.substitute({"num_args": op.num_required})
    ]
    for i in range(1, len(op.arguments)):  # first argument is always self
        arg = op.arguments[i]
        substitutions = {"idx": i - 1, "name": arg.name}
        try:
            jsi_type = jsi_type_mappings[arg.type_]
            if jsi_type == "HostObject":
                substitutions["HostObjectType"] = "TensorHostObject"
            if arg.default is None:
                jsi_type += "_required"
            condition_list.append(
                check_argument_types_template[jsi_type].substitute(substitutions)
            )
        except KeyError:
            return "false"  # we don't want to enter that if block if the argument type hasn't been implemented yet
    return " && ".join(condition_list)
