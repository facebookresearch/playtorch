# Copyright (c) Meta Platforms, Inc. and affiliates.
#
# This source code is licensed under the MIT license found in the
# LICENSE file in the root directory of this source tree.

import json

from pathlib import Path

import yaml

from ..codegen.op_data_structures import OpGroup, OpInfo
from ..codegen.playtorch_codegen import gen_cpp_file

xplat_path = Path().absolute()
while not xplat_path.name.endswith("xplat"):
    xplat_path = xplat_path.parent
codegen_path = xplat_path.joinpath(
    "playtorch/playtorch-github/react-native-pytorch-core/cxx/codegen"
)

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

with open(
    codegen_path.parent.joinpath("src/torchlive/torch/TensorHostObject.cpp"),
    "w",
) as file:
    file.write(gen_cpp_file(ops_dict))
    file.close()
