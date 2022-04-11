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
import {StyleSheet, Switch, Text, View} from 'react-native';
import {
  Camera,
  CameraFacing,
  Canvas,
  CanvasRenderingContext2D,
  Image,
} from 'react-native-pytorch-core';

export default function Playground() {
  const isFocused = useIsFocused();
  const [isShowCaptureButton, setIsShowCaptureButton] = React.useState(false);
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

  if (!isFocused) {
    return null;
  }

  return (
    <>
      <Camera
        onFrame={handleCapture}
        hideCaptureButton={!isShowCaptureButton}
        style={styles.camera}
        targetResolution={{width: 480, height: 640}}
        facing={CameraFacing.BACK}
      />
      <Canvas
        style={styles.canvas}
        onContext2D={context => {
          contextRef.current = context;
        }}
      />
      <View style={styles.controls}>
        <View style={styles.control}>
          <Switch
            value={isShowCaptureButton}
            onValueChange={() => setIsShowCaptureButton(v => !v)}
          />
          <Text style={styles.controlLabel}>Show capture button</Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  controls: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 5,
  },
  control: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  controlLabel: {
    paddingStart: 5,
    alignSelf: 'center',
  },
  camera: {
    flex: 1,
  },
  canvas: {
    flex: 1,
  },
  actions: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
});
