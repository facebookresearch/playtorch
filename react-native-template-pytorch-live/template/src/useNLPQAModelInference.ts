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
import type {ModelInfo, ModelResultMetrics} from 'react-native-pytorch-core';

const MODEL_INPUT_LENGTH = 360;

type NLPQAResult = {
  answer: string;
};

export default function useNLPQAModelInference(modelInfo: ModelInfo) {
  const [metrics, setMetrics] = useState<ModelResultMetrics>();
  const [answer, setAnswer] = useState<string>();
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const processQA = useCallback(
    async (text: string, question: string) => {
      setIsProcessing(true);
      setAnswer('');

      const inputText = `[CLS] ${question} [SEP] ${text} [SEP]`;
      const {
        result: {answer: ans},
        metrics: m,
      } = await MobileModel.execute<NLPQAResult>(modelInfo.model, {
        text: inputText,
        modelInputLength: MODEL_INPUT_LENGTH,
      });

      if (ans !== null) {
        setAnswer(ans);
      } else {
        setAnswer('No answer found');
      }

      setMetrics(m);
      setIsProcessing(false);
    },
    [setIsProcessing, setAnswer, setMetrics, modelInfo.model],
  );

  return {
    answer,
    metrics,
    isProcessing,
    processQA,
  };
}
