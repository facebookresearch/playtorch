# Copyright (c) Meta Platforms, Inc. and affiliates.
#
# This source code is licensed under the MIT license found in the
# LICENSE file in the root directory of this source tree.

from unittest import TestCase

from ..codegen.mock_dict import ops_decl
from ..codegen.op_data_structures import camelCase, OpGroup, OpInfo


class DataStructuresTest(TestCase):
    def test_op_info(self):
        op_info = OpInfo.from_dict(ops_decl[0])
        self.assertEqual(op_info.name, "_cast_Byte")
        self.assertEqual(
            op_info.schema_order_cpp_signature, "at::Tensor (const at::Tensor &, bool)"
        )
        self.assertEqual(op_info.returns[0].name, "result")
        self.assertEqual(op_info.returns[0].type_, "at::Tensor")

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
        self.assertEqual(op_info.arguments[1].default, "false")

    def test_op_group(self):
        ops_dict = {}
        tensor_ops = ["add", "sub", "mul", "reshape", "item"]
        for op in ops_decl:
            if "Tensor" in op["method_of"] and op["operator_name"] in tensor_ops:
                op = OpInfo.from_dict(op)
                if op.name in ops_dict:
                    ops_dict[op.name].ops.append(op)
                else:
                    ops_dict[op.name] = OpGroup(op)
        self.assertEqual(len(ops_dict["add"].ops), 2)
        self.assertEqual(ops_dict["add"].min_num_required, 1)
        self.assertEqual(len(ops_dict["sub"].ops), 2)
        self.assertEqual(ops_dict["sub"].min_num_required, 1)
        self.assertEqual(len(ops_dict["mul"].ops), 2)
        self.assertEqual(ops_dict["mul"].min_num_required, 1)
        self.assertEqual(len(ops_dict["reshape"].ops), 1)
        self.assertEqual(ops_dict["reshape"].min_num_required, 1)
        self.assertEqual(len(ops_dict["item"].ops), 1)
        self.assertEqual(ops_dict["item"].min_num_required, 0)

    def test_camel_case(self):
        ops_dict = {}
        tensor_ops = ["add", "div"]
        for op in ops_decl:
            if "Tensor" in op["method_of"] and op["operator_name"] in tensor_ops:
                op = OpInfo.from_dict(op)
                nameCamelCase = camelCase(op.name)
                if nameCamelCase in ops_dict:
                    ops_dict[nameCamelCase].ops.append(op)
                else:
                    ops_dict[nameCamelCase] = OpGroup(op)
        self.assertEqual(ops_dict["add"].ops[0].arguments[0].name, "self")
        self.assertEqual(ops_dict["div"].ops[0].arguments[2].name, "roundingMode")
        self.assertEqual(camelCase("_add_relu"), "_addRelu")
        self.assertEqual(camelCase("_add_relu_"), "_addRelu_")
        self.assertEqual(camelCase("add_relu_"), "addRelu_")
        self.assertEqual(camelCase("add_relu"), "addRelu")
        self.assertEqual(camelCase("add"), "add")
