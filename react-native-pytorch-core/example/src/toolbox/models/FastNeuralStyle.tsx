/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {useIsFocused} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {
  Camera,
  CameraFacing,
  Canvas,
  CanvasRenderingContext2D,
  Image,
  ModelResultMetrics,
  ModelInfo,
} from 'react-native-pytorch-core';
import {LayoutRectangle, StyleSheet, View} from 'react-native';
import ImageClass from '../../components/ImageClass';
import useFastNeuralStyle from '../../useFastNeuralStyle';

const model: ModelInfo = {
  name: 'FastNeuralStyle',
  model: 'https://fb.me/ptl/fast_neural_style_candy.ptl',
};

const pictureSize = 100;

export default function FastNeuralStyle() {
  const [metrics, setMetrics] = useState<ModelResultMetrics>();
  const [layout, setLayout] = useState<LayoutRectangle>();
  const [context2d, setContext2d] = useState<CanvasRenderingContext2D>();
  const isFocused = useIsFocused();

  const {processImage} = useFastNeuralStyle(model);

  const handleCapture = useCallback(
    async (image: Image) => {
      const {metrics: m, image: resultImage} = await processImage(
        image,
        pictureSize,
      );
      setMetrics(m);

      if (layout != null && context2d != null) {
        context2d.clearRect(0, 0, layout.width, layout.height);
        context2d.drawImage(
          resultImage,
          0,
          0,
          pictureSize,
          pictureSize,
          0,
          layout.height / 2 - layout.width / 2,
          layout.width,
          layout.width,
        );
        await context2d.invalidate();
      }
      resultImage.release();
      image.release();
    },
    [layout, context2d, setMetrics, processImage],
  );

  if (!isFocused) {
    return null;
  }

  return (
    <View style={styles.background}>
      <Camera
        onFrame={handleCapture}
        style={styles.camera}
        targetResolution={{width: 480, height: 640}}
        facing={CameraFacing.FRONT}
      />
      <Canvas
        style={styles.canvas}
        onLayout={e => setLayout(e.nativeEvent.layout)}
        onContext2D={setContext2d}
      />
      <ImageClass
        style={styles.metrics}
        imageClass={'Candy Style Transfer'}
        metrics={metrics}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: 'black',
    flex: 1,
  },
  camera: {
    position: 'absolute',
    display: 'none',
  },
  canvas: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    flex: 1,
  },
  metrics: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    left: 0,
  },
});
