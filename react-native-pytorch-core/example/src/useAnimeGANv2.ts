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

// Alias for torchvision transforms
const T = torchvision.transforms;

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

  // Center crop the image tensor to a square
  const cropValue = Math.min(width, height);
  const centerCrop = T.centerCrop(cropValue);
  tensor = centerCrop(tensor);

  // Resize the image tensor to 3 x min(height, 512) x min(width, 512)
  const resize = T.resize(512);
  tensor = resize(tensor);

  // Shift from [0, 1] to [-1, 1]
  tensor = tensor.mul(2).sub(1);

  // Unsqueeze adds 1 leading dimension to the tensor
  tensor = tensor.unsqueeze(0);

  return tensor;
};

const inferenceFn = async (model: Module, tensor: Tensor): Promise<Tensor> => {
  return await model.forward(tensor);
};

const unpackFn = async (tensor: Tensor): Promise<Image> => {
  // Squeeze removes dimension at 0 with size 1
  tensor = tensor.squeeze(0);

  // Shift from [-1, 1] to [0, 1]
  tensor = tensor.add(1).div(2);

  // Multiply the tensor values by 255 to get values between [0, 255]
  // and convert the tensor to uint8 tensor
  tensor = tensor.mul(255).to({dtype: torch.uint8});

  // Convert the tensor to an image
  return media.imageFromTensor(tensor);
};

export default function useAnimeGANv2(modelInfo: ModelInfo) {
  const modelRef = useRef<Module | null>(null);

  const processImage = useCallback(
    async (image: Image) => {
      if (modelRef.current == null) {
        const filePath = await MobileModel.download(modelInfo.model);
        modelRef.current = await torch.jit._loadForMobile(filePath);
      }

      const inputs = await packFn(image);

      const output = await inferenceFn(modelRef.current, inputs);

      const animeImage = await unpackFn(output);

      return animeImage;
    },
    [modelInfo.model],
  );

  return {
    processImage,
  };
}
