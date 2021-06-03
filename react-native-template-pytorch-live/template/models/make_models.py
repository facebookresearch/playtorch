# Copyright (c) Facebook, Inc. and its affiliates.
#
# This source code is licensed under the MIT license found in the
# LICENSE file in the root directory of this source tree.

from pathlib import Path

import torch
import torchvision
from torch.utils.mobile_optimizer import optimize_for_mobile

print(f"torch version {torch.__version__}")

models = {
    "resnet18": torchvision.models.resnet18(pretrained=True),
    "mobilenet_v3_large": torchvision.models.mobilenet_v3_large(pretrained=True),
    "mobilenet_v3_small": torchvision.models.mobilenet_v3_small(pretrained=True),
}

for name, model in models.items():
    print(f"Exporting model {name}")
    model.eval()
    script_model = torch.jit.script(model)
    script_model_opt = optimize_for_mobile(script_model)
    spec = Path(f"{name}.pt.live.spec.json").read_text()
    extra_files = {}
    extra_files["model/live.spec.json"] = spec
    script_model_opt._save_for_lite_interpreter(f"{name}.pt", _extra_files=extra_files)
    print(f"Model {name} successfully exported")
