# Copyright (c) Meta Platforms, Inc. and affiliates.
#
# This source code is licensed under the MIT license found in the
# LICENSE file in the root directory of this source tree.


class OpInfo:
    name: str
    schema_order_cpp_signature: str
    returns_name: str
    returns_type: str

    def __init__(
        self,
        name: str,
        schema_order_cpp_signature: str,
        returns_name: str,
        returns_type: str,
    ):
        self.name = name
        self.schema_order_cpp_signature = schema_order_cpp_signature
        self.returns_name = returns_name
        self.returns_type = returns_type

    @staticmethod
    def from_dict(op):
        name = op["name"]
        schema_order_cpp_signature = op["schema_order_cpp_signature"]
        returns_name = op["returns"][0]["name"]
        returns_type = op["returns"][0]["type"]
        return OpInfo(name, schema_order_cpp_signature, returns_name, returns_type)
