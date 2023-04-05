# Copyright (c) Meta Platforms, Inc. and affiliates.
#
# This source code is licensed under the MIT license found in the
# LICENSE file in the root directory of this source tree.

ops_decl = [
    {
        "name": "_cast_Byte",
        "schema_order_cpp_signature": "at::Tensor (const at::Tensor &, bool)",
        "schema_order_arguments": [
            {
                "annotation": None,
                "dynamic_type": "at::Tensor",
                "is_Noneable": False,
                "name": "self",
                "type": "const at::Tensor &",
            },
            {
                "annotation": None,
                "default": False,
                "dynamic_type": "bool",
                "is_Noneable": False,
                "name": "non_blocking",
                "type": "bool",
            },
        ],
        "method_of": ["Type", "namespace"],
        "returns": [{"name": "result", "type": "at::Tensor"}],
    },
    {
        "name": "add",
        "operator_name": "add",
        "schema_order_cpp_signature": "at::Tensor (const at::Tensor &, const at::Tensor &, const at::Scalar &)",
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
                "dynamic_type": "at::Tensor",
                "is_nullable": False,
                "name": "other",
                "type": "const at::Tensor &",
            },
            {
                "annotation": None,
                "default": 1,
                "dynamic_type": "const at::Scalar &",
                "is_nullable": False,
                "kwarg_only": True,
                "name": "alpha",
                "type": "const at::Scalar &",
            },
        ],
        "method_of": ["Type", "Tensor", "namespace"],
        "returns": [
            {"dynamic_type": "at::Tensor", "name": "result", "type": "at::Tensor"}
        ],
    },
    {
        "name": "add",
        "operator_name": "add",
        "schema_order_cpp_signature": "at::Tensor (const at::Tensor &, const at::Scalar &, const at::Scalar &)",
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
                "dynamic_type": "const at::Scalar &",
                "is_nullable": False,
                "name": "other",
                "type": "const at::Scalar &",
            },
            {
                "annotation": None,
                "default": 1,
                "dynamic_type": "const at::Scalar &",
                "is_nullable": False,
                "name": "alpha",
                "type": "const at::Scalar &",
            },
        ],
        "method_of": ["Type", "Tensor", "namespace"],
        "returns": [
            {"dynamic_type": "at::Tensor", "name": "result", "type": "at::Tensor"}
        ],
    },
    {
        "name": "mul",
        "operator_name": "mul",
        "schema_order_cpp_signature": "at::Tensor (const at::Tensor &, const at::Tensor &)",
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
                "dynamic_type": "at::Tensor",
                "is_nullable": False,
                "name": "other",
                "type": "const at::Tensor &",
            },
        ],
        "method_of": ["Type", "Tensor", "namespace"],
        "returns": [
            {"dynamic_type": "at::Tensor", "name": "result", "type": "at::Tensor"}
        ],
    },
    {
        "name": "mul",
        "operator_name": "mul",
        "schema_order_cpp_signature": "at::Tensor (const at::Tensor &, const at::Scalar &)",
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
                "dynamic_type": "const at::Scalar &",
                "is_nullable": False,
                "name": "other",
                "type": "const at::Scalar &",
            },
        ],
        "method_of": ["Type", "Tensor", "namespace"],
        "returns": [
            {"dynamic_type": "at::Tensor", "name": "result", "type": "at::Tensor"}
        ],
    },
    {
        "name": "reshape",
        "operator_name": "reshape",
        "schema_order_cpp_signature": "at::Tensor (const at::Tensor &, at::IntArrayRef)",
        "schema_order_arguments": [
            {
                "annotation": "a",
                "dynamic_type": "at::Tensor",
                "is_nullable": False,
                "name": "self",
                "type": "const at::Tensor &",
            },
            {
                "annotation": None,
                "dynamic_type": "at::IntArrayRef",
                "is_nullable": False,
                "name": "shape",
                "type": "at::IntArrayRef",
            },
        ],
        "method_of": ["Type", "Tensor", "namespace"],
        "returns": [
            {"dynamic_type": "at::Tensor", "name": "result", "type": "at::Tensor"}
        ],
    },
    {
        "name": "sub",
        "operator_name": "sub",
        "schema_order_cpp_signature": "at::Tensor (const at::Tensor &, const at::Tensor &, const at::Scalar &)",
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
                "dynamic_type": "at::Tensor",
                "is_nullable": False,
                "name": "other",
                "type": "const at::Tensor &",
            },
            {
                "annotation": None,
                "default": 1,
                "dynamic_type": "const at::Scalar &",
                "is_nullable": False,
                "kwarg_only": True,
                "name": "alpha",
                "type": "const at::Scalar &",
            },
        ],
        "method_of": ["Type", "Tensor", "namespace"],
        "returns": [
            {"dynamic_type": "at::Tensor", "name": "result", "type": "at::Tensor"}
        ],
    },
    {
        "name": "sub",
        "operator_name": "sub",
        "schema_order_cpp_signature": "at::Tensor (const at::Tensor &, const at::Scalar &, const at::Scalar &)",
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
                "dynamic_type": "const at::Scalar &",
                "is_nullable": False,
                "name": "other",
                "type": "const at::Scalar &",
            },
            {
                "annotation": None,
                "default": 1,
                "dynamic_type": "const at::Scalar &",
                "is_nullable": False,
                "name": "alpha",
                "type": "const at::Scalar &",
            },
        ],
        "method_of": ["Type", "Tensor", "namespace"],
        "returns": [
            {"dynamic_type": "at::Tensor", "name": "result", "type": "at::Tensor"}
        ],
    },
    {
        "name": "item",
        "operator_name": "item",
        "overload_name": "",
        "manual_kernel_registration": False,
        "category_override": "",
        "schema_string": "aten::item(Tensor self) -> Scalar",
        "arguments": [
            {
                "annotation": None,
                "dynamic_type": "at::Tensor",
                "is_nullable": False,
                "name": "self",
                "type": "const at::Tensor &",
            }
        ],
        "schema_order_cpp_signature": "at::Scalar (const at::Tensor &)",
        "schema_order_arguments": [
            {
                "annotation": None,
                "dynamic_type": "at::Tensor",
                "is_nullable": False,
                "name": "self",
                "type": "const at::Tensor &",
            }
        ],
        "method_of": ["Type", "Tensor"],
        "mode": "native",
        "python_module": "",
        "returns": [
            {
                "dynamic_type": "const at::Scalar &",
                "name": "result",
                "type": "at::Scalar",
            }
        ],
        "inplace": False,
        "is_factory_method": False,
        "abstract": False,
        "device_guard": True,
        "with_gil": False,
        "deprecated": False,
        "has_math_kernel": True,
    },
]
