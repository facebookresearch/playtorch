/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import type {ModelResultMetrics} from 'react-native-pytorch-core';

import {useCallback, useState, useRef, useEffect} from 'react';
import {
  MobileModel,
  Module,
  torch,
  text,
  Tensor,
  ModelInfo,
} from 'react-native-pytorch-core';
import {NLPModels} from './Models';

declare var performance: any;

type BERTModel = {model: Module; vocab: string};

export default function useNLPQAModelInference(modelInfo: ModelInfo) {
  const modelRef = useRef<BERTModel>();

  const [isReady, setIsReady] = useState(false);
  const [metrics, setMetrics] = useState<ModelResultMetrics>();
  const [answer, setAnswer] = useState<string>();
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  useEffect(() => {
    async function loadNLPModel() {
      let model_url = await MobileModel.download(modelInfo.model);
      let vocab_url = NLPModels[0].vocab;
      if (!vocab_url) {
        throw URIError('vocab_url is not valid.');
      }
      const model = await torch.jit._loadForMobile(model_url);
      const vocabJson = await fetch(vocab_url).then(response =>
        response.json(),
      );
      modelRef.current = {model, vocab: vocabJson.vocab};
      setIsReady(true);
    }
    loadNLPModel();
    return () => {
      modelRef.current = undefined;
      setIsReady(false);
    };
  }, [modelInfo]);

  const processQA = useCallback(
    async (context: string, question: string) => {
      setIsProcessing(true);
      setAnswer('');

      let startPackTime,
        startInferenceTime,
        startUnpackTime,
        endUnpackTime: number;

      if (!modelRef.current) {
        throw new ReferenceError(
          'Model resource not founded, either vocab or model is missing.',
        );
      }
      const model = modelRef.current.model;
      const vocab = modelRef.current.vocab;
      startPackTime = performance.now();
      const inputText = `[CLS] ${question} [SEP] ${context} [SEP]`;
      const {WordPieceTokenizer} = text;
      const tokenizer = new WordPieceTokenizer({
        vocab: vocab,
      });
      const arr = tokenizer.encode(inputText);
      const t = torch.tensor([arr], {dtype: torch.int});

      startInferenceTime = performance.now();

      const output = (await model.forward(t)) as {[key: string]: Tensor};
      startUnpackTime = performance.now();

      const startId = output.start_logits.argmax().item();
      const endId = output.end_logits.argmax().item();
      const ans = tokenizer.decode(arr.slice(startId, endId + 1));
      endUnpackTime = performance.now();

      if (ans != null) {
        setAnswer(ans);
      } else {
        setAnswer('No answer found');
      }
      setIsProcessing(false);
      setMetrics({
        totalTime: endUnpackTime - startPackTime,
        inferenceTime: startUnpackTime - startInferenceTime,
        packTime: startInferenceTime - startPackTime,
        unpackTime: endUnpackTime - startUnpackTime,
      });
    },
    [setMetrics, setIsProcessing, setAnswer],
  );

  return {
    answer,
    metrics,
    isProcessing,
    isReady,
    processQA,
  };
}
