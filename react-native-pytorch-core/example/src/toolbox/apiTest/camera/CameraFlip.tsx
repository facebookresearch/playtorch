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
import {useCallback} from 'react';
import {Camera, CameraFacing} from 'react-native-pytorch-core';
import {Pressable, StyleSheet, Text, View} from 'react-native';

export default function Playground() {
  const isFocused = useIsFocused();
  const cameraRef = React.useRef<Camera>(null);

  const handleFlipCamera = useCallback(() => {
    cameraRef.current?.flip();
  }, [cameraRef]);

  if (!isFocused) {
    return null;
  }

  return (
    <>
      <Camera
        ref={cameraRef}
        hideCaptureButton={true}
        hideFlipButton={true}
        style={styles.camera}
        targetResolution={{width: 480, height: 640}}
        facing={CameraFacing.BACK}
      />
      <View style={styles.floatingTextContainer}>
        <Text style={styles.floatingText}>Press button to flip camera</Text>
      </View>
      <Pressable style={styles.captureButton} onPress={handleFlipCamera} />
    </>
  );
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
  },
  floatingTextContainer: {
    position: 'absolute',
    bottom: 100,
    width: '100%',
    alignItems: 'center',
  },
  floatingText: {
    color: 'white',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  captureButton: {
    alignSelf: 'center',
    backgroundColor: 'white',
    borderColor: 'black',
    borderRadius: 40,
    borderWidth: 5,
    bottom: 10,
    height: 80,
    position: 'absolute',
    width: 80,
  },
});
