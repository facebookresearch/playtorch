# Copyright (c) Meta Platforms, Inc. and affiliates.
#
# This source code is licensed under the MIT license found in the
# LICENSE file in the root directory of this source tree.

from ..codegen.code_strings import cpp_code_strings, ts_code_strings
from ..codegen.op_data_structures import Argument, OpGroup, OpInfo
from ..codegen.tensor_interface_deprecated import tensor_interface_deprecated

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


def gen_cpp_code(ops) -> str:
    sorted_ops = list(ops.keys())
    sorted_ops.sort()
    function_impls = [gen_cpp_func_impl(ops[op_name]) for op_name in sorted_ops]

    function_impls = [
        function_impls[i]
        if ops[sorted_ops[i]].implemented and sorted_ops[i] not in js_only_ops
        else ""
        for i in range(len(sorted_ops))
    ]

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
    generated_code = cpp_code_strings.start_namespace
    generated_code += "\n".join(function_impls)
    generated_code += cpp_code_strings.end_namespace
    generated_code += cpp_code_strings.tensor_host_object_start
    generated_code += "\n".join(set_property_host_functions)
    generated_code += cpp_code_strings.tensor_host_object_end
    return generated_code


def gen_ts_arguments_string(op: OpInfo) -> str:
    argument_strings = []
    options = []
    for arg in op.arguments[1 : op.options_index + 1]:
        if arg.default is None:
            argument_strings.append(
                ts_code_strings.arg_template.substitute(
                    {
                        "name": arg.name,
                        "type": ts_code_strings.required_argument_type_mappings[
                            arg.type_
                        ],
                    }
                )
            )
    for arg in op.arguments[op.options_index + 1 :]:
        name = arg.name + ("?" if arg.default is not None else "")
        key = (
            arg.type_
            if not arg.type_ == "c10::optional<c10::string_view>"
            else arg.type_ + "_" + op.name + "_" + arg.name
        )
        type_ = (
            ts_code_strings.optional_argument_type_mappings[key]
            if arg.default is not None
            else ts_code_strings.required_argument_type_mappings[key]
        )
        options.append(
            ts_code_strings.arg_template.substitute(
                {
                    "name": name,
                    "type": type_,
                }
            )
        )
    if len(options) > 0:
        argument_strings.append(
            ts_code_strings.options_template.substitute(
                {
                    "question_mark": ""
                    if any(
                        [
                            arg.default is None
                            for arg in op.arguments[op.options_index + 1 :]
                        ]
                    )
                    else "?",
                    "optional_arguments": ", ".join(options),
                }
            )
        )
    return "(" + ", ".join(argument_strings) + ")"


def gen_ts_params_string(op: OpInfo) -> str:
    params = []
    for arg in op.arguments[1 : op.options_index + 1]:
        params.append(
            ts_code_strings.param_template.substitute(
                {
                    "name": arg.name,
                    "description": "",
                }
            )
        )
    for arg in op.arguments[op.options_index + 1 :]:
        params.append(
            ts_code_strings.param_template.substitute(
                {
                    "name": "options." + arg.name,
                    "description": "",
                }
            )
        )
    return "\n".join(params)


def gen_ts_tensor_interface(ops) -> str:
    sorted_ops = list(ops.keys())
    sorted_ops.append("shape")
    sorted_ops.append("dtype")
    sorted_ops.append("size")
    sorted_ops.sort()
    sorted_ops.append("index")
    file_string = ts_code_strings.start_interface
    for op_name in sorted_ops:
        if op_name in ops:
            try:
                link = (
                    ts_code_strings.special_case_links[op_name]
                    if op_name in ts_code_strings.special_case_links
                    else ts_code_strings.link_template.substitute({"name": op_name})
                )
                tmp_file_string = ts_code_strings.definition_template_header.substitute(
                    {
                        "description": ts_code_strings.op_descriptions[op_name]
                        if op_name in ts_code_strings.op_descriptions
                        else "",
                        "link": link,
                    }
                )
                for i, op in enumerate(ops[op_name].ops):
                    return_type = (
                        ts_code_strings.return_type_mappings[op.name]
                        if op.name in ts_code_strings.return_type_mappings
                        else ts_code_strings.return_type_mappings[op.returns[0].type_]
                    )
                    if i > 0:
                        tmp_file_string += """\n  /**\n"""
                    tmp_file_string += gen_ts_params_string(op)
                    tmp_file_string += ts_code_strings.declaration_template.substitute(
                        {
                            "name": op_name,
                            "arguments": gen_ts_arguments_string(op),
                            "return_type": return_type,
                        }
                    )
                file_string += tmp_file_string
            except KeyError:
                file_string += tensor_interface_deprecated[op_name]
        else:
            file_string += tensor_interface_deprecated[op_name]
    file_string += ts_code_strings.end_interface
    return file_string
