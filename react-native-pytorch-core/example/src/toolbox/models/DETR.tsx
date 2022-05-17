/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import * as React from 'react';
import type {CanvasRenderingContext2D} from 'react-native-pytorch-core';
import {Canvas} from 'react-native-pytorch-core';
import {Camera, Image} from 'react-native-pytorch-core';
import {LayoutRectangle, StyleSheet, View} from 'react-native';
import useObjectDetection from '../../useObjectDetection';
import {ObjectDetectionModels} from '../../Models';

export default function DETR() {
  const contextRef = React.useRef<CanvasRenderingContext2D | null>();
  const [layout, setLayout] = React.useState<LayoutRectangle>();
  const {detectObjects} = useObjectDetection(ObjectDetectionModels[0]);

  const handleImage = React.useCallback(
    async function handleImage(image: Image) {
      const ctx = contextRef.current;
      if (ctx != null && layout != null) {
        ctx.clearRect(0, 0, layout.width, layout.height);
        ctx.fillStyle = 'white';
        ctx.font = '20px sans-serif';
        ctx.fillText('Processing...', 20, 40);
        ctx.invalidate();
      }

      const {boundingBoxes} = await detectObjects(image);

      if (ctx != null && layout != null) {
        ctx.clearRect(0, 0, layout.width, layout.height);
        const imageWidth = image.getWidth();
        const imageHeight = image.getHeight();
        const scale = Math.min(
          layout.width / imageWidth,
          layout.height / imageHeight,
        );
        ctx.drawImage(image, 0, 0, imageWidth * scale, imageHeight * scale);

        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.fillStyle = 'white';
        ctx.font = '12px sans-serif';
        boundingBoxes.forEach(boundingBox => {
          ctx.beginPath();
          const {objectClass, bounds} = boundingBox;
          ctx.fillText(objectClass, bounds[0] * scale, bounds[1] * scale - 5);
          ctx.rect(
            bounds[0] * scale,
            bounds[1] * scale,
            bounds[2] * scale,
            bounds[3] * scale,
          );
          ctx.stroke();
        });

        ctx.invalidate();
      }

      setTimeout(() => {
        image.release();
      }, 0);
    },
    [layout, detectObjects],
  );

  function handleContext2D(ctx: CanvasRenderingContext2D) {
    contextRef.current = ctx;
  }

  return (
    <View style={styles.container}>
      <Canvas
        style={styles.canvas}
        onLayout={event => {
          setLayout(event.nativeEvent.layout);
        }}
        onContext2D={handleContext2D}
      />
      <Camera
        style={styles.camera}
        onCapture={handleImage}
        hideCaptureButton={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: 'black',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    width: '50%',
    height: '50%',
  },
  canvas: {
    width: '50%',
    height: '50%',
  },
});
