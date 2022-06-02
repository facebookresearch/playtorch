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
import {StyleSheet} from 'react-native';
import {
  Canvas,
  CanvasRenderingContext2D,
  ImageUtil,
} from 'react-native-pytorch-core';
import useLayoutEffectAsync from '../../utils/useLayoutEffectAsync';

export default function CanvasGetImageData() {
  const isFocused = useIsFocused();
  const [drawingContext, setDrawingContext] =
    useState<CanvasRenderingContext2D>();

  const handleContext2D = useCallback(
    async (ctx: CanvasRenderingContext2D) => {
      setDrawingContext(ctx);
    },
    [setDrawingContext],
  );

  useLayoutEffectAsync(async () => {
    const ctx = drawingContext;
    if (ctx != null) {
      ctx.clear();

      ctx.strokeStyle = 'black';

      // Draw shapes
      for (let i = 0; i <= 3; i++) {
        for (let j = 0; j <= 2; j++) {
          ctx.beginPath();
          let x = 25 + j * 50; // x coordinate
          let y = 25 + i * 50; // y coordinate
          let radius = 20; // Arc radius
          let startAngle = 0; // Starting point on circle
          let endAngle = Math.PI + (Math.PI * j) / 2; // End point on circle
          let counterclockwise = i % 2 === 1; // Draw counterclockwise

          ctx.arc(x, y, radius, startAngle, endAngle, counterclockwise);

          if (i > 1) {
            ctx.fill();
          } else {
            ctx.stroke();
          }
        }
      }

      const imageData = await ctx.getImageData(25, 25, 100, 150);
      ctx.strokeStyle = 'red';
      ctx.strokeRect(25, 25, 100, 150);

      ctx.putImageData(imageData, 200, 25);

      const image = await ImageUtil.fromImageData(imageData);
      ctx.drawImage(image, 200, 225);

      ctx.invalidate();
    }
  }, [drawingContext]);

  if (!isFocused) {
    return null;
  }

  return (
    <Canvas style={StyleSheet.absoluteFill} onContext2D={handleContext2D} />
  );
}
