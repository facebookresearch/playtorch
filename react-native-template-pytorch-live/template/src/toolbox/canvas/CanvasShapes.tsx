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
import {StyleSheet, LayoutRectangle} from 'react-native';
import {Canvas, CanvasRenderingContext2D} from 'react-native-pytorch-core';

export default function CanvasShapes() {
  const isFocused = useIsFocused();

  // `layout` contains canvas properties like width and height
  const [layout, setLayout] = useState<LayoutRectangle | null>(null);

  // `ctx` is drawing context to draw shapes
  const [ctx, setCtx] = useState<CanvasRenderingContext2D>();

  // handler to get drawing context when canvas is ready. See <Canvas onContext2D={...}> below
  const handleContext2D = useCallback(
    async (ctx: CanvasRenderingContext2D) => {
      setCtx(ctx);
    },
    [setCtx],
  );

  useLayoutEffect(() => {
    if (ctx != null) {
      // Here we use `layout` to calculate center position
      const size = [layout?.width || 0, layout?.height || 0];
      const radius = Math.min(...size) / 3;
      const center = size.map(s => s / 2);

      // clear previous canvas drawing and then redraw
      ctx.clear();

      // draw background rect
      ctx.fillStyle = '#ff4c2c';
      ctx.fillRect(0, 0, size[0], size[1]);

      // draw circle
      ctx.fillStyle = '#4f25c6';
      ctx.fillCircle(center[0], center[1], radius);

      // draw bottom arc
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 5;
      ctx.arc(center[0], center[1], radius, 0, Math.PI / 2);

      // draw rects
      ctx.fillStyle = '#86daff';
      ctx.fillRect(center[0] - radius, center[1] - radius, radius, radius);

      ctx.strokeStyle = '#86daff';
      ctx.lineWidth = 5;
      ctx.strokeRect(center[0], center[1], radius, radius);

      // draw top arc
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 30;
      ctx.beginPath();
      ctx.arc(center[0], center[1], radius, Math.PI, Math.PI + Math.PI / 2);
      ctx.fill();
      ctx.stroke();

      // Need to include this at the end, for now.
      ctx.invalidate();
    }
  }, [ctx, layout]);

  if (!isFocused) {
    return null;
  }

  return (
    <Canvas
      style={StyleSheet.absoluteFill}
      onContext2D={handleContext2D}
      onLayout={event => {
        const {layout} = event.nativeEvent;
        setLayout(layout);
      }}
    />
  );
}
