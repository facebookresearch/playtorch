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

export default function CanvasClearRect() {
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

      // Draw yellow background
      ctx.beginPath();
      ctx.fillStyle = '#ffff66';
      ctx.fillRect(0, 0, 300, 150);

      // Draw blue triangle
      ctx.beginPath();
      ctx.fillStyle = 'blue';
      ctx.moveTo(20, 20);
      ctx.lineTo(180, 20);
      ctx.lineTo(130, 130);
      ctx.closePath();
      ctx.fill();

      // Clear part of the canvas
      ctx.clearRect(10, 10, 120, 100);

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
