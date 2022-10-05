/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {useIsFocused} from '@react-navigation/native';
import * as React from 'react';
import {useCallback, useLayoutEffect, useMemo, useRef, useState} from 'react';
import {LayoutRectangle, StyleSheet, Text, View} from 'react-native';
import {
  Canvas,
  CanvasRenderingContext2D,
  Image,
  ImageUtil,
} from 'react-native-pytorch-core';
import Header from '../../components/Header';
import Colors from '../../constants/Colors';
import {MultiClassClassificationModels} from '../Models';
import {Animator} from '../utils/Animator';
import {useLoadModels} from '../utils/ModelProvider';
import useMNIST from './utils/useMNIST';

const labels = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
];

/**
 * The React hook provides MNIST inference using the image data extracted from
 * a canvas.
 *
 * @param layout The layout for the canvas
 */
function useMNISTCanvasInference(layout: LayoutRectangle | null) {
  const isRunningInferenceRef = useRef(false);
  const {processImage, result} = useMNIST(MultiClassClassificationModels[0]);
  const classify = useCallback(
    async (ctx: CanvasRenderingContext2D, forceRun: boolean = false) => {
      // Return immediately if layout is not available or if an inference is
      // already in-flight. Ignore in-flight inference if `forceRun` is set to
      // true.
      if (layout === null || (isRunningInferenceRef.current && !forceRun)) {
        return;
      }

      // Set inference running if not force run
      if (!forceRun) {
        isRunningInferenceRef.current = true;
      }

      // Get canvas size
      const size = [layout.width, layout.height];

      // Get image data center crop
      const imageData = await ctx.getImageData(
        0,
        size[1] / 2 - size[0] / 2,
        size[0],
        size[0],
      );

      // Convert image data to image.
      const image: Image = await ImageUtil.fromImageData(imageData);

      // Release image data to free memory
      imageData.release();

      // Run MNIST inference on the image
      await processImage(image);

      // Release image to free memory
      image.release();

      // If not force run, add a little timeout to give device time to process
      // other things
      if (!forceRun) {
        setTimeout(() => {
          isRunningInferenceRef.current = false;
        }, 100);
      }
    },
    [isRunningInferenceRef, layout, processImage],
  );
  return {
    result,
    classify,
  };
}

// This is an example of creating a simple animation using Animator utility class
export default function MNISTExample() {
  const isLoading = useLoadModels(MultiClassClassificationModels);

  const isFocused = useIsFocused();

  // `layout` contains canvas properties like width and height
  const [layout, setLayout] = useState<LayoutRectangle | null>(null);

  // `ctx` is drawing context to draw shapes
  const [ctx, setCtx] = useState<CanvasRenderingContext2D>();

  const {classify, result} = useMNISTCanvasInference(layout);

  // useRef is the React way of storing mutable variable
  const drawingRef = useRef(false);
  const showingRef = useRef(false);
  const trailRef = useRef<number[][]>([]);

  // handlers for touch events
  const handleMove = useCallback(
    async event => {
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

  const handleStart = useCallback(() => {
    drawingRef.current = true;
    showingRef.current = false;
    trailRef.current = [];
  }, [drawingRef]);

  const handleEnd = useCallback(() => {
    if (ctx != null) {
      drawingRef.current = false;

      // Wait for the canvas drawing to center on screen first before classifying
      setTimeout(async () => {
        await classify(ctx, true);
        showingRef.current = true;
      }, 100);
    }
  }, [ctx, classify]);

  // Instantiate an Animator. `useMemo` is used for React optimization.
  const animator = useMemo(() => new Animator(), []);

  useLayoutEffect(() => {
    if (ctx != null) {
      animator.start(() => {
        const trail = trailRef.current;
        if (trail != null) {
          // The canvas context requires clearing after the change in
          // D38481896. Without ctx.clear(), the app will run out of memory and
          // crash
          ctx.clear();

          // Here we use `layout` to get the canvas size
          const size = [layout?.width || 0, layout?.height || 0];

          // clear previous canvas drawing and then redraw
          // fill background by drawing a rect
          ctx.fillStyle = Colors.DARK_GRAY;
          ctx.fillRect(0, 0, size[0], size[1]);

          // Draw the trail
          ctx.lineWidth = 32;
          ctx.lineJoin = 'round';
          ctx.lineCap = 'round';
          ctx.miterLimit = 1;

          if (trail.length > 0) {
            ctx.strokeStyle = Colors.WHITE;
            ctx.beginPath();
            ctx.moveTo(trail[0][0], trail[0][1]);
            for (let i = 1; i < trail.length; i++) {
              ctx.lineTo(trail[i][0], trail[i][1]);
            }
          }

          ctx.stroke();

          // Need to include this at the end, for now.
          ctx.invalidate();
        }
      });
    }

    // Stop animator when exiting (unmount)
    return () => animator.stop();
  }, [animator, ctx, drawingRef, showingRef, layout, trailRef]); // update only when layout or context changes

  if (!isFocused || isLoading) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Header level="h2" style={styles.header}>
        Write a number
      </Header>
      <View
        style={[
          styles.canvasContainer,
          result && styles.canvasContainerBorder,
        ]}>
        <Canvas
          style={styles.canvas}
          onContext2D={setCtx}
          onLayout={event => {
            setLayout(event.nativeEvent.layout);
          }}
          onTouchMove={handleMove}
          onTouchStart={handleStart}
          onTouchEnd={handleEnd}
        />
      </View>
      {result && (
        <>
          <Text style={styles.label}>
            {`It looks like ${labels[result[0].num]} (${result[0].num}).`}
          </Text>
          <Text style={styles.label}>
            {`It can be ${labels[result[1].num]} (${result[1].num}) too.`}
          </Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
  },
  canvasContainer: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 16,
    backgroundColor: Colors.DARK_GRAY,
    overflow: 'hidden',
    marginBottom: 30,
  },
  canvasContainerBorder: {
    borderWidth: 1,
    borderColor: Colors.WHITE,
  },
  canvas: {
    width: '100%',
    height: '100%',
  },
  header: {
    marginTop: 31,
    marginBottom: 24,
  },
  label: {
    fontSize: 28,
    lineHeight: 32,
    color: Colors.WHITE,
    fontWeight: '700',
  },
});
