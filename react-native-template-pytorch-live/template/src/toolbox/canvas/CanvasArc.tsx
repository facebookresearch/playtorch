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

export default function CanvasArc() {
  const isFocused = useIsFocused();
  const [drawingContext, setDrawingContext] = useState<
    CanvasRenderingContext2D
  >();

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

      const offsetX = 20;
      let offsetY = 20;
      const radius = 10;
      const gridSize = 25;
      ctx.lineWidth = 4;

      ctx.strokeStyle = '#00ff00';
      for (let row = 0; row < 10; row++) {
        const startAngle = row * 0.5 * Math.PI;
        for (let col = 0; col < 10; col++) {
          const endAngle = col * 0.5 * Math.PI;
          ctx.arc(
            col * gridSize + offsetX,
            row * gridSize + offsetY,
            radius,
            startAngle,
            endAngle,
            false,
          );
        }
      }

      offsetY = 300;
      ctx.strokeStyle = '#ff00ff';
      for (let row = 0; row < 10; row++) {
        const startAngle = row * 0.5 * Math.PI;
        for (let col = 0; col < 10; col++) {
          const endAngle = col * 0.5 * Math.PI;
          ctx.arc(
            col * gridSize + offsetX,
            row * gridSize + offsetY,
            radius,
            startAngle,
            endAngle,
            true,
          );
        }
      }

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
