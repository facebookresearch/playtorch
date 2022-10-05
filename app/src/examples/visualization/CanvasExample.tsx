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
import useImageFromBundle from '../utils/useImageFromBundle';

// This is an example of creating an interactive composition in canvas.
// Also check out the individual canvas examples in Toolbox folder.

export default function CanvasAnimator() {
  const isFocused = useIsFocused();

  // `layout` contains canvas properties like width and height
  const [layout, setLayout] = useState<LayoutRectangle | null>(null);

  // `ctx` is drawing context to draw shapes
  const [ctx, setCtx] = useState<CanvasRenderingContext2D>();

  // handler to get drawing context when canvas is ready. See <Canvas onContext2D={...}> below
  const handleContext2D = useCallback(
    async (context: CanvasRenderingContext2D) => {
      setCtx(context);
    },
    [setCtx],
  );

  // load a local image file
  const fish = useImageFromBundle(require('../../assets/images/fish_bg.png'));

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
      animator.start((time, _frames, _frameTime) => {
        // Here we use `layout` to calculate center position
        const size = [layout?.width || 0, layout?.height || 0];
        const center = size.map(s => s / 2);

        // get the current ref
        const trail = trailRef.current;
        const bubbles = bubbleRef.current;

        if (trail != null && bubbles != null) {
          // calculate radius based on time (cycle every 3 sec)
          const t = (time % 10000) / 10000;
          const tt = t > 0.5 ? 2 - t * 2 : t * 2;
          const radius = (center[0] / 2) * tt * tt + 50;

          // clear canvas and fill background by drawing a semi-transparent rect
          ctx.clear();
          ctx.fillStyle = '#FFCAC266';
          ctx.textAlign = 'center';
          ctx.fillRect(0, 0, size[0], size[1]);

          let offsetX = 0;
          let offsetY = 0;

          if (trail.length > 0) {
            offsetX = (trail[trail.length - 1][0] - center[0]) / 20;
            offsetY = (trail[trail.length - 1][1] - center[0]) / 20;

            // draw trail
            ctx.strokeStyle = '#0066ff';
            ctx.lineWidth = 90;
            ctx.beginPath();
            ctx.moveTo(trail[0][0], trail[0][1]);
            for (let i = 1; i < trail.length; i++) {
              ctx.lineTo(trail[i][0], trail[i][1]);
            }
            ctx.stroke();

            // draw texts that shift positions based on user's touch position
            ctx.font = 'bold 14px sans-serif';
            ctx.fillStyle = '#000000';
            ctx.fillText(
              "You can't step into the same river twice",
              center[0],
              40,
            );

            ctx.fillStyle = '#00000099';
            ctx.font = 'bold 21px sans-serif';
            ctx.fillText(
              "For it isn't the same river",
              center[0] + offsetX * 2,
              center[1] + offsetY / 2,
            );

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 21px sans-serif';
            ctx.fillText(
              "and you aren't the same person",
              center[0] + offsetY * 2,
              center[1] + 30 - offsetX / 2,
            );
          } else {
            ctx.fillStyle = '#00000033';
            ctx.font = 'bold 16px sans-serif';
            ctx.fillText('Draw something to start...', center[0], 40);
          }

          // draw fish image while maintaining aspect ratio
          if (fish) {
            const aspectRatio = fish.getWidth() / fish.getHeight();
            const marginH = -100;
            const marginV =
              (size[1] - (size[0] - marginH * 2) / aspectRatio) / 2;

            ctx.drawImage(
              fish,
              marginH + offsetX + radius,
              marginV + offsetY + radius,
              size[0] - (marginH + offsetX + radius) * 2,
              size[1] - (marginV + offsetY / 4 + radius) * 2,
            );
          }

          // draw bubbles
          ctx.strokeStyle = '#00000099';
          ctx.fillStyle = '#fff';
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

        // Need to include this at the end, for now.
        ctx.invalidate();
      });
    }

    // Stop animator when exiting (unmount)
    return () => animator.stop();
  }, [animator, ctx, layout, trailRef, bubbleRef, fish]); // update only when layout or context changes

  if (!isFocused) {
    return null;
  }

  return (
    <Canvas
      style={StyleSheet.absoluteFill}
      onContext2D={handleContext2D}
      onLayout={event => {
        setLayout(event.nativeEvent.layout);
      }}
      onTouchMove={handleMove}
    />
  );
}
