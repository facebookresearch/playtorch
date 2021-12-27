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
import {StyleSheet, LayoutRectangle, Text, View} from 'react-native';
import {
  Canvas,
  CanvasRenderingContext2D,
  Image,
  ImageUtil,
  MobileModel,
} from 'react-native-pytorch-core';
import {Animator} from '../utils/Animator';
import {
  PTLColors as colors,
  PTLFontSizes as fontsizes,
} from '../components/UISettings';
import ModelPreloader from '../components/ModelPreloader';
import {MultiClassClassificationModels} from '../Models';

// This is the custom model you have trained. See the tutorial for more on preparing a PyTorch model for mobile.
const mnistModel = require('../../models/mnist.ptl');

/**
 * The React hook provides MNIST model inference on an input image.
 */
function useMNISTModel() {
  const processImage = useCallback(async (image: Image) => {
    // Runs model inference on input image
    const {
      result: {scores},
    } = await MobileModel.execute<{scores: number[]}>(mnistModel, {
      image,
      crop_width: 1,
      crop_height: 1,
      scale_width: 28,
      scale_height: 28,
      colorBackground: colors.light,
      colorForeground: colors.dark,
    });

    // Get the score of each number (index), and sort the array by the most likely first.
    const sortedScore: number[][] = scores
      .map((score, index) => [score, index])
      .sort((a, b) => b[0] - a[0]);
    return sortedScore;
  }, []);

  return {
    processImage,
  };
}

/**
 * The React hook provides MNIST inference using the image data extracted from
 * a canvas.
 *
 * @param layout The layout for the canvas
 */
function useMNISTCanvasInference(layout: LayoutRectangle | null) {
  const [result, setResult] = useState<number[][]>();
  const isRunningInferenceRef = useRef(false);
  const {processImage} = useMNISTModel();
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
      const result = await processImage(image);

      // Release image to free memory
      image.release();

      // Set result state to force re-render of component that uses this hook
      setResult(result);

      // If not force run, add a little timeout to give device time to process
      // other things
      if (!forceRun) {
        setTimeout(() => {
          isRunningInferenceRef.current = false;
        }, 100);
      }
    },
    [isRunningInferenceRef, layout, processImage, setResult],
  );
  return {
    result,
    classify,
  };
}

