/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {useIsFocused} from '@react-navigation/native';
import React, {useCallback, useLayoutEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {Canvas, CanvasRenderingContext2D} from 'react-native-pytorch-core';
import useImageFromUri from '../../utils/useImageFromUri';

export default function CanvasDrawImage() {
  const isFocused = useIsFocused();
  const [drawingContext, setDrawingContext] = useState<
    CanvasRenderingContext2D
  >();

  const catImage = useImageFromUri(
    'https://ichef.bbci.co.uk/news/976/cpsprodpb/12A9B/production/_111434467_gettyimages-1143489763.jpg',
  );
  const capybaraImage = useImageFromUri(
    'https://cdn.britannica.com/79/191679-050-C7114D2B/Adult-capybara.jpg',
  );

  const handleContext2D = useCallback(
    async (ctx: CanvasRenderingContext2D) => {
      setDrawingContext(ctx);
    },
    [setDrawingContext],
  );

  useLayoutEffect(() => {
    const ctx = drawingContext;
    if (ctx != null) {
      ctx.clear();

      if (catImage != null) {
        ctx.drawImage(catImage, 10, 10);
        ctx.drawImage(catImage, 10, 600, 200, 100);
        ctx.drawImage(catImage, 350, 130, 100, 100, 10, 750, 200, 200);
      }

      if (capybaraImage != null) {
        ctx.drawImage(capybaraImage, 10, 1000, 500, 300);
      }

      ctx.invalidate();
    }
  }, [drawingContext, catImage, capybaraImage]);

  if (!isFocused) {
    return null;
  }

  return <Canvas style={styles.canvas} onContext2D={handleContext2D} />;
}

const styles = StyleSheet.create({
  canvas: {
    height: 800,
    width: 600,
  },
});
