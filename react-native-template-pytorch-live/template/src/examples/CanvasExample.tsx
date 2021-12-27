/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {useIsFocused} from '@react-navigation/native';
import React, {
  useCallback,
  useLayoutEffect,
  useState,
  useMemo,
  useRef,
} from 'react';
import {StyleSheet, LayoutRectangle} from 'react-native';
import {Canvas, CanvasRenderingContext2D} from 'react-native-pytorch-core';
import {Animator} from '../utils/Animator';
import {Image, ImageUtil} from 'react-native-pytorch-core';
import {
  PTLColors as colors,
  PTLFontSizes as fontsizes,
} from '../components/UISettings';

// This is an example of creating an interactive composition in canvas.
// Also check out the individual canvas examples in Toolbox folder.

export default function CanvasAnimator() {
  const isFocused = useIsFocused();

  // `layout` contains canvas properties like width and height
  const [layout, setLayout] = useState<LayoutRectangle | null>(null);

  // `ctx` is drawing context to draw shapes
  const [ctx, setCtx] = useState<CanvasRenderingContext2D>();

  const [letterP, setLetterP] = useState<Image>();
  const [letterT, setLetterT] = useState<Image>();
  const [letterL, setLetterL] = useState<Image>();

  // handler to get drawing context when canvas is ready. See <Canvas onContext2D={...}> below
  const handleContext2D = useCallback(
    async (ctx: CanvasRenderingContext2D) => {
      setCtx(ctx);
    },
    [setCtx],
  );

  useLayoutEffect(() => {
    (async () => {
      const imgP = await ImageUtil.fromBundle(
        require('../../assets/images/letter_p.png'),
      );
      setLetterP(imgP);

      const imgT = await ImageUtil.fromBundle(
        require('../../assets/images/letter_t.png'),
      );
      setLetterT(imgT);

      const imgL = await ImageUtil.fromBundle(
        require('../../assets/images/letter_l.png'),
      );
      setLetterL(imgL);
    })();
  }, []);

  // Instantiate an Animator. `useMemo` is used for React optimization.
  const animator = useMemo(() => new Animator(), []);

  // 'refs' let us store mutable variables in React that are not part of the app states
  const trailRef = useRef<number[][]>([]);
  const bubbleRef = useRef<number[][]>([]);

  // handlers for touch events
  const handleMove = useCallback(
    event => {
      const position = [
        event.nativeEvent.locationX,
        event.nativeEvent.locationY,
      ];

      // Based on the current touch position, add a trail point and a bubble
      const trail = trailRef.current;
      const bubbles = bubbleRef.current;

      if (trail.length > 0) {
        const lastPosition: number[] = trail[trail.length - 1];
        const dx = position[0] - lastPosition[0];
        const dy = position[1] - lastPosition[1];

        // add trail point and bubble if distance from last point > 5
        if (dx * dx + dy * dy > 25) {
          trail.push(position.slice());
          if (bubbles.length < 25) {
            bubbles.push(position.slice());
          }
        }
        if (trail.length > 80) {
          trail.shift();
        }
      } else {
        trail.push(position);
      }
    },
    [trailRef, bubbleRef],
  );

  useLayoutEffect(() => {
    if (ctx != null) {
      animator.start((time, frames, frameTime) => {
        // Here we use `layout` to calculate center position
        const size = [layout?.width || 0, layout?.height || 0];
        const center = size.map(s => s / 2);

        // calculate radius based on time (cycle every 3 sec)
        const t = (time % 10000) / 10000;
        const tt = t > 0.5 ? 2 - t * 2 : t * 2;
        const radius = (center[0] / 2) * tt * tt + 50;
        const radiusReverse = 100 + center[0] / 2 - radius;

        const aspectRatio = 1;
        const marginH = -100;
        const marginV = (size[1] - (size[0] - marginH * 2) / aspectRatio) / 2;

        // fill background by drawing a semi-transparent rect, instead of using ctx.clear() to clear canvas
        // this will create a kind of "motion blur" effect on canvas
        ctx.fillStyle = colors.light;
        ctx.textAlign = 'center';
        ctx.fillRect(0, 0, size[0], size[1]);

        // Draw letter image
        if (letterP != null) {
          ctx.drawImage(
            letterP,
            -200 + radius,
            marginV + radius - 100,
            size[0] - (marginH + radius) * 2,
            size[1] - (marginV + radius) * 2,
          );
        }

        if (letterT != null) {
          ctx.drawImage(
            letterT,
            radiusReverse - 120,
            marginV + radiusReverse + 150,
            size[0] - (marginH + radiusReverse) * 2,
            size[1] - (marginV + radiusReverse) * 2,
          );
        }

        // get the current ref
        const trail = trailRef.current;
        const bubbles = bubbleRef.current;

        if (trail != null && bubbles != null) {
          let offsetX = 0;
          let offsetY = 0;

          if (trail.length > 0) {
            offsetX = (trail[trail.length - 1][0] - center[0]) / 20;
            offsetY = (trail[trail.length - 1][1] - center[0]) / 20;

            // draw trail
            ctx.strokeStyle = colors[`accent${Math.ceil(t * 4)}`];
            ctx.lineWidth = 90;
            ctx.beginPath();
            ctx.moveTo(trail[0][0], trail[0][1]);
            for (let i = 1; i < trail.length; i++) {
              ctx.lineTo(trail[i][0], trail[i][1]);
            }
            ctx.stroke();

            // draw texts that shift positions based on user's touch position
            ctx.fillStyle = colors.neutralBlack;
            ctx.font = `bold ${fontsizes.h3}px sans-serif`;
            ctx.fillText(
              'Share, discover and use AI models.',
              center[0] + offsetX * 2,
              center[1] + offsetY / 2,
            );

            ctx.fillStyle = colors.white;
            ctx.font = `bold ${fontsizes.h2}px sans-serif`;
            ctx.fillText(
              'Unlock the vast potential of AI innovations.',
              center[0] + offsetY * 10,
              center[1] + 30 - offsetX / 2,
            );
          } else {
            ctx.fillStyle = '#00000033';
            ctx.font = 'bold 16px sans-serif';
            ctx.fillText('Draw something to start...', center[0], 40);
          }

          // draw bubbles
          ctx.strokeStyle = '#00000099';
          ctx.fillStyle = colors.white;
          ctx.lineWidth = 2;
          const twoPI = 2 * Math.PI;

          for (let i = 0; i < bubbles.length; i++) {
            ctx.beginPath();
            bubbles[i][1] -= (i % 2) + 2;
            bubbles[i][0] += Math.random() * 2 - Math.random() * 2;
            ctx.arc(bubbles[i][0], bubbles[i][1], 3 + (i % 5), 0, twoPI);
            ctx.stroke();
            ctx.fill();

            if (bubbles[i][1] < 0) {
              bubbles.splice(i, 1);
            }
          }
        }

        if (letterL != null) {
          ctx.drawImage(
            letterL,
            radius + 50,
            marginV + radius,
            size[0] - (marginH + radius) * 2,
            size[1] - (marginV + radius) * 2,
          );
        }

        // Need to include this at the end, for now.
        ctx.invalidate();
      });
    }

    // Stop animator when exiting (unmount)
    return () => animator.stop();
  }, [animator, ctx, layout, trailRef, bubbleRef, letterP, letterT, letterL]); // update only when layout or context changes

  if (!isFocused) {
    return null;
  }

  return (
    <Canvas
      style={StyleSheet.absoluteFill}
      onContext2D={handleContext2D}
      onLayout={event => {
        const {layout} = event.nativeEvent;
        setLayout(layout);
      }}
      onTouchMove={handleMove}
    />
  );
}
