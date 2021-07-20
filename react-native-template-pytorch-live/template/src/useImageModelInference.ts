/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {useCallback, useState} from 'react';

import {Image, MobileModel} from 'react-native-pytorch-core';
import {ModelResultMetrics} from 'react-native-pytorch-core/lib/typescript/MobileModelModule';
import {ModelInfo} from './Models';

const MobileNetV3Classes = require('./MobileNetV3Classes');

type ImageClassificationResult = {
  scores: number[];
};

export default function useImageModelInference(modelInfo: ModelInfo) {
  const [metrics, setMetrics] = useState<ModelResultMetrics>();
  const [imageClass, setImageClass] = useState<string>();

  const processImage = useCallback(
    async (image: Image) => {
      const width = image.getWidth();
      const height = image.getHeight();
      const size = Math.min(width, height);
      const {
        result: {scores},
        metrics,
      } = await MobileModel.execute<ImageClassificationResult>(modelInfo.model, {
        image,
        cropWidth: size,
        cropHeight: size,
        scaleWidth: 224,
        scaleHeight: 224,
      });
      let maxScore = -Number.MAX_VALUE;
      let maxScoreIdx = -1;
      for (let i = 0; i < scores.length; i++) {
        if (scores[i] > maxScore) {
          maxScore = scores[i];
          maxScoreIdx = i;
        }
      }
      const className = MobileNetV3Classes[maxScoreIdx];
      setImageClass(className);
      setMetrics(metrics);
    },
    [modelInfo.model, setImageClass, setMetrics],
  );

  return {
    imageClass,
    metrics,
    processImage,
  };
}
