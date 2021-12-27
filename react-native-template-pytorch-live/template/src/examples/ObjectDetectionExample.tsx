/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import React, {useCallback, useState, useRef} from 'react';
import {useIsFocused} from '@react-navigation/native';
import type {CanvasRenderingContext2D} from 'react-native-pytorch-core';
import {Canvas, ModelInfo} from 'react-native-pytorch-core';
import {Camera, Image} from 'react-native-pytorch-core';
import {LayoutRectangle, StyleSheet, View} from 'react-native';
import useObjectDetection, {BoundingBox} from '../useObjectDetection';
import {
  PTLColors as colors,
  PTLFontSizes as fontsizes,
} from '../components/UISettings';
import {HintText, IconButton} from '../components/UIComponents';
import ModelPreloader from '../components/ModelPreloader';
import {ObjectDetectionModels} from '../Models';

const modelInfo: ModelInfo = {
  name: 'DETR',
  model: require('../../models/detr_resnet50.ptl'),
};

const objectColors = [
  '#ee4c2caa',
  '#00cc99aa',
  '#cc2faaaa',
  '#0099ffaa',
  '#812ce5aa',
  '#ffee33aa',
];

export default function ObjectDetectionExample() {
  const isFocused = useIsFocused();
  const contextRef = useRef<CanvasRenderingContext2D | null>();
  const [layout, setLayout] = useState<LayoutRectangle>();
  const [loading, setLoading] = useState(false);
  const [capturing, setCapturing] = useState(true);
  const [hint, setHint] = useState('Capture a photo to detect objects in view');
  const {detectObjects} = useObjectDetection(modelInfo);

  // This is a drawImage function wrapped in useCallback (for improving render performance)
  const drawImage = useCallback(
    (image: Image, boundingBoxes?: BoundingBox[], clear: boolean = true) => {
      // canvas context
      const ctx = contextRef.current;

      if (ctx != null && layout != null && image != null) {
        // draw image in the center of the canvas
        if (clear) {
          ctx.clearRect(0, 0, layout.width, layout.height);
        }

        // Scale image to fit screen
        const imageWidth = image.getWidth();
        const imageHeight = image.getHeight();
        const scale = Math.max(
          layout.width / imageWidth,
          layout.height / imageHeight,
        );
        const displayWidth = imageWidth * scale;
        const displayHeight = imageHeight * scale;
        const offsetX = (layout.width - displayWidth) / 2;
        const offsetY = (layout.height - displayHeight) / 2;
        ctx.drawImage(image, offsetX, offsetY, displayWidth, displayHeight);

        // draw bounding boxes and label them, if provided
        if (boundingBoxes) {
          ctx.lineWidth = 8;
          ctx.font = `${fontsizes.h2}px sans-serif`;
          ctx.fillStyle = colors.dark;
          ctx.textAlign = 'center';

          boundingBoxes.forEach((boundingBox, index) => {
            const {objectClass, bounds} = boundingBox;
            const x = offsetX + bounds[0] * scale;
            const y = offsetY + bounds[1] * scale;
            const w = bounds[2] * scale;
            const h = bounds[3] * scale;

            ctx.strokeStyle = objectColors[index % objectColors.length];
            ctx.beginPath();
            ctx.rect(x, y, w, h);
            ctx.stroke();

            ctx.fillStyle = colors.black;
            ctx.fillText(objectClass, x + w / 2, y - 5);
            ctx.fillStyle = colors.white;
            ctx.fillText(objectClass, x + w / 2 - 1, y - 6);
          });
        }
      }
    },
    [contextRef, layout], // dependencies for useCallback
  );

  // This handler function handles the camera's capture event
  async function handleImage(image: Image) {
    setLoading(true);
    setCapturing(false);
    setHint('Processing...');

    const ctx = contextRef.current;
    if (ctx != null && layout != null) {
      // draw the captured image
      drawImage(image);

      // Loading text
      ctx.font = `${fontsizes.p}px sans-serif`;
      ctx.fillStyle = colors.accent4;
      ctx.textAlign = 'center';

      // Wait for image to process through DETR model and draw resulting image
      const {boundingBoxes} = await detectObjects(image);
      drawImage(image, boundingBoxes);
      setLoading(false);
      setHint(
        `Found ${boundingBoxes.length} object${
          boundingBoxes.length > 1 ? 's' : ''
        }`,
      );

      ctx.invalidate();
    }

    image.release();
  }

  // Handle the reset button and return to the camera capturing mode
  function handleReset() {
    setLoading(false);
    setCapturing(true);
    setHint('Capture a photo to detect objects in view');
  }

  // Don't run this example when it's not actively in view in the navigation
  if (!isFocused) {
    return null;
  }

  return (
    <ModelPreloader modelInfos={ObjectDetectionModels}>
      <View style={styles.container}>
        <Canvas
          style={styles.canvas}
          onLayout={event => {
            setLayout(event.nativeEvent.layout);
          }}
          onContext2D={ctx => (contextRef.current = ctx)}
        />

        {capturing && (
          <Camera
            style={styles.camera}
            onCapture={handleImage}
            hideCaptureButton={false}
            targetResolution={{width: 1920, height: 1080}}
          />
        )}

        <HintText text={hint} />

        {!loading && !capturing && (
          <IconButton
            icon="camera"
            style={styles.cameraButton}
            onPress={handleReset}
          />
        )}
      </View>
    </ModelPreloader>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: colors.light,
    alignContent: 'center',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    alignSelf: 'stretch',
  },
  canvas: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  cameraButton: {
    marginBottom: 30,
    borderWidth: 3,
    borderColor: colors.tintBlack,
  },
});
