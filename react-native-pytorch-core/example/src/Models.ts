/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { ModelInfo } from 'react-native-pytorch-core'

// Example for how to export a model with the live.spec.json bundled as extra files
// Google Colab: https://colab.research.google.com/drive/1vGlRddixmdJvyJ0kTl3uYXuXZ8Q2Ir4C
export const ImageClassificationModels: ModelInfo[] = [
    {
      name: 'ResNet 18',
      model: require('../models/resnet18.pt'),
    },
    {
      name: 'MobileNet V3 Small',
      model: require('../models/mobilenet_v3_small.pt'),
    },
    {
      name: 'MobileNet V3 Large',
      model: require('../models/mobilenet_v3_large.pt'),
    },
  ];

  export const NLPModels: ModelInfo[] = [
    {
      name: 'DistilBertQA',
      model: require('../models/bert_qa.pt'),
    },
  ];
