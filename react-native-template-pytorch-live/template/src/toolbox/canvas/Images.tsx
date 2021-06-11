/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {useIsFocused} from '@react-navigation/native';
import React, {useCallback, useLayoutEffect, useState, useEffect} from 'react';
import {StyleSheet, View, Image, LayoutRectangle} from 'react-native';
import {
  Canvas,
  CanvasRenderingContext2D,
  ImageUtil,
  Image as PyTorchImage,
} from 'react-native-pytorch-core';
import useImageFromBundle from '../../utils/useImageFromBundle';
import useImageFromURL from '../../utils/useImageFromURL';

export default function Images() {
  const isFocused = useIsFocused();
  const [ctx, setCtx] = useState<CanvasRenderingContext2D>();

  // `layout` contains canvas properties like width and height
  const [layout, setLayout] = useState<LayoutRectangle | null>(null);

  // load an online image from USFWS National Digital Library
  const birdImage = useImageFromURL(
    'https://digitalmedia.fws.gov/digital/api/singleitem/image/natdiglib/28807/default.jpg',
  );

  // load a local image file
  const flamingoImage = useImageFromBundle(
    require('../../../assets/images/flamingo.jpg'),
  );

  const handleContext2D = useCallback(
    async (ctx: CanvasRenderingContext2D) => {
      setCtx(ctx);
    },
    [setCtx],
  );

  useLayoutEffect(() => {
    if (ctx != null) {
      // clear previous canvas drawing and then redraw
      ctx.clear();

      if (birdImage != null && flamingoImage != null) {
        // Here we use `layout` to calculate center position
        const size = [layout?.width || 0, layout?.height || 0];

        // draw two flamingo images on canvas
        // calculate margins to center an image on canvas
        const aspectRatio =
          flamingoImage.getWidth() / flamingoImage.getHeight();
        const marginH = 20;
        const marginV = (size[1] - (size[0] - marginH * 2) / aspectRatio) / 2;

        ctx.drawImage(flamingoImage, 0, 0);
        ctx.fillStyle = '#000000bb';
        ctx.fillRect(0, 0, size[0], size[1]);
        ctx.drawImage(
          flamingoImage,
          marginH,
          marginV,
          size[0] - marginH * 2,
          size[1] - marginV * 2,
        );

        // draw bird images (cropped) on canvas
        const birdImageMargin = 20;
        const cropSize = 200;
        const targetSize = 50;
        ctx.drawImage(
          birdImage,
          birdImageMargin,
          birdImageMargin,
          targetSize / 1.5,
          targetSize / 1.5,
        );
        ctx.drawImage(
          birdImage,
          birdImage.getWidth() / 3,
          birdImage.getHeight() / 3,
          cropSize,
          cropSize,
          64,
          birdImageMargin,
          targetSize,
          targetSize,
        );
        ctx.drawImage(
          birdImage,
          birdImage.getWidth() / 3,
          birdImage.getHeight() / 3,
          cropSize,
          cropSize,
          125,
          birdImageMargin,
          targetSize * 1.5,
          targetSize * 1.5,
        );
      } else {
        ctx.fillStyle = '#000000';
        ctx.fillText(`Loading images...`, 20, 40);
      }

      // Need to include this at the end, for now.
      ctx.invalidate();
    }
  }, [ctx, birdImage, flamingoImage]);

  if (!isFocused) {
    return null;
  }

  // The top half shows images drawn on canvas, the bottom half shows an image inside an <Image> component
  return (
    <View style={StyleSheet.absoluteFill}>
      <Canvas
        style={{flex: 2}}
        onContext2D={handleContext2D}
        onLayout={event => {
          const {layout} = event.nativeEvent;
          setLayout(layout);
        }}
      />
      <View style={{flex: 1, padding: 0, backgroundColor: '#000000'}}>
        <Image
          style={{width: '100%', height: '100%', resizeMode: 'cover'}}
          source={require('../../../assets/images/zebra.jpg')}
        />
      </View>
    </View>
  );
}
