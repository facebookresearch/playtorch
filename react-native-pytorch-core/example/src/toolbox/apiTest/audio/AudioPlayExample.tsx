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
import {AudioUtil} from 'react-native-pytorch-core';
import {TouchableOpacity, View, StyleSheet, Text} from 'react-native';
import {useState} from 'react';

export default function AudioPlayExample() {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordedAudio, setRecordedAudio] = useState<Audio>();

  async function handleRecording() {
    setIsRecording(true);
    const audio = await AudioUtil.record(5);
    setRecordedAudio(audio);
    setIsRecording(false);
  }

  function startRecording() {
    setIsRecording(true);
    handleRecording();
  }

  function play() {
    recordedAudio?.play();
  }

  return (
    <>
      <TouchableOpacity onPress={!isRecording ? startRecording : undefined}>
        <View style={styles.startButton}>
          <Text style={styles.startButtonText}>
            {isRecording ? 'Listening...' : 'Record 5 seconds'}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={play}>
        <View style={styles.playAudioButton}>
          <Text style={styles.startButtonText}>{'Play Recorded Audio'}</Text>
        </View>
      </TouchableOpacity>
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
