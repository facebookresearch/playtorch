/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import type {ModelInfo} from 'react-native-pytorch-core';

export type AttributedModelInfo = ModelInfo & {
  contentLength: number;
  contributorsLinks: string[];
  modelDocumentationLinks: string[];
};

// Example for how to export a model with the live.spec.json bundled as extra files
// Google Colab: https://colab.research.google.com/drive/1vGlRddixmdJvyJ0kTl3uYXuXZ8Q2Ir4C
export const ImageClassificationModels: AttributedModelInfo[] = [
  {
    name: 'ResNet 18',
    model: 'https://fb.me/ptl/resnet18.ptl',
    contentLength: 46762057,
    modelDocumentationLinks: ['https://github.com/pytorch/vision'],
    contributorsLinks: [
      'https://github.com/pytorch/vision/graphs/contributors',
    ],
  },
  {
    name: 'MobileNet V3 Small',
    model: 'https://fb.me/ptl/mobilenet_v3_small.ptl',
    contentLength: 10200005,
    modelDocumentationLinks: ['https://github.com/pytorch/vision'],
    contributorsLinks: [
      'https://github.com/pytorch/vision/graphs/contributors',
    ],
  },
  {
    name: 'MobileNet V3 Large',
    model: 'https://fb.me/ptl/mobilenet_v3_large.ptl',
    contentLength: 21944315,
    modelDocumentationLinks: ['https://github.com/pytorch/vision'],
    contributorsLinks: [
      'https://github.com/pytorch/vision/graphs/contributors',
    ],
  },
];

export const ImageGenerationModels: AttributedModelInfo[] = [
  {
    name: 'AnimeGANv2',
    model: 'https://fb.me/ptl/animegan2_face_paint_512_v2.ptl',
    contentLength: 8643424,
    modelDocumentationLinks: [
      'https://github.com/TachibanaYoshino/AnimeGANv2',
      'https://github.com/bryandlee/animegan2-pytorch',
    ],
    contributorsLinks: [
      'https://github.com/TachibanaYoshino/AnimeGANv2#author',
      'https://github.com/bryandlee/animegan2-pytorch/graphs/contributors',
    ],
  },
];

export const MultiClassClassificationModels: AttributedModelInfo[] = [
  {
    name: 'MNIST',
    model: 'https://fb.me/ptl/mnist.ptl',
    contentLength: 4808760,
    modelDocumentationLinks: ['https://github.com/pytorch/serve'],
    contributorsLinks: ['https://github.com/pytorch/serve#-all-contributors'],
  },
];

export const ObjectDetectionModels: AttributedModelInfo[] = [
  {
    name: 'DETR',
    model: 'https://fb.me/ptl/detr_resnet50.ptl',
    contentLength: 166514975,
    modelDocumentationLinks: ['https://github.com/pytorch/vision'],
    contributorsLinks: [
      'https://github.com/pytorch/vision/graphs/contributors',
    ],
  },
];

export const ImageSegmentationModels: AttributedModelInfo[] = [
  {
    name: 'DeepLab V3 MobileNet',
    model: 'https://fb.me/ptl/deeplabv3_mobilenet.ptl',
    contentLength: 44672620,
    modelDocumentationLinks: ['https://github.com/pytorch/vision'],
    contributorsLinks: [
      'https://github.com/pytorch/vision/graphs/contributors',
    ],
  },
];

export const NLPModels: AttributedModelInfo[] = [
  {
    name: 'DistilBertQA',
    model: 'https://fb.me/ptl/bert_qa.ptl',
    contentLength: 138367475,
    modelDocumentationLinks: [
      'https://huggingface.co/distilbert-base-uncased-distilled-squad',
    ],
    contributorsLinks: ['https://github.com/julien-c'],
  },
];

export const AllModels: AttributedModelInfo[] = [
  ...ImageClassificationModels,
  ...ImageGenerationModels,
  ...MultiClassClassificationModels,
  ...ObjectDetectionModels,
  ...NLPModels,
];
