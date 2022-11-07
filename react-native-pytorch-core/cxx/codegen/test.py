# Copyright (c) Meta Platforms, Inc. and affiliates.
#
# This source code is licensed under the MIT license found in the
# LICENSE file in the root directory of this source tree.

from unittest import TestCase

from ..codegen.op_data_structures import OpInfo

ops_decl = []
ops_decl.append(
    {
        "name": "_cast_Byte",
        "schema_order_cpp_signature": "at::Tensor (const at::Tensor &, bool)",
        "schema_order_arguments": [
            {
                "annotation": None,
                "dynamic_type": "at::Tensor",
                "is_nullable": False,
                "name": "self",
                "type": "const at::Tensor &",
            },
            {
                "annotation": None,
                "default": False,
                "dynamic_type": "bool",
                "is_nullable": False,
                "name": "non_blocking",
                "type": "bool",
            },
        ],
        "returns": [{"name": "result", "type": "at::Tensor"}],
    }
)


class DataStructuresTest(TestCase):
    def test_op_info(self):
        op_info = OpInfo.from_dict(ops_decl[0])
        self.assertEqual(op_info.name, "_cast_Byte")
        self.assertEqual(
            op_info.schema_order_cpp_signature, "at::Tensor (const at::Tensor &, bool)"
        )
        self.assertEqual(op_info.returns_name, "result")
        self.assertEqual(op_info.returns_type, "at::Tensor")

    def test_argument(self):
        op_info = OpInfo.from_dict(ops_decl[0])
        self.assertEqual(len(op_info.arguments), 2)
        self.assertEqual(op_info.num_required, 0)
        self.assertEqual(op_info.arguments[0].name, "self")
        self.assertEqual(op_info.arguments[0].annotation, None)
        self.assertEqual(op_info.arguments[0].is_nullable, False)
        self.assertEqual(op_info.arguments[0].type_, "const at::Tensor &")
        self.assertEqual(op_info.arguments[0].dynamic_type, "at::Tensor")
        self.assertEqual(op_info.arguments[0].implemented, False)
        self.assertEqual(op_info.arguments[0].kwarg_only, False)
        self.assertEqual(op_info.arguments[0].default, None)
        self.assertEqual(op_info.arguments[1].default, False)
