/**
 * Copyright (c) Facebook, Inc. and its affiliates.
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
  ImageUtil,
} from 'react-native-pytorch-core';
import {StyleSheet} from 'react-native';

export default function Playground() {
  const isFocused = useIsFocused();
  const contextRef = React.useRef<CanvasRenderingContext2D>();

  const handleCapture = useCallback(
    async (image: Image) => {
      const path = await ImageUtil.toFile(image);
      console.log('file path', path);
      image.release();

      setTimeout(async () => {
        const context = contextRef.current;
        if (context != null) {
          context.clear();
          const loadedImage = await ImageUtil.fromFile(path);
          context.drawImage(loadedImage, 0, 0, 4 * 48, 4 * 64);
          context.invalidate();
          setTimeout(() => {
            loadedImage.release();
          },10);
        }
      }, 1000);
    },
    [contextRef],
  );

  if (!isFocused) {
    return null;
  }

  return (
    <>
      <Camera
        onCapture={handleCapture}
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
  actions: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
});
