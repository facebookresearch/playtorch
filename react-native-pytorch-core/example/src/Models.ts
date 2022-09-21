/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import type {ModelInfo} from 'react-native-pytorch-core';

export const ImageClassificationModels: ModelInfo[] = [
  {
    name: 'ResNet 18',
    model:
      'https://github.com/facebookresearch/playtorch/releases/download/v0.1.0/resnet18.ptl',
  },
  {
    name: 'MobileNet V3 Small',
    model:
      'https://github.com/facebookresearch/playtorch/releases/download/v0.1.0/mobilenet_v3_small.ptl',
  },
  {
    name: 'MobileNet V3 Large',
    model:
      'https://github.com/facebookresearch/playtorch/releases/download/v0.1.0/mobilenet_v3_large.ptl',
  },
];

export const ImageGenerationModels: ModelInfo[] = [
  {
    name: 'AnimeGANv2',
    model:
      'https://github.com/facebookresearch/playtorch/releases/download/v0.2.0-rc.0/animegan2_face_paint_512_v2.ptl',
  },
];

export const MultiClassClassificationModels: ModelInfo[] = [
  {
    name: 'MNIST',
    model:
      'https://github.com/facebookresearch/playtorch/releases/download/v0.1.0/mnist.ptl',
  },
];

export const ObjectDetectionModels: ModelInfo[] = [
  {
    name: 'DETR',
    model:
      'https://github.com/facebookresearch/playtorch/releases/download/v0.1.0/detr_resnet50.ptl',
  },
];

export const NLPModels: ModelInfo[] = [
  {
    name: 'DistilBertQA',
    model:
      'https://github.com/facebookresearch/playtorch/releases/download/v0.1.0/bert_qa.ptl',
    vocab:
      'https://github.com/facebookresearch/playtorch/releases/download/v0.1.0/BERTVocab.json',
  },
];

export const AudioModels: ModelInfo[] = [
  {
    name: 'Wav2Vec2',
    model:
      'https://github.com/facebookresearch/playtorch/releases/download/v0.1.0/wav2vec2.ptl',
  },
];
