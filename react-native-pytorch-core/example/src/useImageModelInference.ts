/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {useCallback, useRef, useState} from 'react';

import {
  Image,
  media,
  MobileModel,
  ModelResultMetrics,
  ModelInfo,
  ModelPath,
  Module,
  Tensor,
  torch,
  torchvision,
} from 'react-native-pytorch-core';

import Measurement from './utils/Measurement';

// Alias for torchvision transforms
const T = torchvision.transforms;

const MobileNetV3Classes = require('./MobileNetV3Classes');

type ImageClassificationResult = {
  maxIdx: number;
  confidence: number;
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

  // Crop the image in the center to be a squared image
  const centerCrop = T.centerCrop(Math.min(width, height));
  tensor = centerCrop(tensor);

  // Resize the image tensor to 3 x 224 x 224
  const resize = T.resize(224);
  tensor = resize(tensor);

  // Normalize the tensor image with mean and standard deviation
  const normalize = T.normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]);
  tensor = normalize(tensor);

  // Unsqueeze adds 1 leading dimension to the tensor
  return tensor.unsqueeze(0);
};

const inferenceFn = async (model: Module, tensor: Tensor): Promise<Tensor> => {
  return await model.forward(tensor);
};

const unpackFn = async (
  resultTensor: Tensor,
): Promise<ImageClassificationResult> => {
  // Process the result for the single image input
  resultTensor = resultTensor.squeeze(0);

  // Get the index of the value with the highest probability
  const maxIdx = resultTensor.argmax().item();

  // Compute the softmax confidence score
  const softmax = resultTensor.softmax(0)[maxIdx].item();

  return {maxIdx, confidence: softmax};
};

export default function useImageModelInference(modelInfo: ModelInfo) {
  const [metrics, setMetrics] = useState<ModelResultMetrics>();
  const [imageClass, setImageClass] = useState<string>();
  const modelRef = useRef<{path: ModelPath; module: Module} | null>(null);

  const processImage = useCallback(
    async (image: Image) => {
      if (
        modelRef.current == null ||
        modelRef.current.path !== modelInfo.model
      ) {
        const filePath = await MobileModel.download(modelInfo.model);
        modelRef.current = {
          path: modelInfo.model,
          module: await torch.jit._loadForMobile(filePath),
        };
      }

      Measurement.mark('pack');
      const inputs = await packFn(image);
      Measurement.measure('pack');

      Measurement.mark('inference');
      const output = await inferenceFn(modelRef.current.module, inputs);
      Measurement.measure('inference');

      Measurement.mark('unpack');
      const {maxIdx, confidence} = await unpackFn(output);
      // Resolve the most likely class label and return it
      const className = MobileNetV3Classes[maxIdx];
      Measurement.measure('unpack');

      const m = Measurement.getMetrics();
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
