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

export default function CanvasRotate() {
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

      // Point of transform origin
      ctx.strokeStyle = 'blue';
      ctx.lineWidth = 10;
      ctx.arc(0, 0, 10, 0, 2 * Math.PI);

      // Non-rotated rectangle
      ctx.fillStyle = 'gray';
      ctx.fillRect(100, 0, 80, 20);

      // Rotated rectangle
      ctx.rotate((45 * Math.PI) / 180);
      ctx.fillStyle = 'red';
      ctx.fillRect(100, 0, 80, 20);

      // Reset transformation matrix to the identity matrix
      ctx.setTransform(1, 0, 0, 1, 0, 0);

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
