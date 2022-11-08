# Copyright (c) Meta Platforms, Inc. and affiliates.
#
# This source code is licensed under the MIT license found in the
# LICENSE file in the root directory of this source tree.

from typing import Dict, List, Tuple

import torch
from torch import Tensor
from torch.utils.mobile_optimizer import optimize_for_mobile


print("PyTorch version", torch.__version__)


class DummyTestModel(torch.nn.Module):
    def __init__(self):
        super(DummyTestModel, self).__init__()

    def forward(
        self,
        return_type: str,
        tensor: Tensor,
        boolean: bool,
        integer: int,
        double: float,
    ):
        if return_type == "tensor":
            return "tensor of value" + str(tensor)
        elif return_type == "bool":
            return "boolean with value: " + str(boolean)
        elif return_type == "integer":
            return "integer with value: " + str(integer)
        elif return_type == "double":
            return "double with value: " + str(double)
        else:
            return return_type + " is not supported"

    @torch.jit.export
    def bump(self, start: int, step: int = 1) -> int:
        return start + step

    @torch.jit.export
    def get_pi(self) -> float:
        return 3.14

    @torch.jit.export
    def sum_one_d(self, numbers: List[int]) -> int:
        return torch.sum(numbers)

    @torch.jit.export
    def sum_two_d(self, numbers: List[List[int]]) -> int:
        res = 0
        m = len(numbers)
        for i in range(m):
            n = len(numbers[i])
            for j in range(n):
                res += numbers[i][j]
        return res

    @torch.jit.export
    def concate_keys(self, dictionary: Dict[str, float]) -> str:
        return " ".join(dictionary.keys())

    @torch.jit.export
    def sum_values(self, dictionary: Dict[str, float]) -> float:
        return sum(dictionary.values())

    @torch.jit.export
    def sum_tensors(self, dictionary: Dict[str, Tensor]) -> Dict[str, Tensor]:
        return {key: torch.sum(dictionary[key]) for key in dictionary}

    @torch.jit.export
    def merge_tuple(
        self,
        t1: Tuple[str, float, Tuple[int, int]],
        t2: Tuple[str, float, Tuple[int, int]],
    ) -> Tuple[str, float, Tuple[int, int]]:
        return (
            t1[0] + t2[0],
            t1[1] + t2[1],
            (t1[2][0] + t2[2][0], t1[2][1] + t2[2][1]),
        )


scriptified_module = torch.jit.script(DummyTestModel())
optimized_model = optimize_for_mobile(
    scriptified_module,
    preserved_methods=[
        "bump",
        "get_pi",
        "sum_one_d",
        "sum_two_d",
        "concate_keys",
        "sum_values",
        "sum_tensors",
        "merge_tuple",
    ],
)

extra_files = {}
extra_files[
    "model/classes.json"
] = """[
  "Arizona Bark Scorpion",
  "Giant Hairy Desert Scorpion",
  "Giant Whip Scorpion",
  "Northern Scorpion",
  "Pseudoscorpiones",
  "Stripe-tailed Scorpion",
  "Tailless Whip Scorpion"
]
"""
optimized_model._save_for_lite_interpreter(
    "dummy_test_model.ptl", _extra_files=extra_files
)

print("Model exported")
