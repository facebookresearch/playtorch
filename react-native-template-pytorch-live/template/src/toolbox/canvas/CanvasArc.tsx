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

      const offsetX = 100;
      let offsetY = 150;
      const radius = 25;
      const gridSize = 70;
      ctx.lineWidth = 8;

      ctx.strokeStyle = '#00ff00';
      for (let row = 0; row < 10; row++) {
        const startAngle = row * 0.5 * Math.PI;
        for (let col = 0; col < 10; col++) {
          const endAngle = col * 0.5 * Math.PI;
          ctx.arc(
            col * gridSize + offsetX + 60,
            row * gridSize + offsetY + 60,
            radius,
            startAngle,
            endAngle,
            false,
          );
        }
      }

      offsetY = 950;
      ctx.strokeStyle = '#ff00ff';
      for (let row = 0; row < 10; row++) {
        const startAngle = row * 0.5 * Math.PI;
        for (let col = 0; col < 10; col++) {
          const endAngle = col * 0.5 * Math.PI;
          ctx.arc(
            col * gridSize + offsetX + 60,
            row * gridSize + offsetY + 60,
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

  return <Canvas style={styles.canvas} onContext2D={handleContext2D} />;
}

const styles = StyleSheet.create({
  canvas: {
    height: 800,
    width: 600,
  },
});
