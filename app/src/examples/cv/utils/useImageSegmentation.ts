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
import {useModel} from '../../../examples/utils/ModelProvider';
import Measurement from '../../../utils/Measurement';

// Alias for torchvision transforms
const T = torchvision.transforms;

type DeeplabV3Output = {out: Tensor};

const palette = [
  [240, 248, 255], // '__background__',aliceblue
  [100, 149, 237], // 'aeroplane',cornflowerblue
  [255, 248, 220], // 'bicycle',cornsilk
  [220, 20, 60], // 'bird',crimson
  [0, 255, 255], // 'boat',cyan
  [0, 0, 139], // 'bottle',darkblue,
  [0, 139, 139], // 'bus',darkcyan
  [184, 134, 11], // 'car',darkgoldenrod
  [169, 169, 169], // 'cat',darkgray
  [250, 235, 215], // 'chair',antiquewhite
  [0, 255, 255], // 'cow',aqua
  [127, 255, 212], // 'diningtable',aquamarine
  [245, 245, 220], // 'dog',beige
  [0, 0, 255], // 'horse',blue
  [138, 43, 226], // 'motorbike',blueviolet
  [165, 42, 42], // 'person',brown
  [222, 184, 135], // 'pottedplant',burlywood
  [95, 158, 160], // 'sheep',cadetblue
  [127, 255, 0], // 'sofa',chartreuse
  [210, 105, 30], // 'train',chocolate
  [255, 127, 80], // 'tvmonitor',coral
];

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

  // Convert the data type of numbers in the tensor to 32 bit floating point numbers
  tensor = tensor.to({dtype: torch.float32});

  // Divide the tensor values by 255 to get values between [0, 1]
  tensor = tensor.div(255);

  // Normalize the distribution of numbers in the tensor
  let normalize = T.normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]);
  tensor = normalize(tensor);

  // Unsqueeze adds 1 leading dimension to the tensor
  tensor = tensor.unsqueeze(0);

  return tensor;
};

const inferenceFn = async (
  model: Module,
  tensor: Tensor,
): Promise<DeeplabV3Output> => {
  return await model.forward(tensor);
};

const unpackFn = async (tensor: DeeplabV3Output): Promise<Tensor> => {
  const result = tensor.out.squeeze(0).argmax({dim: 0});
  const data = result.data();
  const height = result.shape[0];
  const width = result.shape[1];
  const pixels: number[][][] = [[], [], []];
  for (let row = 0; row < height; row++) {
    pixels[0].push([]);
    pixels[1].push([]);
    pixels[2].push([]);
    for (let col = 0; col < width; col++) {
      let objectClass = data[row * width + col] as number;
      pixels[0][row].push(palette[objectClass][0]);
      pixels[1][row].push(palette[objectClass][1]);
      pixels[2][row].push(palette[objectClass][2]);
    }
  }
  const maskTensor = torch.tensor(pixels).to({dtype: torch.uint8});
  return maskTensor;
};

export default function useImageSegmentation(modelInfo: ModelInfo) {
  const model = useModel(modelInfo);
  const [metrics, setMetrics] = useState<ModelResultMetrics>();

  const processImage = useCallback(
    async (image: Image) => {
      if (model == null) {
        return;
      }

      Measurement.mark('pack');
      const inputs = await packFn(image);
      Measurement.measure('pack');

      Measurement.mark('inference');
      const output = await inferenceFn(model, inputs);
      Measurement.measure('inference');

      Measurement.mark('unpack');
      const maskTensor = await unpackFn(output);
      Measurement.measure('unpack');

      const m = Measurement.getMetrics();

      setMetrics(m);
      return maskTensor;
    },
    [model],
  );

  return {
    metrics,
    processImage,
  };
}
