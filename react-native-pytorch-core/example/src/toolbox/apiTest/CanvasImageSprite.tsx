/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import * as React from 'react';
import type {CanvasRenderingContext2D} from 'react-native-pytorch-core';
import {Canvas} from 'react-native-pytorch-core';
import {StyleSheet} from 'react-native';
import useImageFromBundle from '../../utils/useImageFromBundle';

export default function CanvasImageSprite() {
  const [ctx, setCtx] = React.useState<CanvasRenderingContext2D>();
  const image = useImageFromBundle(
    require('../../../assets/astrobird/bird.png'),
  );

  const drawImage = React.useCallback(
    (index: number, x: number, y: number, degAngle: number): void => {
      if (ctx != null && image != null) {
        const angle = (degAngle * Math.PI) / 180;

        const sprite = [image.getWidth(), image.getHeight()];
        const w = sprite[0];
        const h = sprite[1] / 4;
        const dw = w;
        const dh = h;

        // Draw expected target box for img
        ctx.strokeStyle = 'lime';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, w, h);

        // Draw image with rotation and translation
        const tx = w / 2;
        const ty = h / 2;
        ctx.save();
        ctx.translate(tx, ty);
        ctx.rotate(angle);
        ctx.translate(-tx, -ty);
        ctx.rotate(-angle);
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.drawImage(image, 0, h * index, w, h, 0, 0, dw, dh);
        ctx.restore();
      }
    },
    [image, ctx],
  );

  React.useEffect(() => {
    if (ctx != null && image != null) {
      const step = 30;
      for (let j = 0; j <= 360 / step; j++) {
        const angle = j * step;
        for (let i = 0; i < 4; i++) {
          drawImage(i, i * 50 + 10, j * 40 + 10, angle);
        }
      }

      ctx.invalidate();
    }

    return function () {
      ctx?.clear();
      ctx?.invalidate();
    };
  }, [drawImage, image, ctx]);

  return <Canvas style={StyleSheet.absoluteFill} onContext2D={setCtx} />;
}
