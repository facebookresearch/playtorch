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
    return () => {
      AudioUtil.isRecording().then(isRecording => {
        if (isRecording) {
          // Make sure we stop the current recording before we navigate
          console.log('Finishing ongoing recording..');
          AudioUtil.stopRecord();
        }
      });
    };
  }, [isFocused]);

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
    <View style={styles.container}>
      <TouchableOpacity
        onPress={!isAudioRecording ? startRecording : stopRecording}>
        <View style={styles.startButton}>
          <Text style={styles.startButtonText}>
            {isAudioRecording ? 'Stop Recording' : 'Start Recording'}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    marginTop: 100,
  },
  startButton: {
    width: 260,
    height: 40,
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
