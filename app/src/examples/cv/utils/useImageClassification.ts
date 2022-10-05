/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
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

const unpackFn = async (output: Tensor): Promise<number> => {
  // Get the index of the value with the highest probability
  return output.argmax().item();
};

export default function useImageModelInference(
  modelInfo: ModelInfo,
  imageClasses: {[key: string]: string},
) {
  const model = useModel(modelInfo);
  const [metrics, setMetrics] = useState<ModelResultMetrics>();
  const [imageClass, setImageClass] = useState<string>();
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
      const maxIdx = await unpackFn(output);
      // Resolve the most likely class label and return it
      const className = imageClasses[maxIdx];
      Measurement.measure('unpack');

      const m = Measurement.getMetrics();

      setImageClass(className);
      setMetrics(m);
    },
    [imageClasses, model],
  );

  return {
    imageClass,
    isReady,
    metrics,
    processImage,
  };
}
