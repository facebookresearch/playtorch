# Copyright (c) Meta Platforms, Inc. and affiliates.
#
# This source code is licensed under the MIT license found in the
# LICENSE file in the root directory of this source tree.

from typing import Optional


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
        self.kwarg_only = argInfo["kwarg_only"] if "kwarg_only" in argInfo else False
        self.dynamic_type = argInfo["dynamic_type"]
        self.is_nullable = argInfo["is_nullable"] if "is_nullable" in argInfo else False
        self.name = argInfo["name"]
        self.type_ = argInfo["type"]
        self.implemented = False


class OpInfo:
    name: str
    schema_order_cpp_signature: str
    arguments: [Argument]
    num_required: int
    options_index: int
    returns_name: str
    returns_type: str
    arg_types: [str]
    implemented: bool  # not from Declarations, initally false but will be set to true if a case for all argument types in get_arguments_string and return type in get_return_type exists

    def __init__(
        self,
        name: str,
        schema_order_cpp_signature: str,
        arguments: [Argument],
        returns_name: str,
        returns_type: str,
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
        self.returns_name = returns_name
        self.returns_type = returns_type
        self.arg_types = [arg.type_ for arg in arguments]
        self.implemented = False

    @staticmethod
    def from_dict(op):
        name = op["name"]
        schema_order_cpp_signature = op["schema_order_cpp_signature"]
        arguments = [Argument(arg) for arg in op["schema_order_arguments"]]
        returns_name = op["returns"][0]["name"]
        returns_type = op["returns"][0]["type"]
        return OpInfo(
            name, schema_order_cpp_signature, arguments, returns_name, returns_type
        )


class OpGroup:
    name: str
    ops: [OpInfo]
    min_num_required: int
    implemented: bool  # initially False, will be set to true if OpInfo.implemented for every op in ops

    def __init__(self, op: OpInfo):
        self.name = op.name
        self.ops = [op]
        self.min_num_required = op.num_required
        self.implemented = False

    def add_op(self, op: OpInfo):
        self.ops.append(op)
        if op.num_required < self.min_num_required:
            self.min_num_required = op.num_required
