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
import {TouchableOpacity, View, StyleSheet, Text} from 'react-native';
import {useState} from 'react';
import PTLAudioRecorder from '../../../components/PTLAudioRecorder';
import emptyFunction from '../../../utils/emptyFunction';

export default function AudioPlayExample() {
  const [recordedAudio, setRecordedAudio] = useState<Audio | null>();

  function play() {
    recordedAudio?.play();
  }

  async function onRecordingCompleteCallback(audio: Audio | null) {
    if (audio != null) {
      setRecordedAudio(audio);
    }
  }

  return (
    <>
      <PTLAudioRecorder
        onRecordingStarted={emptyFunction}
        onRecordingComplete={onRecordingCompleteCallback}
      />
      <TouchableOpacity onPress={play}>
        <View style={styles.playAudioButton}>
          <Text style={styles.startButtonText}>{'Play Recorded Audio'}</Text>
        </View>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  startButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  playAudioButton: {
    width: 260,
    height: 40,
    marginLeft: 60,
    marginTop: 200,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff4c2c',
  },
});