// This is an example of creating a simple animation using Animator utility class
export default function MNISTExample() {
  const isFocused = useIsFocused();

  // `layout` contains canvas properties like width and height
  const [layout, setLayout] = useState<LayoutRectangle | null>(null);

  // `ctx` is drawing context to draw shapes
  const [ctx, setCtx] = useState<CanvasRenderingContext2D>();

  const [drawing, setDrawing] = useState<number[][]>([]);

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

  const numToLabel = (num: number, choice: number = 0) => {
    const labels = [
      ['zero', '零', '🄌', 'cero'],
      ['one', '一', '➊', 'uno'],
      ['two', '二', '➋', 'dos'],
      ['three', '三', '➌', 'tres'],
      ['four', '四', '➍', 'cuatro'],
      ['five', '五', '➎', 'cinco'],
      ['six', '六', '➏', 'seis'],
      ['seven', '七', '➐', 'siete'],
      ['eight', '八', '➑', 'ocho'],
      ['nine', '九', '➒', 'nueve'],
    ];
    const index = Math.max(0, Math.min(9, num || 0));
    return labels[index][choice];
  };

  const theme = colors.accent2;

  useLayoutEffect(() => {
    if (ctx != null) {
      animator.start(() => {
        const trail = trailRef.current;
        if (trail != null) {
          // Here we use `layout` to get the canvas size
          const size = [layout?.width || 0, layout?.height || 0];

          // clear previous canvas drawing and then redraw
          // fill background by drawing a rect
          ctx.fillStyle = theme;
          ctx.fillRect(0, 0, size[0], size[1]);
          ctx.fillStyle = colors.light;
          ctx.fillRect(0, size[1] / 2 - size[0] / 2, size[0], size[0]);

          // Draw text when there's no drawing
          if (result && trail.length === 0) {
          }

          // Draw border
          ctx.strokeStyle = theme;
          const borderWidth = Math.max(0, 15 - trail.length);
          ctx.lineWidth = borderWidth;
          ctx.strokeRect(
            borderWidth / 2,
            size[1] / 2 - size[0] / 2,
            size[0] - borderWidth,
            size[0],
          );

          // Draw the trails
          ctx.lineWidth = 32;
          ctx.lineJoin = 'round';
          ctx.lineCap = 'round';
          ctx.miterLimit = 1;

          if (drawing.length > 0) {
            ctx.strokeStyle = colors.accent2;
            ctx.beginPath();
            ctx.moveTo(drawing[0][0], drawing[0][1]);
            for (let i = 1; i < drawing.length; i++) {
              ctx.lineTo(drawing[i][0], drawing[i][1]);
            }
          }

          if (trail.length > 0) {
            ctx.strokeStyle = colors.dark;
            ctx.beginPath();
            ctx.moveTo(trail[0][0], trail[0][1]);
            for (let i = 1; i < trail.length; i++) {
              ctx.lineTo(trail[i][0], trail[i][1]);
            }
          }

          ctx.stroke();

          // When the drawing is done
          if (!drawingRef.current && trail.length > 0) {
            // Before classifying, move the drawing to the center for better accuracy
            if (!showingRef.current) {
              const centroid = trail.reduce(
                (prev, curr) => [prev[0] + curr[0], prev[1] + curr[1]],
                [0, 0],
              );
              centroid[0] /= trail.length;
              centroid[1] /= trail.length;
              const offset = [
                centroid[0] - size[0] / 2,
                centroid[1] - size[1] / 2,
              ];
              if (
                Math.max(Math.abs(offset[0]), Math.abs(offset[1])) >
                size[0] / 8
              ) {
                for (let i = 0; i < trail.length; i++) {
                  trail[i][0] -= offset[0];
                  trail[i][1] -= offset[1];
                }
              }

              setDrawing(trail.slice());

              // After classifying, remove the trail with a little animation
            } else {
              // Shrink trail in a logarithmic size each animation frame
              trail.splice(0, Math.max(Math.round(Math.log(trail.length)), 1));
            }
          }

          // Need to include this at the end, for now.
          ctx.invalidate();
        }
      });
    }

    // Stop animator when exiting (unmount)
    return () => animator.stop();
  }, [
    animator,
    ctx,
    drawingRef,
    showingRef,
    layout,
    trailRef,
    result,
    drawing,
  ]); // update only when layout or context changes

  if (!isFocused) {
    return null;
  }

  return (
    <ModelPreloader modelInfos={MultiClassClassificationModels}>
      <Canvas
        style={StyleSheet.absoluteFill}
        onContext2D={setCtx}
        onLayout={event => {
          const {layout} = event.nativeEvent;
          setLayout(layout);
        }}
        onTouchMove={handleMove}
        onTouchStart={handleStart}
        onTouchEnd={handleEnd}
      />
      <View style={styles.instruction}>
        <Text style={styles.title}>Write a number</Text>
      </View>
      <View style={[styles.resultView]} pointerEvents="none">
        <Text style={[styles.label]}>
          {result
            ? `${numToLabel(result[0][1], 2)} it looks like ${numToLabel(
                result[0][1],
                0,
              )}`
            : ''}
        </Text>
        <Text style={[styles.label, styles.secondary]}>
          {result
            ? `${numToLabel(result[1][1], 2)} it can be ${numToLabel(
                result[1][1],
                0,
              )} too`
            : ''}
        </Text>
      </View>
    </ModelPreloader>
  );
}

const styles = StyleSheet.create({
  resultView: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'column',
    padding: 15,
  },
  resultHidden: {
    opacity: 0,
  },
  result: {
    fontSize: 100,
    color: '#4f25c6',
  },
  instruction: {
    alignSelf: 'flex-start',
    flexDirection: 'column',
    padding: 15,
  },
  title: {
    fontSize: fontsizes.h1,
    fontWeight: 'bold',
    color: colors.dark,
  },
  label: {
    fontSize: fontsizes.h3,
    color: colors.white,
  },
  secondary: {
    color: '#ffffff99',
  },
});
