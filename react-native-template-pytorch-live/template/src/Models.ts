/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import type {ModelInfo} from 'react-native-pytorch-core';

// Example for how to export a model with the live.spec.json bundled as extra files
// Google Colab: https://colab.research.google.com/drive/1vGlRddixmdJvyJ0kTl3uYXuXZ8Q2Ir4C
export const ImageClassificationModels: ModelInfo[] = [
  {
    name: 'ResNet 18',
    model: require('../models/resnet18.ptl'),
  },
  {
    name: 'MobileNet V3 Small',
    model: require('../models/mobilenet_v3_small.ptl'),
  },
  {
    name: 'MobileNet V3 Large',
    model: require('../models/mobilenet_v3_large.ptl'),
  },
];

export const MultiClassClassificationModels: ModelInfo[] = [
  {
    name: 'MNIST',
    model: require('../models/mnist.ptl'),
  },
];

export const ObjectDetectionModels: ModelInfo[] = [
  {
    name: 'DETR',
    model: require('../models/detr_resnet50.ptl'),
  },
];

export const NLPModels: ModelInfo[] = [
  {
    name: 'DistilBertQA',
    model: require('../models/bert_qa.ptl'),
  },
];
