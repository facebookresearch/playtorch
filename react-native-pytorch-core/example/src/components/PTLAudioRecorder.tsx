/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import * as React from 'react';
import {TouchableOpacity, View, StyleSheet, Text} from 'react-native';
import {useEffect, useState} from 'react';
import {useIsFocused} from '@react-navigation/native';
import emptyFunction from '../utils/emptyFunction';
import {AudioUtil} from 'react-native-pytorch-core';

type Props = {
  onRecordingStarted: Function;
  onRecordingComplete: Function;
};

export default function PTLAudioRecorder(props: Props) {
  const onRecordingStartedCallback = props.onRecordingStarted;
  const onRecordingCompleteCallback = props.onRecordingComplete;
  const isFocused = useIsFocused();
  const [isAudioRecording, setIsAudioRecording] = useState<boolean>(false);

  useEffect(() => {
    return function cleanup() {
      if (isAudioRecording && !isFocused) {
        // Make sure we stop the current recording before we navigate
        console.log('Finishing ongoing recording..');
        AudioUtil.stopRecord().then(emptyFunction);
      }
    };
  });

  async function stopRecording() {
    const audio = await AudioUtil.stopRecord();
    setIsAudioRecording(false);
    if (onRecordingCompleteCallback) {
      onRecordingCompleteCallback(audio);
    }
  }

  function startRecording() {
    AudioUtil.startRecord();
    setIsAudioRecording(true);
    if (onRecordingStartedCallback) {
      onRecordingStartedCallback();
    }
  }

  if (!isFocused) {
    return null;
  }

  return (
    <>
      <TouchableOpacity
        onPress={!isAudioRecording ? startRecording : stopRecording}>
        <View style={styles.startButton}>
          <Text style={styles.startButtonText}>
            {isAudioRecording ? 'Stop Recording' : 'Start Recording'}
          </Text>
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
});
