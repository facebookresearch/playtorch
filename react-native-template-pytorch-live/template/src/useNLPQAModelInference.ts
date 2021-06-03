/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {useCallback, useState} from 'react';
import {MobileModel} from 'react-native-pytorch-core';
import {ModelInfo} from './Models';

const MODEL_INPUT_LENGTH = 360;

export default function useNLPQAModelInference(modelInfo: ModelInfo) {
  const [inferenceTime, setInferenceTime] = useState<number>();
  const [answer, setAnswer] = useState<string>();
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const processQA = useCallback(
    async (text: string, question: string) => {
      setIsProcessing(true);
      setAnswer('');

      const inputText = `[CLS] ${question} [SEP] ${text} [SEP]`;
      const {
        result: {answer},
        inferenceTime,
      } = await MobileModel.execute(modelInfo.model, {
        text: inputText,
        modelInputLength: MODEL_INPUT_LENGTH,
      });

      setAnswer(answer);
      setInferenceTime(inferenceTime);
      setIsProcessing(false);
    },
    [setIsProcessing, setAnswer, setInferenceTime],
  );

  return {
    answer,
    inferenceTime,
    isProcessing,
    processQA,
  };
}
