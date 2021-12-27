/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {useIsFocused} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {
  Canvas,
  CanvasRenderingContext2D,
  Image,
  ImageUtil,
} from 'react-native-pytorch-core';

export default function ImageScale() {
  const isFocused = useIsFocused();
  const [catImage, setCatImage] = useState<Image>();
  const [scaledCatImage, setScaledCatImage] = useState<Image>();
  const [drawingContext, setDrawingContext] =
    useState<CanvasRenderingContext2D>();

  const handleContext2D = useCallback(
    async (ctx: CanvasRenderingContext2D) => {
      setDrawingContext(ctx);
    },
    [setDrawingContext],
  );

  useEffect(() => {
    (async () => {
      const loadedTeapotImage = await ImageUtil.fromBundle(
        require('../../../assets/images/teapot.jpg'),
      );
      setCatImage(loadedTeapotImage);
      const loadedScaledCatImage = await loadedTeapotImage.scale(0.25, 0.5);
      setScaledCatImage(loadedScaledCatImage);
    })();
  }, [setCatImage, setScaledCatImage]);

  useEffect(() => {
    const ctx = drawingContext;
    if (ctx != null && catImage != null && scaledCatImage != null) {
      ctx.clear();

      ctx.drawImage(catImage, 10, 10);
      ctx.drawImage(scaledCatImage, 50, 200);

      ctx.invalidate();
    }
  }, [drawingContext, catImage, scaledCatImage]);

  if (!isFocused) {
    return null;
  }

  return (
    <Canvas style={StyleSheet.absoluteFill} onContext2D={handleContext2D} />
  );
}
