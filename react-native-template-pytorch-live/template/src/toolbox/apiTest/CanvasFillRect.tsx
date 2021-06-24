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

export default function CanvasFillRect() {
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
      ctx.setTransform(1, 0, 0, 1, 0, 0);

      ctx.fillStyle = '#8442f5';
      ctx.strokeStyle = '#e3aa39';
      ctx.lineWidth = 3;
      ctx.setTransform(1, 0.2, 0.8, 1, 0, 0);
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = '#000000';
      ctx.strokeStyle = '#000000';
      ctx.restore();
      ctx.fillRect(0, 0, 100, 100);
      ctx.strokeRect(0, 0, 100, 100);
    }
  }, [drawingContext]);

  if (!isFocused) {
    return null;
  }

  return <Canvas style={styles.canvas} onContext2D={handleContext2D} />;
}

const styles = StyleSheet.create({
  canvas: {
    width: 400,
    height: 700,
  },
});
