/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {useIsFocused} from '@react-navigation/native';
import * as React from 'react';
import {AudioUtil, MobileModel} from 'react-native-pytorch-core';
import {Button, StyleSheet, Text} from 'react-native';
import {useState} from 'react';
import type {ModelResultMetrics} from 'react-native-pytorch-core';

const Wav2VecModel = require('../../../models/wav2vec2.ptl');

type Wav2Vec2Result = {
  answer: string;
};

export default function Wav2Vec2() {
  const [text, setText] = useState<string>('');
  const [metrics, setMetrics] = useState<ModelResultMetrics>();
  const isFocused = useIsFocused();

  async function handleRecording() {
    const audio = await AudioUtil.record(5);
    console.log(audio);

    const {metrics: m, result} = await MobileModel.execute<Wav2Vec2Result>(
      Wav2VecModel,
      {
        audio,
      },
    );

    setText(result.answer);
    setMetrics(m);
  }

  if (!isFocused) {
    return null;
  }

  return (
    <>
      <Button title="Record 5 seconds" onPress={handleRecording} />
      <Text>{text}</Text>
      <Text style={styles.small}>
        Time taken: {metrics?.totalTime}ms (p={metrics?.packTime}/i=
        {metrics?.inferenceTime}/u={metrics?.unpackTime})
      </Text>
    </>
  );
 }

const styles = StyleSheet.create({
  small: {
    fontSize: 11,
    color: '#678',
    fontFamily: 'Courier New',
  },
});
