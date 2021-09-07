/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as React from 'react';
import {Canvas, CanvasRenderingContext2D} from 'react-native-pytorch-core';
import {StyleSheet} from 'react-native';
import useImageFromBundle from '../utils/useImageFromBundle';

export default function Playground() {
  const [drawingContext, setDrawingContext] = React.useState<
    CanvasRenderingContext2D
  >();
  const birdImage = useImageFromBundle(
    require('../../assets/astrobird/bird.png'),
  );

  const handleContext2D = React.useCallback(
    async (ctx: CanvasRenderingContext2D) => {
      setDrawingContext(ctx);
    },
    [setDrawingContext],
  );

  React.useEffect(() => {
    const ctx = drawingContext;
    const img = birdImage;

    function drawAstroBird(
      index: number,
      x: number,
      y: number,
      degAngle: number,
    ): void {
      if (ctx != null && img != null) {
        const angle = (degAngle * Math.PI) / 180;

        const sprite = [34, 96];
        const w = sprite[0];
        const h = sprite[1] / 4;
        const dw = w;
        const dh = h;

        ctx.strokeStyle = 'lime';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, w, h);

        const tx = w / 2;
        const ty = h / 2;
        ctx.save();
        ctx.translate(tx, ty);
        ctx.rotate(angle);
        ctx.translate(-tx, -ty);
        ctx.rotate(-angle);
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.drawImage(img, 0, h * index, w, h, 0, 0, dw, dh);
        ctx.restore();
      }
    }

    if (ctx != null && img != null) {
      const step = 30;
      for (let j = 0; j <= 360 / step; j++) {
        const angle = j * step;
        for (let i = 0; i < 4; i++) {
          drawAstroBird(i, i * 50 + 10, j * 40 + 10, angle);
        }
      }

      ctx.invalidate();
    }

    return function() {
      drawingContext?.clear();
      drawingContext?.invalidate();
    };
  }, [birdImage, drawingContext]);

  return <Canvas style={styles.canvas} onContext2D={handleContext2D} />;
}

const styles = StyleSheet.create({
  canvas: {
    backgroundColor: 'orange',
    width: '100%',
    height: '100%',
  },
});
