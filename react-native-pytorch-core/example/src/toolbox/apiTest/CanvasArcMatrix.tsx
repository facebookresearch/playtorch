/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
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

function drawArcGrid(
  ctx: CanvasRenderingContext2D,
  offsetX: number,
  offsetY: number,
  radius: number,
  gridSize: number,
  anticlockwise: boolean,
  isFill: boolean,
): void {
  for (let row = 0; row < 10; row++) {
    const startAngle = row * 0.5 * Math.PI;
    for (let col = 0; col < 10; col++) {
      const endAngle = col * 0.5 * Math.PI;
      ctx.beginPath();
      ctx.arc(
        col * gridSize + offsetX,
        row * gridSize + offsetY,
        radius,
        startAngle,
        endAngle,
        anticlockwise,
      );
      isFill ? ctx.fill() : ctx.stroke();
    }
  }
}

export default function CanvasArcMatrix() {
  const isFocused = useIsFocused();
  const [drawingContext, setDrawingContext] =
    useState<CanvasRenderingContext2D>();

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

      const radius = 5;
      const gridSize = 15;
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#00ff00';
      ctx.fillStyle = '#ff00ff';

      // Draw grid of circles in clockwise direction
      drawArcGrid(ctx, 20, 20, radius, gridSize, false, false);

      // Draw grid of circles in anticlockwise direction
      drawArcGrid(ctx, 200, 20, radius, gridSize, true, false);

      // Draw grid of filled circles in clockwise direction
      drawArcGrid(ctx, 20, 200, radius, gridSize, false, true);

      // Draw grid of filled circles in anticlockwise direction
      drawArcGrid(ctx, 200, 200, radius, gridSize, true, true);

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
