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

export default function CanvasMiterLimit() {
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

      // Clear canvas
      ctx.clearRect(0, 0, 150, 150);

      // Draw guides
      ctx.strokeStyle = '#0099ff';
      ctx.lineWidth = 2;
      ctx.strokeRect(-5, 50, 160, 50);

      // Set line styles
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 10;

      // change this to see the effects
      ctx.miterLimit = 7;

      // Draw lines
      ctx.beginPath();
      ctx.moveTo(0, 100);
      for (let i = 0; i < 24; i++) {
        var dy = i % 2 === 0 ? 25 : -25;
        ctx.lineTo(Math.pow(i, 1.5) * 2, 75 + dy);
      }
      ctx.stroke();

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
