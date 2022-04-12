/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import * as React from 'react';
import type {Audio} from 'react-native-pytorch-core';
import {View, StyleSheet, Text} from 'react-native';
import {useCallback} from 'react';
import PTLAudioRecorder from '../../components/PTLAudioRecorder';
import useAudioModelInference from '../../useAudioModelInference';
import {AudioModels} from '../../Models';
import emptyFunction from '../../utils/emptyFunction';

export default function Wav2Vec2() {
  const {translatedText, metrics, processAudio} = useAudioModelInference(
    AudioModels[0],
  );

  const handleRecordingComplete = useCallback(
    async (audio: Audio | null) => {
      await processAudio(audio);
    },
    [processAudio],
  );

  return (
    <>
      <PTLAudioRecorder
        onRecordingStarted={emptyFunction}
        onRecordingComplete={handleRecordingComplete}
      />

      <View style={styles.center}>
        <Text style={styles.small}>{translatedText}</Text>
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
