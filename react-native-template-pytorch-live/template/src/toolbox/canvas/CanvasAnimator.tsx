/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {useIsFocused} from '@react-navigation/native';
import React, {useCallback, useLayoutEffect, useState, useMemo} from 'react';
import {StyleSheet, LayoutRectangle} from 'react-native';
import {Canvas, CanvasRenderingContext2D} from 'react-native-pytorch-core';
import {Animator} from '../../utils/Animator';

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

  // Instantiate an Animator. `useMemo` is used for React optimization.
  const animator = useMemo(() => new Animator(), []);

  useLayoutEffect(() => {
    if (ctx != null) {
      animator.start((time, frames, frameTime) => {
        // Here we use `layout` to calculate center position
        const size = [layout?.width || 0, layout?.height || 0];
        const center = size.map(s => s / 2);

        // clear previous canvas drawing and then redraw
        ctx.clear();

        // fill background by drawing a rect
        ctx.fillStyle = '#FFCAC2';
        ctx.fillRect(0, 0, size[0], size[1]);

        // calculate radius based on time (cycle every 3 sec)
        const t = (time % 3000) / 3000;
        const tt = t > 0.5 ? 2 - t * 2 : t * 2;
        const radius = (center[0] / 2) * tt * tt + 20;

        // draw a circle at center
        ctx.fillStyle = time > 10000 ? '#000000' : '#4f25c6';
        ctx.fillCircle(center[0], center[1], radius);
        ctx.font = '21px sans-serif';
        ctx.fillText(
          `Stopping animation in ${10 - Math.floor(time / 1000)}...`,
          20,
          40,
        );

        // stop animation after 10 sec
        if (time > 10000) {
          animator.stop();
        }

        // Need to include this at the end, for now.
        ctx.invalidate();
      });
    }
  }, [animator, ctx, layout]); // update only when layout or context changes

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
    />
  );
}
