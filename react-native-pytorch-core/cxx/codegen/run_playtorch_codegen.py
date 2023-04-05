# Copyright (c) Meta Platforms, Inc. and affiliates.
#
# This source code is licensed under the MIT license found in the
# LICENSE file in the root directory of this source tree.

import json

from pathlib import Path

import yaml

from ..codegen.op_data_structures import OpGroup, OpInfo
from ..codegen.playtorch_codegen import gen_cpp_code

react_native_pytorch_core_path = Path().absolute()
while not react_native_pytorch_core_path.name.endswith("react-native-pytorch-core"):
    react_native_pytorch_core_path = react_native_pytorch_core_path.parent
codegen_path = react_native_pytorch_core_path.joinpath("cxx/codegen")

try:
    with open(codegen_path.joinpath("Declarations.json")) as file:
        ops_decl = json.load(file)
except FileNotFoundError:
    with open(codegen_path.joinpath("Declarations.yaml")) as file:
        ops_decl = yaml.load(file, Loader=yaml.FullLoader)
        with open(
            codegen_path.joinpath("Declarations.json"),
            "w",
        ) as json_file:
            json_file.write(
                json.dumps(ops_decl)
            )  # so that next time we can load it quickly

all_tensor_ops = [
    "abs",
    "add",
    "argmax",
    "argmin",
    "clamp",
    "contiguous",
    "data",
    "div",
    "expand",
    "flip",
    "item",
    "matmul",
    "mul",
    "permute",
    "reshape",
    # "size",
    "softmax",
    "sqrt",
    "squeeze",
    "stride",
    "sub",
    "sum",
    "to",
    "topk",
    "unsqueeze",
]
ops_dict = {}
for op in ops_decl:
    if "Tensor" in op["method_of"] and op["operator_name"] in all_tensor_ops:
        op = OpInfo.from_dict(op)
        if op.name in ops_dict:
            ops_dict[op.name].ops.append(op)
        else:
            ops_dict[op.name] = OpGroup(op)

tensor_host_object_cpp_path = react_native_pytorch_core_path.joinpath(
    "cxx/src/torchlive/torch/TensorHostObject.cpp"
)
cpp_text = tensor_host_object_cpp_path.read_text()
cpp_lines = cpp_text.split("\n")
start_codegen_index = cpp_lines.index("namespace {")
end_codegen_index = (
    cpp_lines[start_codegen_index:].index("TensorHostObject::~TensorHostObject() {}")
    + start_codegen_index
)
new_text = "\n".join(cpp_lines[:start_codegen_index])
new_text += gen_cpp_code(ops_dict)
new_text += "\n".join(cpp_lines[end_codegen_index:])
tensor_host_object_cpp_path.write_text(new_text)
