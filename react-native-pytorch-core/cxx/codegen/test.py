# Copyright (c) Meta Platforms, Inc. and affiliates.
#
# This source code is licensed under the MIT license found in the
# LICENSE file in the root directory of this source tree.

from unittest import TestCase

from ..codegen.mock_dict import ops_decl
from ..codegen.op_data_structures import OpGroup, OpInfo
from ..codegen.playtorch_codegen import gen_cpp_file, gen_cpp_func, gen_cpp_func_impl
from ..codegen.test_code_strings import (
    cpp_file_str,
    gen_cpp_func_add0,
    gen_cpp_func_add1,
    gen_cpp_func_impl_add,
    gen_cpp_func_impl_item,
    gen_cpp_func_item,
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

    def test_gen_cpp_func(self):
        ops_dict = {}
        # add is fully implemented, reshape has argument not implemented, item takes no arguments
        # no example of all arguments implemented but return type implemented exists playtorch v0.2.2
        tensor_ops = ["add", "reshape", "item"]
        for op in ops_decl:
            if "Tensor" in op["method_of"] and op["operator_name"] in tensor_ops:
                op = OpInfo.from_dict(op)
                if op.name in ops_dict:
                    ops_dict[op.name].ops.append(op)
                else:
                    ops_dict[op.name] = OpGroup(op)
        self.assertEqual(gen_cpp_func(ops_dict["add"].ops[0]), gen_cpp_func_add0)
        self.assertEqual(gen_cpp_func(ops_dict["add"].ops[1]), gen_cpp_func_add1)
        self.assertEqual(gen_cpp_func(ops_dict["item"].ops[0]), gen_cpp_func_item)
        self.assertEqual(ops_dict["add"].ops[0].implemented, True)
        self.assertEqual(ops_dict["add"].ops[1].implemented, True)
        self.assertEqual(ops_dict["item"].ops[0].implemented, True)

    def test_gen_cpp_func_impl(self):
        ops_dict = {}
        # add is fully implemented, reshape has argument not implemented
        # no example of all arguments implemented but return type implemented exists playtorch v0.2.2
        tensor_ops = ["add", "item"]
        for op in ops_decl:
            if "Tensor" in op["method_of"] and op["operator_name"] in tensor_ops:
                op = OpInfo.from_dict(op)
                if op.name in ops_dict:
                    ops_dict[op.name].ops.append(op)
                else:
                    ops_dict[op.name] = OpGroup(op)
        self.assertEqual(gen_cpp_func_impl(ops_dict["add"]), gen_cpp_func_impl_add)
        self.assertEqual(gen_cpp_func_impl(ops_dict["item"]), gen_cpp_func_impl_item)
        self.assertEqual(ops_dict["add"].implemented, True)
        self.assertEqual(ops_dict["item"].implemented, True)

    def test_gen_cpp_file(self):
        ops_dict = {}
        tensor_ops = ["add", "sub", "mul", "item"]
        for op in ops_decl:
            if "Tensor" in op["method_of"] and op["operator_name"] in tensor_ops:
                op = OpInfo.from_dict(op)
                if op.name in ops_dict:
                    ops_dict[op.name].ops.append(op)
                else:
                    ops_dict[op.name] = OpGroup(op)
        self.assertEqual(gen_cpp_file(ops_dict), cpp_file_str)
