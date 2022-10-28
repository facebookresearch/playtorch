# Copyright (c) Meta Platforms, Inc. and affiliates.
#
# This source code is licensed under the MIT license found in the
# LICENSE file in the root directory of this source tree.

from ..codegen.code_strings import (
    cpp_end_namespace,
    cpp_file_end,
    cpp_file_start,
    cpp_function_implementation_end,
    cpp_function_implementation_start,
    cpp_start_namespace,
    cpp_throw_BigInt,
    cpp_throw_error_template,
    cpp_try_signature_template,
    get_argument_string,
    get_check_argument_types_string,
    get_returns_string,
    set_property_host_function_template,
    tensor_host_object_start,
)
from ..codegen.op_data_structures import OpGroup, OpInfo

bigint_error_ops = ["item"]

js_only_ops = ["data"]


def gen_cpp_func(op: OpInfo):
    check_argument_types_string = get_check_argument_types_string(op)
    arguments_string = "\n".join(
        [get_argument_string(op.arguments[i], i) for i in range(len(op.arguments))]
    )
    all_args_implemented = True
    for argument in op.arguments:
        if not argument.implemented:
            all_args_implemented = False
            break
    op.implemented = all_args_implemented
    returns_string = get_returns_string(op) if op.implemented else ""
    code_string = cpp_try_signature_template.substitute(
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
    function_string = cpp_function_implementation_start.substitute(
        {"operator_name": op_group.name, "num_required_args": op_group.min_num_required}
    )
    if op_group.name in bigint_error_ops:
        function_string += cpp_throw_BigInt.substitute({"op_name": op_group.name})
    op_group.ops.sort(key=lambda op: op.num_required, reverse=True)
    for op in op_group.ops:
        function_string += gen_cpp_func(op)
    signatures_string = ", ".join(
        [op.schema_order_cpp_signature for op in op_group.ops]
    )
    function_string += cpp_throw_error_template.substitute(
        {"op_name": op.name, "signatures": signatures_string}
    )
    function_string += "\n"
    function_string += cpp_function_implementation_end
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

    file_string = cpp_file_start

    file_string += cpp_start_namespace
    for func_impl in function_impls:
        file_string += func_impl
    file_string += cpp_end_namespace

    file_string += tensor_host_object_start

    set_property_host_functions = [
        set_property_host_function_template.substitute(
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
    file_string += cpp_file_end
    return file_string
