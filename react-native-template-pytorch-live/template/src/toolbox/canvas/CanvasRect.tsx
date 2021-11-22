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

export default function CanvasRect() {
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

      ctx.fillStyle = '#00bfff';
      ctx.fillCircle(200, 200, 90);
      ctx.fillStyle = '#00ff00';
      ctx.lineWidth = 25;
      ctx.drawCircle(200, 200, 90);

      ctx.fillStyle = '#fb0fff';
      ctx.fillRect(100, 400, 160, 180);
      ctx.fillStyle = '#00ffff';
      ctx.lineWidth = 15;
      ctx.strokeRect(100, 400, 160, 180);

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
