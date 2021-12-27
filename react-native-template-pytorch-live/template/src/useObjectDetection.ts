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

export type BoundingBox = {
  objectClass: string;
  bounds: [number, number, number, number];
};

export type ObjectDetectionResult = {
  boundingBoxes: BoundingBox[];
};

export default function useObjectDetection(modelInfo: ModelInfo) {
  const [metrics, setMetrics] = useState<ModelResultMetrics>();

  const detectObjects = useCallback(
    async (image: Image) => {
      const imageWidth = image.getWidth();
      const imageHeight = image.getHeight();
      const size = Math.min(imageWidth, imageHeight);
      const {result, metrics: m} =
        await MobileModel.execute<ObjectDetectionResult>(modelInfo.model, {
          image,
          cropWidth: size,
          cropHeight: size,
          scaleWidth: 800,
          scaleHeight: 800,
          probabilityThreshold: 0.7,
        });

      // Adjust bounds to image size
      const boundingBoxes: BoundingBox[] = result.boundingBoxes.map(
        boundingBox => {
          const {bounds} = boundingBox;

          const centerX = bounds[0];
          const centerY = bounds[1];
          const width = bounds[2];
          const height = bounds[3];

          const x = centerX - width / 2;
          const y = centerY - height / 2;

          return {
            ...boundingBox,
            bounds: [
              x * imageWidth,
              y * imageHeight,
              width * imageWidth,
              height * imageHeight,
            ],
          };
        },
      );

      setMetrics(m);

      return {boundingBoxes};
    },
    [modelInfo.model, setMetrics],
  );

  return {
    metrics,
    detectObjects,
  };
}
