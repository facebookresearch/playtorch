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
import useImageFromUri from '../../utils/useImageFromUri';

export default function CanvasAnimation() {
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

  const catImage = useImageFromUri(
    'https://ichef.bbci.co.uk/news/976/cpsprodpb/12A9B/production/_111434467_gettyimages-1143489763.jpg',
  );
  const capybaraImage = useImageFromUri(
    'https://cdn.britannica.com/79/191679-050-C7114D2B/Adult-capybara.jpg',
  );

  useLayoutEffect(() => {
    const ctx = drawingContext;
    let rafHandle: any = null;
    let i = 0;
    let steps = 360;

    const fpsTime = 1000 / 60;
    let lastTime: number | null = null;
    let isRunningAnimation = true;

    async function animate(time: number) {
      if (lastTime != null) {
        if (time - lastTime < fpsTime) {
          if (isRunningAnimation) {
            rafHandle = requestAnimationFrame(animate);
          }
          return;
        }
      }
      lastTime = time;

      if (ctx != null) {
        ctx.clear();

        const step = i / steps;
        const cos = Math.cos(2 * Math.PI * step);
        const sin = Math.sin(2 * Math.PI * step);

        if (catImage != null) {
          let x5 = 100 + 600 * cos;
          let y5 = 400 + 400 * -sin;
          ctx.drawImage(catImage, x5, y5);

          let x6 = 300 + 200 * cos;
          ctx.drawImage(catImage, x6, x6, 200, 100);

          let x7 = 400 + 200 * -cos;
          let y7 = 800 + 300 * -sin;
          ctx.drawImage(catImage, 350, 130, 100, 100, x7, y7, 200, 200);
        }

        if (capybaraImage != null) {
          let x7 = 240 + 200 * -cos;
          let y7 = 1300 + 100 * sin;
          ctx.drawImage(capybaraImage, x7, y7, 500, 300);
        }

        let x1 = 500 + 200 * cos;
        let y1 = 500 + 200 * sin;
        ctx.fillStyle = '#800080';
        ctx.fillCircle(x1, y1, 50);
        ctx.fillStyle = '#000000';
        ctx.lineWidth = 10;
        ctx.drawCircle(x1, y1, 50);

        let x2 = 500 + 300 * -cos;
        let y2 = 1000 + 400 * sin;
        ctx.fillStyle = '#ff6347';
        ctx.fillCircle(x2, y2, 80);

        let x3 = 500 + 300 * cos;
        let y3 = 1200 + 400 * -sin;
        ctx.fillStyle = '#00bfff';
        ctx.fillCircle(x3, y3, 90);
        ctx.fillStyle = '#00ff00';
        ctx.lineWidth = 25;
        ctx.drawCircle(x3, y3, 90);

        let x4 = 600 + 300 * -cos;
        let y4 = 700 + 400 * -sin;
        ctx.fillStyle = '#fb0fff';
        ctx.fillRect(x4, y4, 60, 80);
        ctx.fillStyle = '#00ffff';
        ctx.lineWidth = 15;
        ctx.strokeRect(x4, y4, 60, 80);

        ctx.invalidate();

        i++;
        i %= steps;

        if (isRunningAnimation) {
          rafHandle = requestAnimationFrame(animate);
        }
      }
    }

    rafHandle = requestAnimationFrame(animate);

    return function() {
      isRunningAnimation = false;
      if (rafHandle != null) {
        cancelAnimationFrame(rafHandle);
      }
    };
  }, [drawingContext, catImage, capybaraImage]);

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
