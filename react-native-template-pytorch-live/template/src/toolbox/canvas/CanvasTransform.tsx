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

export default function CanvasStarter() {
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
      const half = size.map(s => s / 2);
      const quarter = size.map(s => s / 4);

      // fill background by drawing a rect
      ctx.fillStyle = colors.accent4;
      ctx.fillRect(0, 0, size[0], size[1]);

      // Here we draw the 4 quadrants by first translating to center
      // And then do additional translations inside save/restore

      ctx.save();
      ctx.translate(half[0], half[1]);

      ctx.save();
      ctx.translate(-quarter[0], -quarter[1]); // top-left
      ctx.fillStyle = colors.black;
      ctx.fillRect(0, 0, quarter[0], quarter[1]);
      ctx.restore();

      ctx.save();
      ctx.translate(0, -quarter[1]); // top-right
      ctx.fillStyle = colors.accent1;
      ctx.fillRect(0, 0, quarter[0], quarter[1]);
      ctx.restore();

      ctx.save();
      ctx.translate(-quarter[0], 0); // bottom-left
      ctx.fillStyle = colors.accent1;
      ctx.fillRect(0, 0, quarter[0], quarter[1]);
      ctx.restore();

      ctx.save(); // bottom-right (no addition translation)
      ctx.fillStyle = colors.white;
      ctx.fillRect(0, 0, quarter[0], quarter[1]);
      ctx.restore();

      // Here we scale/rotate/skew each quadrant in strokes
      // To transform around a origin, translate to it, transform, and translate back

      // scale from center of top-left quadrant
      ctx.save();
      ctx.lineWidth = 10;
      ctx.translate(-quarter[0], -quarter[1]);
      ctx.translate(quarter[0] / 2, quarter[1] / 2); // translate to center of quadrant
      ctx.scale(0.5, 0.5);
      ctx.translate(-quarter[0] / 2, -quarter[1] / 2); // and back
      ctx.strokeStyle = colors.white;
      ctx.strokeRect(0, 0, quarter[0], quarter[1]);
      ctx.restore();

      // scale from bottom-left corner of top-right quadrant
      ctx.save();
      ctx.scale(1.25, 1.25);
      ctx.translate(0, -quarter[1]);
      ctx.lineWidth = 10;
      ctx.strokeStyle = `${colors.accent3}cc`;
      ctx.strokeRect(0, 0, quarter[0], quarter[1]);
      ctx.restore();

      // rotate from center of bottom-left quadrant
      ctx.save();
      ctx.translate(-quarter[0], 0);
      ctx.translate(quarter[0] / 2, quarter[1] / 2);
      ctx.rotate(Math.PI / 6);
      ctx.translate(-quarter[0] / 2, -quarter[1] / 2);
      ctx.lineWidth = 10;
      ctx.strokeStyle = `${colors.accent3}cc`;
      ctx.strokeRect(0, 0, quarter[0], quarter[1]);
      ctx.restore();

      // skew and scale from top-left corner of bottom-right quadrant, using 2D matrix transform
      ctx.save();
      ctx.setTransform(0.75, 0.2, 0.4, 0.75, half[0], half[1]);
      ctx.lineWidth = 10;
      ctx.strokeStyle = `${colors.accent3}cc`;
      ctx.strokeRect(0, 0, quarter[0], quarter[1]);
      ctx.restore();

      // restore the first translation
      ctx.restore();

      // Need to include this at the end, for now.
      ctx.invalidate();
    }
  }, [ctx, layout]); // update only when layout or context changes

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
