/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import React, {useState} from 'react';
import type {Audio} from 'react-native-pytorch-core';
import {AudioUtil} from 'react-native-pytorch-core';
import {TouchableOpacity, View, StyleSheet, Text} from 'react-native';
import PTLAudioRecorder from '../../../components/PTLAudioRecorder';
import emptyFunction from '../../../utils/emptyFunction';

const audioAsset = require('../../../../assets/audio/scent_of_a_woman_future.wav');

export default function AudioSaveLoadExample() {
  const [savedFilePath, setSavedFilePath] = useState<string>('');

  async function save(audio: Audio | null) {
    if (audio != null) {
      const filePath = await AudioUtil.toFile(audio);
      setSavedFilePath(filePath);
    }
  }

  async function loadAndPlay() {
    if (savedFilePath.length > 0) {
      const audio = await AudioUtil.fromFile(savedFilePath);
      audio.play();
    }
  }

  async function loadFromBundleAndPlay() {
    const audio = await AudioUtil.fromBundle(audioAsset);
    audio.play();
  }

  return (
    <>
      <PTLAudioRecorder
        onRecordingStarted={emptyFunction}
        onRecordingComplete={(audio: Audio | null) => {
          save(audio);
        }}
      />
      <TouchableOpacity>
        <View>
          <Text style={styles.filePathText}>
            Saved audio to : {savedFilePath}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={loadAndPlay}>
        <View style={styles.startButton}>
          <Text style={styles.startButtonText}>Load from File and Play</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={loadFromBundleAndPlay}>
        <View style={styles.startButton}>
          <Text style={styles.startButtonText}>Load from Bundle and Play</Text>
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
  filePathText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 20,
    marginTop: 10,
  },
});
