/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import * as React from 'react';
import {LayoutRectangle, StyleSheet, View} from 'react-native';
import type {CanvasRenderingContext2D} from 'react-native-pytorch-core';
import {Camera, Canvas, Image} from 'react-native-pytorch-core';
import useAnimeGANv2 from '../../useAnimeGANv2';
import {ImageGenerationModels} from '../../Models';

export default function AnimeGANv2() {
  const contextRef = React.useRef<CanvasRenderingContext2D | null>();
  const [layout, setLayout] = React.useState<LayoutRectangle>();

  const {processImage} = useAnimeGANv2(ImageGenerationModels[0]);

  const handleImage = React.useCallback(
    async function handleImage(image: Image) {
      const ctx = contextRef.current;
      if (ctx != null && layout != null) {
        ctx.clearRect(0, 0, layout.width, layout.height);
        ctx.font = '20px sans-serif';
        ctx.fillText('Processing...', 20, 40);
        ctx.invalidate();
      }

      const animeImage = await processImage(image);

      if (ctx != null && layout != null) {
        ctx.clearRect(0, 0, layout.width, layout.height);
        const imageWidth = animeImage.getWidth();
        const imageHeight = animeImage.getHeight();
        const scale = Math.min(
          layout.width / imageWidth,
          layout.height / imageHeight,
        );
        const scaledWidth = imageWidth * scale;
        const scaleHeight = imageHeight * scale;
        ctx.drawImage(
          animeImage,
          Math.floor((layout.width - scaledWidth) / 2),
          Math.floor((layout.height - scaleHeight) / 2),
          scaledWidth,
          scaleHeight,
        );

        await ctx.invalidate();
      }

      await image.release();
      await animeImage.release();
    },
    [layout, processImage],
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
    width: '100%',
    height: '50%',
  },
});
