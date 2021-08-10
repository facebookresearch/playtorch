/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import React, {useCallback, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  Camera,
  Canvas,
  CanvasRenderingContext2D,
  Image,
} from 'react-native-pytorch-core';

export default function CanvasDrawImage() {
  const [drawingContext, setDrawingContext] = useState<
    CanvasRenderingContext2D
  >();

  const handleContext2D = useCallback(
    async (ctx: CanvasRenderingContext2D) => {
      setDrawingContext(ctx);
    },
    [setDrawingContext],
  );

  const handleCapture = useCallback(
    async (image: Image) => {
      const ctx = drawingContext;
      const scaledImage = await image.scale(0.15, 0.15);
      if (ctx != null && image != null) {
        ctx.drawImage(scaledImage, 10, 10);
        ctx.invalidate();
      }
    },
    [drawingContext],
  );

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        onCapture={handleCapture}
        hideCaptureButton={false}
        targetResolution={{"width": 480, "height": 640}}
      />
      <Canvas style={styles.canvas} onContext2D={handleContext2D} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  canvas: {
    flex: 1,
  },
});
