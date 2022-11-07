# Copyright (c) Meta Platforms, Inc. and affiliates.
#
# This source code is licensed under the MIT license found in the
# LICENSE file in the root directory of this source tree.

import json

from pathlib import Path

import yaml

from ..codegen.op_data_structures import camelCase, OpGroup, OpInfo
from ..codegen.playtorch_codegen import gen_cpp_code, gen_ts_tensor_interface

react_native_pytorch_core_path = Path().absolute()
while not react_native_pytorch_core_path.name.endswith("react-native-pytorch-core"):
    react_native_pytorch_core_path = react_native_pytorch_core_path.parent
codegen_path = react_native_pytorch_core_path.joinpath("cxx/codegen")

try:
    with open(
        react_native_pytorch_core_path.joinpath("cxx/codegen/Declarations.json")
    ) as file:
        ops_decl = json.load(file)
except FileNotFoundError:
    with open(
        react_native_pytorch_core_path.joinpath("cxx/codegen/Declarations.yaml")
    ) as file:
        ops_decl = yaml.load(file, Loader=yaml.FullLoader)
        with open(
            react_native_pytorch_core_path.joinpath("cxx/codegen/Declarations.json"),
            "w",
        ) as json_file:
            json_file.write(
                json.dumps(ops_decl)
            )  # so that next time we can load it quickly

deprecated_tensor_ops = [
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
for op_dict in ops_decl:
    if "Tensor" in op_dict["method_of"]:
        op = OpInfo.from_dict(op_dict)
        cc_op_name = camelCase(op.name)
        if cc_op_name in ops_dict:
            ops_dict[cc_op_name].ops.append(op)
        else:
            ops_dict[cc_op_name] = OpGroup(op)

# Generate TensorHostObject.cpp
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
new_text += gen_cpp_code(ops_dict, deprecated_tensor_ops)
new_text += "\n".join(cpp_lines[end_codegen_index:])
tensor_host_object_cpp_path.write_text(new_text)

# Generate torch.ts
torch_ts_path = react_native_pytorch_core_path.joinpath("src/torchlive/torch.ts")
ts_text = torch_ts_path.read_text()
ts_lines = ts_text.split("\n")
ts_start_codegen_index = ts_lines.index("export interface Tensor {")
ts_end_codegen_index = (
    ts_lines[ts_start_codegen_index:].index("} // Tensor") + ts_start_codegen_index
)
ts_new_text = "\n".join(ts_lines[:ts_start_codegen_index])
ts_new_text += gen_ts_tensor_interface(ops_dict, deprecated_tensor_ops)
ts_new_text += "\n".join(ts_lines[ts_end_codegen_index + 1 :])
torch_ts_path.write_text(ts_new_text)
