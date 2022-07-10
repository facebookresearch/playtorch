# Copyright (c) Meta Platforms, Inc. and affiliates.
#
# This source code is licensed under the MIT license found in the
# LICENSE file in the root directory of this source tree.

import torch
from torch import Tensor
from torch.utils.mobile_optimizer import optimize_for_mobile


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


scriptified_module = torch.jit.script(DummyTestModel())
optimized_model = optimize_for_mobile(
    scriptified_module, preserved_methods=["bump", "get_pi"]
)
optimized_model._save_for_lite_interpreter("dummy_test_model.ptl")
