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
  CameraFacing,
  CanvasRenderingContext2D,
  ImageUtil,
  ModelResultMetrics,
} from 'react-native-pytorch-core';
import {Camera, Canvas, Image, MobileModel} from 'react-native-pytorch-core';
import {LayoutRectangle, StyleSheet, View} from 'react-native';
import ImageClass from '../../components/ImageClass';

const model = 'https://fb.me/ptl/fast_neural_style_candy.ptl';

type StyleTransferResult = {
  image: Image;
};

const pictureSize = 100;

export default function FastNeuralStyle() {
  const [metrics, setMetrics] = React.useState<ModelResultMetrics>();
  const [layout, setLayout] = React.useState<LayoutRectangle>();
  const [context2d, setContext2d] = React.useState<CanvasRenderingContext2D>();
  const isFocused = useIsFocused();

  const handleCapture = useCallback(
    async (image: Image) => {
      const width = image.getWidth();
      const height = image.getHeight();
      const size = Math.min(width, height);
      const {result, metrics: m} =
        await MobileModel.execute<StyleTransferResult>(model, {
          image,
          cropWidth: size,
          cropHeight: size,
          scaleWidth: pictureSize,
          scaleHeight: pictureSize,
        });
      setMetrics(m);

      if (layout != null) {
        context2d?.clearRect(0, 0, layout?.width, layout?.height);
        context2d?.drawImage(
          result.image,
          0,
          0,
          pictureSize,
          pictureSize,
          0,
          layout?.height / 2 - layout?.width / 2,
          layout?.width,
          layout?.width,
        );
        await context2d?.invalidate();
        ImageUtil.release(result.image);
      }

      image.release();
    },
    [setMetrics, layout, context2d],
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
