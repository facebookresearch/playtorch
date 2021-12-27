/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {useCallback, useState} from 'react';
import {Image, MobileModel} from 'react-native-pytorch-core';
import type {ModelResultMetrics, ModelInfo} from 'react-native-pytorch-core';

const MobileNetV3Classes = require('./MobileNetV3Classes');

type ImageClassificationResult = {
  maxIdx: number;
  confidence: number;
};

export default function useImageModelInference(modelInfo: ModelInfo) {
  const [metrics, setMetrics] = useState<ModelResultMetrics>();
  const [imageClass, setImageClass] = useState<string>();

  const processImage = useCallback(
    async (image: Image) => {
      const {
        result: {maxIdx, confidence},
        metrics: m,
      } = await MobileModel.execute<ImageClassificationResult>(
        modelInfo.model,
        {
          image,
        },
      );
      const className = MobileNetV3Classes[maxIdx];
      setImageClass(`${className} (confidence ${confidence.toFixed(2)})`);
      setMetrics(m);
    },
    [modelInfo.model, setImageClass, setMetrics],
  );

  return {
    imageClass,
    metrics,
    processImage,
  };
}
