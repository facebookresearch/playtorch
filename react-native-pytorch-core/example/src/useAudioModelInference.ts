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
  Audio,
  MobileModel,
  ModelResultMetrics,
  ModelInfo,
} from 'react-native-pytorch-core';

type Wav2Vec2Result = {
  answer: string;
};

export default function useAudioModelInference(modelInfo: ModelInfo) {
  const [metrics, setMetrics] = useState<ModelResultMetrics>();
  const [translatedText, setTranslatedText] = useState<string>();

  const processAudio = useCallback(
    async (audio: Audio) => {
      const {
        result: {answer},
        metrics: m,
      } = await MobileModel.execute<Wav2Vec2Result>(modelInfo.model, {
        audio,
      });
      setMetrics(m);
      setTranslatedText(answer);
    },
    [modelInfo.model, setTranslatedText, setMetrics],
  );

  return {
    translatedText,
    metrics,
    processAudio,
  };
}
