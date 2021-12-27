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
import {LayoutRectangle, StyleSheet} from 'react-native';
import {Canvas, CanvasRenderingContext2D} from 'react-native-pytorch-core';

export default function CanvasTextAlign() {
  const isFocused = useIsFocused();
  const [drawingContext, setDrawingContext] =
    useState<CanvasRenderingContext2D>();
  const [layout, setLayout] = useState<LayoutRectangle>();

  const handleContext2D = useCallback(
    async (ctx: CanvasRenderingContext2D) => {
      setDrawingContext(ctx);
    },
    [setDrawingContext],
  );

  useLayoutEffect(() => {
    const ctx = drawingContext;
    if (ctx != null && layout != null) {
      ctx.clear();

      const x = layout.width / 2;

      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 350);
      ctx.stroke();

      ctx.font = '30px serif';

      ctx.textAlign = 'left';
      ctx.fillText('left-aligned', x, 40);

      ctx.textAlign = 'center';
      ctx.fillText('center-aligned', x, 85);

      ctx.textAlign = 'right';
      ctx.fillText('right-aligned', x, 130);

      ctx.invalidate();
    }
  }, [drawingContext, layout]);

  if (!isFocused) {
    return null;
  }

  return (
    <Canvas
      style={StyleSheet.absoluteFill}
      onContext2D={handleContext2D}
      onLayout={event => {
        setLayout(event.nativeEvent.layout);
      }}
    />
  );
}
