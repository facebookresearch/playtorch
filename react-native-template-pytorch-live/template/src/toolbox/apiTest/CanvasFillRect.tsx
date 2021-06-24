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

      // ctx.scale(1, 2);
      // ctx.rect(20, 10, 150, 100);
      // ctx.rect(150, 90, 20, 20);
      // ctx.translate(25, 25);
      // ctx.rect(180, 10, 150, 100);
      // ctx.rect(310, 90, 20, 20);
      // ctx.stroke();
      // ctx.rotate((10 * Math.PI) / 180);
      // ctx.arc(58, 60, 20, 0, Math.PI, false);
      // ctx.stroke();
      // ctx.invalidate();

      // ctx.strokeRect(20, 10, 150, 100);
      // ctx.strokeRect(180, 10, 150, 100);
      // ctx.fillRect(150, 90, 20, 20);
      // ctx.fillRect(310, 90, 20, 20);
      // ctx.arc(175, 180, 100, 0, Math.PI, false);
      // ctx.stroke();

      // ctx.scale(1, 2);
      // ctx.fillRect(20, 10, 150, 100);
      // ctx.clearRect(150, 90, 20, 20);
      // ctx.translate(25, 25);
      // ctx.fillRect(180, 10, 150, 100);
      // ctx.clearRect(310, 90, 20, 20);
      // ctx.rotate((10 * Math.PI) / 180);
      // ctx.arc(175, 150, 100, 0, Math.PI, false);
      // ctx.stroke();

      ctx.setTransform(1, 0.2, 0.8, 1, 0, 0);
      ctx.fillRect(0, 0, 100, 100);

      // ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
  }, [drawingContext]);

  if (!isFocused) {
    return null;
  }

  return <Canvas style={styles.canvas} onContext2D={handleContext2D} />;
}

const styles = StyleSheet.create({
  canvas: {
    width: 200,
    height: 200,
  },
});
