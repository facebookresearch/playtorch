/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {useIsFocused} from '@react-navigation/native';
import * as React from 'react';
import {AudioUtil, MobileModel} from 'react-native-pytorch-core';
import {TouchableOpacity, View, StyleSheet, Text} from 'react-native';
import {useState} from 'react';
import type {ModelResultMetrics} from 'react-native-pytorch-core';

const Wav2VecModel = require('../../../models/wav2vec2.ptl');

type Wav2Vec2Result = {
  answer: string;
};

export default function Wav2Vec2() {
  const [answer, setAnswer] = useState<string>('');
  const [metrics, setMetrics] = useState<ModelResultMetrics | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);

  const isFocused = useIsFocused();

  async function stopRecording() {
    const audio = await AudioUtil.stopRecord();
    setIsRecording(false);
    if (audio == null) {
      console.log('No audio recorded!');
      return;
    }
    const {metrics: m, result} = await MobileModel.execute<Wav2Vec2Result>(
      Wav2VecModel,
      {
        audio,
      },
    );
    setMetrics(m);
    setAnswer(result.answer);
  }

  if (!isFocused) {
    return null;
  }

  function startRecording() {
    setIsRecording(true);
    AudioUtil.startRecord();
    setAnswer('');
    setMetrics(null);
  }

  return (
    <>
      <TouchableOpacity onPress={!isRecording ? startRecording : stopRecording}>
        <View style={styles.startButton}>
          <Text style={styles.startButtonText}>
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </Text>
        </View>
      </TouchableOpacity>

      <View style={styles.center}>
        <Text style={styles.small}>{answer}</Text>
        {metrics && (
          <Text style={styles.small}>
            Time taken: {metrics?.totalTime}ms (p={metrics?.packTime}/i=
            {metrics?.inferenceTime}/u={metrics?.unpackTime}
          </Text>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  startButton: {
    width: 260,
    height: 40,
    marginLeft: 60,
    marginTop: 100,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff4c2c',
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  small: {
    fontSize: 14,
    color: '#678',
    marginTop: 20,
    width: 260,
    fontFamily: 'Courier New',
    alignItems: 'center',
  },
  center: {
    alignItems: 'center',
  },
});
