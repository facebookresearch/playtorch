/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {useCallback, useState} from 'react';
import {
  Image,
  media,
  ModelInfo,
  ModelResultMetrics,
  Module,
  Tensor,
  torch,
  torchvision,
} from 'react-native-pytorch-core';
import COCO_CLASSES from '../../../assets/coco/coco.json';
import {useModel} from '../../../examples/utils/ModelProvider';
import Measurement from '../../../utils/Measurement';

// Alias for torchvision transforms
const T = torchvision.transforms;

type Bounds = [number, number, number, number];

export type BoundingBox = {
  objectClass: string;
  bounds: Bounds;
};

type ObjectDetectionResult = {
  pred_logits: Tensor;
  pred_boxes: Tensor;
};

const packFn = async (image: Image): Promise<Tensor> => {
  // Get image width and height
  const width = image.getWidth();
  const height = image.getHeight();

  // Convert image to blob, which is a byte representation of the image
  // in the format height (H), width (W), and channels (C), or HWC for short
  const blob = media.toBlob(image);

  // Get a tensor from image the blob and also define in what format
  // the image blob is.
  let tensor = torch.fromBlob(blob, [height, width, 3]);

  // Rearrange the tensor shape to be [CHW]
  tensor = tensor.permute([2, 0, 1]);

  // Divide the tensor values by 255 to get values between [0, 1]
  tensor = tensor.div(255);

  // Resize the image tensor to 3 x min(height, 800) x min(width, 800)
  const resize = T.resize(800);
  tensor = resize(tensor);

  // Normalize the tensor image with mean and standard deviation
  const normalize = T.normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]);
  tensor = normalize(tensor);

  // Unsqueeze adds 1 leading dimension to the tensor
  return tensor.unsqueeze(0);
};

const inferenceFn = async (
  model: Module,
  tensor: Tensor,
): Promise<ObjectDetectionResult> => {
  return await model.forward(tensor);
};

const unpackFn = async (
  output: ObjectDetectionResult,
  image: Image,
  probabilityThreshold: number = 0.7,
): Promise<BoundingBox[]> => {
  const predLogits = output.pred_logits.squeeze(0);
  const predBoxes = output.pred_boxes.squeeze(0);

  const numPredictions = predLogits.shape[0];

  const resultBoxes: BoundingBox[] = [];

  // Get image width and height
  const imageWidth = image.getWidth();
  const imageHeight = image.getHeight();
  for (let i = 0; i < numPredictions; i++) {
    const confidencesTensor = predLogits[i];
    const scores = confidencesTensor.softmax(0);
    const maxIndex = confidencesTensor.argmax().item();
    const maxProb = scores[maxIndex].item();

    if (maxProb <= probabilityThreshold || maxIndex >= COCO_CLASSES.length) {
      continue;
    }

    const boxTensor = predBoxes[i];
    const [centerX, centerY, width, height] = boxTensor.data();
    const x = centerX - width / 2;
    const y = centerY - height / 2;

    // Adjust bounds to image size
    const bounds: Bounds = [
      x * imageWidth,
      y * imageHeight,
      width * imageWidth,
      height * imageHeight,
    ];

    const match = {
      objectClass: COCO_CLASSES[maxIndex],
      bounds,
    };

    resultBoxes.push(match);
  }

  return resultBoxes;
};

export default function useObjectDetection(modelInfo: ModelInfo) {
  const model = useModel(modelInfo);
  const [metrics, setMetrics] = useState<ModelResultMetrics>();

  const detectObjects = useCallback(
    async (image: Image) => {
      if (model == null) {
        return [];
      }

      Measurement.mark('pack');
      const inputs = await packFn(image);
      Measurement.measure('pack');

      Measurement.mark('inference');
      const output = await inferenceFn(model, inputs);
      Measurement.measure('inference');

      Measurement.mark('unpack');
      const boundingBoxes = await unpackFn(output, image);
      Measurement.measure('unpack');

      const m = Measurement.getMetrics();

      setMetrics(m);
      return boundingBoxes;
    },
    [model],
  );

  return {
    metrics,
    detectObjects,
  };
}
