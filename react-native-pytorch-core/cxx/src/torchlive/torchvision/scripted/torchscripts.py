# Copyright (c) Meta Platforms, Inc. and affiliates.
#
# This source code is licensed under the MIT license found in the
# LICENSE file in the root directory of this source tree.

from typing import List

import torch
import torchvision.transforms as T
from torch import Tensor
from torch.utils.mobile_optimizer import optimize_for_mobile


class CenterCropModule(torch.nn.Module):
    def __init__(self):
        super(CenterCropModule, self).__init__()

    def forward(self, img: Tensor, output_size: List[int]) -> Tensor:
        output = T.functional.center_crop(img, output_size)
        return output


scripted_model = torch.jit.script(CenterCropModule())
optimized_model = optimize_for_mobile(scripted_model)
optimized_model._save_for_lite_interpreter("center_crop_scriptmodule.ptl")


class ResizeModule(torch.nn.Module):
    def __init__(self):
        super(ResizeModule, self).__init__()

    def forward(self, img: Tensor, size: List[int]) -> Tensor:
        output = T.functional.resize(img, size)
        return output


scripted_model = torch.jit.script(ResizeModule())
optimized_model = optimize_for_mobile(scripted_model)
optimized_model._save_for_lite_interpreter("resize_scriptmodule.ptl")


class Grayscale(torch.nn.Module):
    def __init__(self):
        super(Grayscale, self).__init__()

    def forward(self, img: Tensor, num_channels: int = 1) -> Tensor:
        output = T.functional.rgb_to_grayscale(img, num_channels)
        return output


scripted_model = torch.jit.script(Grayscale())
optimized_model = optimize_for_mobile(scripted_model)
optimized_model._save_for_lite_interpreter("grayscale_scriptmodule.ptl")
