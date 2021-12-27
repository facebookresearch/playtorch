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
import {StyleSheet} from 'react-native';
import {Canvas, CanvasRenderingContext2D} from 'react-native-pytorch-core';
import useImageFromURL from '../../utils/useImageFromURL';

export default function CanvasAnimation() {
  const isFocused = useIsFocused();
  const [drawingContext, setDrawingContext] =
    useState<CanvasRenderingContext2D>();

  const handleContext2D = useCallback(
    async (ctx: CanvasRenderingContext2D) => {
      setDrawingContext(ctx);
    },
    [setDrawingContext],
  );

  const catImage = useImageFromURL(
    'https://ichef.bbci.co.uk/news/976/cpsprodpb/12A9B/production/_111434467_gettyimages-1143489763.jpg',
  );
  const capybaraImage = useImageFromURL(
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
          let x5 = 40 + 240 * cos;
          let y5 = 160 + 160 * -sin;
          ctx.drawImage(catImage, x5, y5);

          let x6 = 120 + 80 * cos;
          ctx.drawImage(catImage, x6, x6, 80, 40);

          let x7 = 160 + 80 * -cos;
          let y7 = 320 + 120 * -sin;
          ctx.drawImage(catImage, 350, 130, 100, 100, x7, y7, 100, 100);
        }

        if (capybaraImage != null) {
          let x7 = 96 + 80 * -cos;
          let y7 = 520 + 40 * sin;
          ctx.drawImage(capybaraImage, x7, y7, 200, 120);
        }

        let x1 = 200 + 80 * cos;
        let y1 = 200 + 80 * sin;
        ctx.fillStyle = '#800080';
        ctx.fillCircle(x1, y1, 20);
        ctx.fillStyle = '#000000';
        ctx.lineWidth = 4;
        ctx.drawCircle(x1, y1, 20);

        let x2 = 200 + 120 * -cos;
        let y2 = 400 + 160 * sin;
        ctx.fillStyle = '#ff6347';
        ctx.fillCircle(x2, y2, 32);

        let x3 = 200 + 120 * cos;
        let y3 = 480 + 160 * -sin;
        ctx.fillStyle = '#00bfff';
        ctx.fillCircle(x3, y3, 36);
        ctx.fillStyle = '#00ff00';
        ctx.lineWidth = 10;
        ctx.drawCircle(x3, y3, 36);

        let x4 = 240 + 120 * -cos;
        let y4 = 280 + 160 * -sin;
        ctx.fillStyle = '#fb0fff';
        ctx.fillRect(x4, y4, 24, 32);
        ctx.fillStyle = '#00ffff';
        ctx.lineWidth = 6;
        ctx.strokeRect(x4, y4, 24, 32);

        ctx.invalidate();

        i++;
        i %= steps;

        if (isRunningAnimation) {
          rafHandle = requestAnimationFrame(animate);
        }
      }
    }

    rafHandle = requestAnimationFrame(animate);

    return function () {
      isRunningAnimation = false;
      if (rafHandle != null) {
        cancelAnimationFrame(rafHandle);
      }
    };
  }, [drawingContext, catImage, capybaraImage]);

  if (!isFocused) {
    return null;
  }

  return (
    <Canvas style={StyleSheet.absoluteFill} onContext2D={handleContext2D} />
  );
}
