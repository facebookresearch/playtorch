/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {useCallback, useMemo, useState} from 'react';
import {
  ModelInfo,
  ModelResultMetrics,
  Module,
  Tensor,
  text,
  torch,
} from 'react-native-pytorch-core';
import {useModel} from '../../../examples/utils/ModelProvider';
import Measurement from '../../../utils/Measurement';

const bert = require('../../../assets/tokenizer/bert/vocab.json');

type NLPQAResult = {
  start_logits: Tensor;
  end_logits: Tensor;
};

const tokenizer = new text.WordPieceTokenizer({vocab: bert.vocab});

const packFn = async (
  document: string,
  question: string,
): Promise<number[]> => {
  const inputText = `[CLS] ${question} [SEP] ${document} [SEP]`;
  return tokenizer.encode(inputText);
};

const inferenceFn = async (
  model: Module,
  tokens: number[],
): Promise<NLPQAResult> => {
  const inputs = torch.tensor([tokens], {dtype: torch.int});
  return await model.forward(inputs);
};

const unpackFn = async (
  tokens: number[],
  output: NLPQAResult,
): Promise<string> => {
  const startId = output.start_logits.argmax().item();
  const endId = output.end_logits.argmax().item();
  return tokenizer.decode(tokens.slice(startId, endId + 1));
};

export default function useNLPQAModelInference(modelInfo: ModelInfo) {
  const model = useModel(modelInfo);
  const [metrics, setMetrics] = useState<ModelResultMetrics>();
  const [answer, setAnswer] = useState<string>();
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const isReady = useMemo(() => model != null, [model]);

  const processQA = useCallback(
    async (document: string, question: string) => {
      if (model == null) {
        return;
      }

      setIsProcessing(true);
      setAnswer('');

      Measurement.mark('pack');
      const tokens = await packFn(document, question);
      Measurement.measure('pack');

      Measurement.mark('inference');
      const output = await inferenceFn(model, tokens);
      Measurement.measure('inference');

      Measurement.mark('unpack');
      const ans = await unpackFn(tokens, output);
      Measurement.measure('unpack');

      const m = Measurement.getMetrics();

      setAnswer(ans);
      setMetrics(m);
      setIsProcessing(false);
    },
    [model, setAnswer, setIsProcessing, setMetrics],
  );

  return {
    answer,
    isProcessing,
    isReady,
    metrics,
    processQA,
  };
}
