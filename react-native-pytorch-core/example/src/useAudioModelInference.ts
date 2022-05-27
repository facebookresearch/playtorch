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
  Audio,
  media,
  MobileModel,
  ModelResultMetrics,
  ModelInfo,
  Module,
  Tensor,
  torch,
} from 'react-native-pytorch-core';

import Measurement from './utils/Measurement';

type Wav2Vec2Result = {
  answer: string;
};

const packFn = async (audio: Audio): Promise<Tensor> => {
  // Convert audio to a blob, which is a byte representation of the audio
  // in the format of an array of bytes
  const blob = media.toBlob(audio);

  // Get a tensor of shorts (int16) for the audio data
  const tensor = torch.fromBlob(blob, [1, blob.size / 2], {
    dtype: 'int16',
  });

  // Convert the tensor to a float32 format since the model expects the tensor
  // in a float format
  const floatTensor = tensor.to({dtype: 'float32'});
  return floatTensor;
};

const inferenceFn = async (model: Module, tensor: Tensor): Promise<string> => {
  return await model.forward(tensor);
};

const unpackFn = async (resultTensor: string): Promise<Wav2Vec2Result> => {
  return {answer: resultTensor};
};

export default function useAudioModelInference(modelInfo: ModelInfo) {
  const [metrics, setMetrics] = useState<ModelResultMetrics>();
  const [translatedText, setTranslatedText] = useState<string>();
  const modelRef = useRef<Module | null>(null);

  const processAudio = useCallback(
    async (audio: Audio | null) => {
      if (audio != null) {
        if (modelRef.current == null) {
          const filePath = await MobileModel.download(modelInfo.model);
          modelRef.current = await torch.jit._loadForMobile(filePath);
        }

        Measurement.mark('pack');
        const inputs = await packFn(audio);
        Measurement.measure('pack');

        Measurement.mark('inference');
        const output = await inferenceFn(modelRef.current, inputs);
        Measurement.measure('inference');

        Measurement.mark('unpack');
        const {answer} = await unpackFn(output);
        Measurement.measure('unpack');

        const m = Measurement.getMetrics();
        setTranslatedText(answer);
        setMetrics(m);
      }
    },
    [modelInfo.model, setTranslatedText, setMetrics],
  );

  return {
    translatedText,
    metrics,
    processAudio,
  };
}
