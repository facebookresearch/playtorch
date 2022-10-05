/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @oncall playtorch
 */

import {useMemo} from 'react';
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
import Measurement from '../../../utils/Measurement';
import {useModel} from '../../utils/ModelProvider';

type MNISTResult = {
  num: number;
  score: number;
};

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

  // Resize the image tensor to 3 x 28 x 28
  const resize = T.resize(28);
  tensor = resize(tensor);

  // Convert the image to a grayscale image 1 x 28 x 28
  const grayscale = T.grayscale();
  tensor = grayscale(tensor);

  // Normalize the tensor image with mean and standard deviation
  const normalize = T.normalize([0.1307], [0.3081]);
  tensor = normalize(tensor);

  // Unsqueeze adds 1 leading dimension to the tensor
  return tensor.unsqueeze(0);
};

const inferenceFn = async (model: Module, tensor: Tensor): Promise<Tensor> => {
  return await model.forward(tensor);
};

const unpackFn = async (output: Tensor): Promise<MNISTResult[]> => {
  const softmax = output[0].squeeze(0).softmax(-1);

  const sortedScore: MNISTResult[] = [];
  softmax
    .data()
    .forEach((score, index) => sortedScore.push({score: score, num: index}));

  return sortedScore.sort((a, b) => b.score - a.score);
};

/**
 * The React hook provides MNIST model inference on an input image.
 */
export default function useMNIST(modelInfo: ModelInfo) {
  const model = useModel(modelInfo);
  const [metrics, setMetrics] = useState<ModelResultMetrics>();
  const [result, setResult] = useState<MNISTResult[]>();
  const isReady = useMemo(() => model != null, [model]);

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
      const res = await unpackFn(output);
      Measurement.measure('unpack');

      const m = Measurement.getMetrics();

      setResult(res);
      setMetrics(m);
    },
    [model],
  );

  return {
    isReady,
    metrics,
    processImage,
    result,
  };
}
