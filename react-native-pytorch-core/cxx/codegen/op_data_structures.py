# Copyright (c) Meta Platforms, Inc. and affiliates.
#
# This source code is licensed under the MIT license found in the
# LICENSE file in the root directory of this source tree.

from typing import Optional


def camelCase(snake_case: str) -> str:
    prefix = "_" if snake_case[0] == "_" else ""
    suffix = "_" if snake_case[-1] == "_" else ""
    words = snake_case.split("_")
    if words[0] == "":
        words.pop(0)
    return prefix + words[0] + "".join([word.title() for word in words[1:]]) + suffix


class Return:
    name: str
    type_: str

    def __init__(self, name: str, type_: str):
        self.name = name
        self.type_ = type_


class Argument:
    annotation: Optional[str]
    default: Optional[any]
    dynamic_type: str
    is_nullable: bool
    name: str
    type_: str
    kwarg_only: bool
    implemented: bool  # not from Declarations, initally false but will be set to true when get_argument_string is called if a case for the corresponding argument type exists

    def __init__(self, argInfo):
        self.annotation = argInfo["annotation"] if "annotation" in argInfo else None
        self.default = argInfo["default"] if "default" in argInfo else None
        if isinstance(self.default, bool):
            self.default = "true" if self.default else "false"
        self.kwarg_only = argInfo["kwarg_only"] if "kwarg_only" in argInfo else False
        self.dynamic_type = argInfo["dynamic_type"]
        self.is_nullable = argInfo["is_nullable"] if "is_nullable" in argInfo else False
        self.name = camelCase(argInfo["name"])
        self.type_ = argInfo["type"]
        self.implemented = False

    def is_kwarg(self) -> bool:
        return self.default is not None or self.kwarg_only

    def is_required(self) -> bool:
        return self.default is None


class OpInfo:
    name: str
    schema_order_cpp_signature: str
    arguments: [Argument]
    num_required: int
    options_index: int
    returns: [Return]
    arg_types: [str]
    implemented: bool  # not from Declarations, initally false but will be set to true if a case for all argument types in get_arguments_string and return type in get_return_type exists

    def __init__(
        self,
        name: str,
        schema_order_cpp_signature: str,
        arguments: [Argument],
        returns: [Return],
    ):
        self.name = name
        self.schema_order_cpp_signature = schema_order_cpp_signature
        self.arguments = arguments
        self.num_required = sum(
            [1 if arg.default is None else 0 for arg in arguments[1:]]
        )
        self.options_index = self.num_required - sum(
            [
                1 if arg.kwarg_only and arg.default is None else 0
                for arg in arguments[1:]
            ]
        )
        self.returns = returns
        self.arg_types = [arg.type_ for arg in arguments]
        self.implemented = False

    @staticmethod
    def from_dict(op):
        name = op["name"]
        schema_order_cpp_signature = op["schema_order_cpp_signature"]
        arguments = [Argument(arg) for arg in op["schema_order_arguments"]]
        returns = [Return(r["name"], r["type"]) for r in op["returns"]]
        return OpInfo(name, schema_order_cpp_signature, arguments, returns)


class OpGroup:
    name: str
    ops: [OpInfo]
    min_num_required: int
    implemented: bool  # initially False, will be set to true if OpInfo.implemented for every op in ops

    def __init__(self, op: OpInfo):
        self.name = camelCase(op.name)
        self.ops = [op]
        self.min_num_required = op.num_required
        self.implemented = False

    def add_op(self, op: OpInfo):
        self.ops.append(op)
        if op.num_required < self.min_num_required:
            self.min_num_required = op.num_required
