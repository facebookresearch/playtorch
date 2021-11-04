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
import {PTLColors as colors} from '../../components/UISettings';

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
      ctx.fillStyle = colors.accent3;
      ctx.fillRect(0, 0, size[0], size[1]);

      // draw circle
      ctx.fillStyle = colors.accent1;
      ctx.fillCircle(center[0], center[1], radius);

      // draw bottom arc
      ctx.strokeStyle = colors.black;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(center[0], center[1], radius, 0, Math.PI / 2);
      ctx.stroke();

      // draw rects
      ctx.fillStyle = colors.accent4;
      ctx.fillRect(center[0] - radius, center[1] - radius, radius, radius);

      ctx.strokeStyle = colors.white;
      ctx.lineWidth = 5;
      ctx.strokeRect(center[0], center[1], radius, radius);

      // draw top arc
      ctx.strokeStyle = colors.light;
      ctx.lineWidth = 20;
      ctx.beginPath();
      ctx.arc(
        center[0],
        center[1],
        radius + 10,
        Math.PI,
        Math.PI + Math.PI / 2,
      );
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
