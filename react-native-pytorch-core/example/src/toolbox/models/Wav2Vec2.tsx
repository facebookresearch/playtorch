/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import * as React from 'react';
import {Audio, MobileModel} from 'react-native-pytorch-core';
import {View, StyleSheet, Text} from 'react-native';
import {useState} from 'react';
import type {ModelResultMetrics} from 'react-native-pytorch-core';
import PTLAudioRecorder from '../../components/PTLAudioRecorder';

const Wav2VecModel = require('../../../models/wav2vec2.ptl');

type Wav2Vec2Result = {
  answer: string;
};

export default function Wav2Vec2() {
  const [answer, setAnswer] = useState<string>('');
  const [metrics, setMetrics] = useState<ModelResultMetrics | null>(null);

  async function onRecordingCompletedCallback(audio: Audio | null) {
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

  function onRecordingStartedCallback() {
    setAnswer('');
    setMetrics(null);
  }

  return (
    <>
      <PTLAudioRecorder
        onRecordingStarted={() => {
          onRecordingStartedCallback();
        }}
        onRecordingComplete={(audio: Audio | null) => {
          onRecordingCompletedCallback(audio);
        }}
      />

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
