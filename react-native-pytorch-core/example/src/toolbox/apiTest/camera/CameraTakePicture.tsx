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
import {
  Camera,
  CameraFacing,
  Canvas,
  CanvasRenderingContext2D,
  Image,
} from 'react-native-pytorch-core';
import {Pressable, StyleSheet} from 'react-native';

export default function Playground() {
  const isFocused = useIsFocused();
  const cameraRef = React.useRef<Camera>(null);
  const contextRef = React.useRef<CanvasRenderingContext2D>();

  const handleCapture = useCallback(
    async (image: Image) => {
      const context = contextRef.current;
      if (context != null) {
        context.clear();
        context.drawImage(image, 0, 0);
        await context.invalidate();
      }
      image.release();
    },
    [contextRef],
  );

  function handleTakePicture() {
    const camera = cameraRef.current;
    if (camera != null) {
      camera.takePicture();
    }
  }

  if (!isFocused) {
    return null;
  }

  return (
    <>
      <Canvas
        style={styles.canvas}
        onContext2D={context => {
          contextRef.current = context;
        }}
      />
      <Camera
        ref={cameraRef}
        onCapture={handleCapture}
        hideCaptureButton={true}
        style={styles.camera}
        targetResolution={{width: 480, height: 640}}
        facing={CameraFacing.BACK}
      />
      <Pressable style={styles.captureButton} onPress={handleTakePicture} />
    </>
  );
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
  },
  canvas: {
    flex: 1,
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
