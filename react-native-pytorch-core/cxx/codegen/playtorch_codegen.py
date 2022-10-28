# Copyright (c) Meta Platforms, Inc. and affiliates.
#
# This source code is licensed under the MIT license found in the
# LICENSE file in the root directory of this source tree.

from ..codegen.code_strings import (
    cpp_try_signature_template,
    get_argument_string,
    get_check_argument_types_string,
    get_returns_string,
)
from ..codegen.op_data_structures import OpInfo


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
