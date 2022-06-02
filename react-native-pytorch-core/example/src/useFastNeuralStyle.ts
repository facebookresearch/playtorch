/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {useCallback, useRef} from 'react';

import {
  Image,
  media,
  MobileModel,
  ModelInfo,
  Module,
  Tensor,
  torch,
  torchvision,
} from 'react-native-pytorch-core';

import Measurement from './utils/Measurement';

// Alias for torchvision transforms
const T = torchvision.transforms;

const packFn = async (image: Image, size: number): Promise<Tensor> => {
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

  // Crop the image in the center to be a squared image
  const centerCrop = T.centerCrop(Math.min(width, height));
  tensor = centerCrop(tensor);

  // Resize the image tensor to 3 x size x size
  const resize = T.resize(size);
  tensor = resize(tensor);

  // Floating point values on [0, 255]
  tensor = tensor.to({dtype: torch.float32});

  // Unsqueeze adds 1 leading dimension to the tensor
  return tensor.unsqueeze(0);
};

const inferenceFn = async (model: Module, tensor: Tensor): Promise<Tensor> => {
  return await model.forward(tensor);
};

const unpackFn = async (resultTensor: Tensor): Promise<Image> => {
  // Values are already on [0, 255]. Convert to uint8.
  resultTensor = resultTensor[0]
    .clamp({min: 0, max: 255})
    .to({dtype: torch.uint8});

  // Convert the tensor to an image
  return media.imageFromTensor(resultTensor);
};

export default function useFastNeuralStyle(modelInfo: ModelInfo) {
  const modelRef = useRef<Module>();

  const processImage = useCallback(
    async (image: Image, size: number) => {
      if (modelRef.current == null) {
        const filePath = await MobileModel.download(modelInfo.model);
        modelRef.current = await torch.jit._loadForMobile(filePath);
      }

      Measurement.mark('pack');
      const inputs = await packFn(image, size);
      Measurement.measure('pack');

      Measurement.mark('inference');
      const output = await inferenceFn(modelRef.current, inputs);
      Measurement.measure('inference');

      Measurement.mark('unpack');
      const resultImage = await unpackFn(output);
      Measurement.measure('unpack');

      return {metrics: Measurement.getMetrics(), image: resultImage};
    },
    [modelInfo.model],
  );

  return {
    processImage,
  };
}
