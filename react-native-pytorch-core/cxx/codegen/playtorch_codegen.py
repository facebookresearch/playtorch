# Copyright (c) Meta Platforms, Inc. and affiliates.
#
# This source code is licensed under the MIT license found in the
# LICENSE file in the root directory of this source tree.

from ..codegen.code_strings import cpp_code_strings
from ..codegen.op_data_structures import Argument, OpGroup, OpInfo

bigint_error_ops = ["item"]

js_only_ops = ["data"]


def get_check_argument_types_string(op: OpInfo):
    condition_list = [
        cpp_code_strings.at_least_num_arguments_template.substitute(
            {"num_args": op.num_required}
        )
    ]
    for i, arg in enumerate(op.arguments[1:]):  # first argument is always self
        substitutions = {"name": arg.name}
        try:
            if arg.is_kwarg():
                substitutions["idx"] = op.options_index
                substitutions["required"] = "true" if arg.is_required() else "false"
                condition_list.append(
                    cpp_code_strings.check_kword_argument_type_templates[
                        arg.type_
                    ].substitute(substitutions)
                )
            else:
                substitutions["idx"] = i
                condition_list.append(
                    cpp_code_strings.check_argument_type_templates[
                        arg.type_
                    ].substitute(substitutions)
                )
        except KeyError:
            return "false"  # we don't want to enter that if block if the argument type hasn't been implemented yet
    return " && ".join(condition_list)


def get_argument_string(argument: Argument, index: int) -> str:
    try:
        substitutions = {
            "arg_index": index,
            "name": argument.name,
            "default": argument.default,
        }
        if argument.is_kwarg():
            if argument.is_required():
                argument_template = (
                    cpp_code_strings.required_kword_argument_string_templates[
                        argument.type_
                    ]
                )
            else:
                argument_template = cpp_code_strings.kword_argument_string_templates[
                    argument.type_
                ]
        else:
            argument_template = cpp_code_strings.positional_argument_string_templates[
                argument.type_
            ]
        argument_string = argument_template.substitute(substitutions)
        argument.implemented = True
        return argument_string
    except KeyError:
        error_template = cpp_code_strings.argument_string_error_template
        return error_template.substitute({"arg_type": argument.type_})


def get_returns_string(op: OpInfo) -> str:
    try:
        return cpp_code_strings.returns_type_templates[op.returns[0].type_].substitute(
            {
                "return_type": op.returns[0].type_,
                "returns_name": op.returns[0].name,
                "operator_name": op.name,
                "arguments": ", ".join([arg.name for arg in op.arguments[1:]])
                if len(op.arguments) > 1
                else "",
                "self": op.arguments[0].name,
            }
        )
    except KeyError:
        op.implemented = False
        error_template = cpp_code_strings.returns_string_error_template
        return error_template.substitute({"return_type": op.returns_type})


def gen_cpp_func(op: OpInfo):
    check_argument_types_string = get_check_argument_types_string(op)
    arguments_string = "\n".join(
        [
            get_argument_string(arg, op.options_index if arg.is_kwarg() else i)
            for i, arg in enumerate(op.arguments[1:])
        ]
    )
    all_args_implemented = True
    for argument in op.arguments[1:]:
        if not argument.implemented:
            all_args_implemented = False
            break
    op.implemented = all_args_implemented
    returns_string = get_returns_string(op) if op.implemented else ""
    code_string = cpp_code_strings.try_signature_template.substitute(
        {
            "check_argument_types": check_argument_types_string,
            "get_arguments_string": arguments_string,
            "get_returns_string": returns_string,
            "signature": op.schema_order_cpp_signature,
        }
    )
    return code_string


def gen_cpp_func_impl(op_group: OpGroup) -> str:
    if op_group.name in js_only_ops:
        return ""  # These functions have been hard coded in cpp_start_namespace
    function_string = cpp_code_strings.function_implementation_start.substitute(
        {"operator_name": op_group.name, "num_required_args": op_group.min_num_required}
    )
    if op_group.name in bigint_error_ops:
        function_string += cpp_code_strings.throw_BigInt.substitute(
            {"op_name": op_group.name}
        )
    op_group.ops.sort(key=lambda op: op.num_required, reverse=True)
    function_string += cpp_code_strings.get_self_template.substitute(
        {"name": op_group.ops[0].arguments[0].name}
    )
    for op in op_group.ops:
        function_string += gen_cpp_func(op)
    signatures_string = ", ".join(
        [op.schema_order_cpp_signature for op in op_group.ops]
    )
    function_string += cpp_code_strings.throw_error_template.substitute(
        {"op_name": op.name, "signatures": signatures_string}
    )
    function_string += "\n"
    function_string += cpp_code_strings.function_implementation_end
    function_string += "\n"
    all_ops_implemented = True
    for op in op_group.ops:
        if not op.implemented:
            all_ops_implemented = False
            break
    op_group.implemented = all_ops_implemented
    return function_string


def gen_cpp_file(ops) -> str:
    sorted_ops = list(ops.keys())
    sorted_ops.sort()
    function_impls = [gen_cpp_func_impl(ops[op_name]) for op_name in sorted_ops]

    function_impls = [
        function_impls[i]
        if ops[sorted_ops[i]].implemented and sorted_ops[i] not in js_only_ops
        else ""
        for i in range(len(sorted_ops))
    ]

    file_string = cpp_code_strings.file_start

    file_string += cpp_code_strings.start_namespace
    for func_impl in function_impls:
        file_string += func_impl
    file_string += cpp_code_strings.end_namespace

    file_string += cpp_code_strings.tensor_host_object_start

    set_property_host_functions = [
        cpp_code_strings.set_property_host_function_template.substitute(
            {
                "operator_name": op_name,
                "namespace": "TensorHostObjectDeprecated::"
                if not ops[op_name].implemented or op_name in js_only_ops
                else "",
                "num_required_args": ops[op_name].min_num_required,
            }
        )
        for op_name in sorted_ops
    ]
    for set_property_host_function in set_property_host_functions:
        file_string += set_property_host_function
    file_string += cpp_code_strings.file_end
    return file_string
