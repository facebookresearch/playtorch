/**
 * Copyright (c) Facebook, Inc. and its affiliates.
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
import {Animator} from '../../utils/Animator';
import {PTLColors as colors} from '../../components/UISettings';

// This is an example of creating a simple animation using Animator utility class
export default function CanvasAnimator() {
  const isFocused = useIsFocused();

  // `layout` contains canvas properties like width and height
  const [layout, setLayout] = useState<LayoutRectangle | null>(null);

  // `ctx` is drawing context to draw shapes
  const [ctx, setCtx] = useState<CanvasRenderingContext2D>();

  // handler to get drawing context when canvas is ready. See <Canvas onContext2D={...}> below
  const handleContext2D = useCallback(
    async (ctx: CanvasRenderingContext2D) => {
      setCtx(ctx);
    },
    [setCtx],
  );

  // useRef is the React way of storing mutable variable
  const trailRef = useRef<number[][]>([]);
  const drawingRef = useRef(false);

  // handlers for touch events
  const handleMove = useCallback(
    event => {
      const position = [
        event.nativeEvent.locationX,
        event.nativeEvent.locationY,
      ];
      const trail = trailRef.current;
      if (trail.length > 0) {
        const lastPosition: number[] = trail[trail.length - 1];
        const dx = position[0] - lastPosition[0];
        const dy = position[1] - lastPosition[1];
        // add a point to trail if distance from last point > 5
        if (dx * dx + dy * dy > 25) {
          trail.push(position);
        }
      } else {
        trail.push(position);
      }
    },
    [trailRef],
  );

  const handleStart = useCallback(event => (drawingRef.current = true), []);
  const handleEnd = useCallback(event => (drawingRef.current = false), []);

  // Instantiate an Animator. `useMemo` is used for React optimization.
  const animator = useMemo(() => new Animator(), []);

  useLayoutEffect(() => {
    if (ctx != null) {
      animator.start((time, frames, frameTime) => {
        // Here we use `layout` to calculate center position
        const trail = trailRef.current;
        if (trail != null) {
          const size = [layout?.width || 0, layout?.height || 0];

          // fill background by drawing a rect
          ctx.fillStyle = colors.accent1;
          ctx.fillRect(0, 0, size[0], size[1]);

          // Draw text when there's no drawing
          if (trail.length === 0) {
            ctx.fillStyle = colors.white;
            ctx.font = 'bold 50px sans-serif';
            ctx.fillText('Draw', 20, 230);
            ctx.fillStyle = colors.light;
            ctx.fillText('Something', 20, 285);
          }

          // Draw the trail
          ctx.strokeStyle = colors.accent3;
          ctx.lineWidth = 25;
          ctx.lineJoin = 'round';
          ctx.lineCap = 'round';
          ctx.miterLimit = 1;

          if (trail.length > 0) {
            ctx.beginPath();
            ctx.moveTo(trail[0][0], trail[0][1]);
            for (let i = 1; i < trail.length; i++) {
              ctx.lineTo(trail[i][0], trail[i][1]);
            }
          }

          ctx.stroke();

          if (!drawingRef.current || trail.length > 100) {
            if (trail.length > 0) {
              trail.shift();
            }
          }

          // Need to include this at the end, for now.
          ctx.invalidate();
        }
      });
    }

    // Stop animator when exiting (unmount)
    return () => animator.stop();
  }, [animator, ctx, layout, drawingRef, trailRef]); // update only when layout or context changes

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
      onTouchStart={handleStart}
      onTouchEnd={handleEnd}
    />
  );
}
