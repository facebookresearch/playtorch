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

export default function AudioExample() {
  const [recordedAudio, setRecordedAudio] = useState<Audio | null>();
  const [duration, setDuration] = useState<number | null>();

  function play() {
    setDuration(recordedAudio?.getDuration() ?? null);
    recordedAudio?.play();
  }

  function pause() {
    recordedAudio?.pause();
  }

  function stop() {
    recordedAudio?.stop();
  }

  function release() {
    recordedAudio?.release();
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
      <Text style={styles.textArea}>{'Audio duration is: ' + duration}</Text>
      <View style={styles.container}>
        <TouchableOpacity onPress={play}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>{'Play'}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={pause}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>{'Pause'}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={stop}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>{'Stop'}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={release}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>{'Release'}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    padding: 50,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  button: {
    width: 80,
    height: 40,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff4c2c',
  },
  textArea: {
    marginTop: 20,
    marginLeft: 20,
    color: '#000000',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
