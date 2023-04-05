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
