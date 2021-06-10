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
import {StyleSheet, LayoutRectangle, Text, View} from 'react-native';
import {
  Canvas,
  CanvasRenderingContext2D,
  Image,
  ImageUtil,
  MobileModel,
} from 'react-native-pytorch-core';
import {Animator} from '../../utils/Animator';

const mnistModel = require('../../../models/mnist.pt');

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
      colorBackground: '#4f25c6',
      colorForeground: '#ffffff',
    });

    // Get index of max score. The max index determines the most likely number
    let maxScore = -Number.MAX_VALUE;
    let maxScoreIdx = -1;
    for (let i = 0; i < scores.length; i++) {
      if (scores[i] > maxScore) {
        maxScore = scores[i];
        maxScoreIdx = i;
      }
    }
    return maxScoreIdx;
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
  const [result, setResult] = useState('');
  const isRunningInferenceRef = useRef(false);
  const {processImage} = useMNISTModel();
  const classify = useCallback(
    async (ctx: CanvasRenderingContext2D, forceRun: boolean = false) => {
      // Return immediately if layout is not available or if an inference is
      // already in-flight. Ignore in-flight inference if `forceRun` is set to
      // true.
      if (layout === null || (isRunningInferenceRef.current && !forceRun)) {
        return null;
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
      setResult(`${result}`);

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
export default function CanvasAnimator() {
  const isFocused = useIsFocused();

  // `layout` contains canvas properties like width and height
  const [layout, setLayout] = useState<LayoutRectangle | null>(null);

  // `ctx` is drawing context to draw shapes
  const [ctx, setCtx] = useState<CanvasRenderingContext2D>();

  const {classify, result} = useMNISTCanvasInference(layout);

  const drawingRef = useRef(false);
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
          if (ctx != null) {
            classify(ctx);
          }
        }
      } else {
        trail.push(position);
      }
    },
    [trailRef, classify, ctx],
  );

  const handleStart = useCallback(() => (drawingRef.current = true), [
    drawingRef,
  ]);
  const handleEnd = useCallback(async () => {
    drawingRef.current = false;
    if (ctx != null) {
      await classify(ctx, true);
    }
  }, [drawingRef, classify]);

  // Instantiate an Animator. `useMemo` is used for React optimization.
  const animator = useMemo(() => new Animator(), []);

  useLayoutEffect(() => {
    if (ctx != null) {
      animator.start(() => {
        const trail = trailRef.current;
        if (trail != null) {
          // Here we use `layout` to get the canvas size
          const size = [layout?.width || 0, layout?.height || 0];

          // clear previous canvas drawing and then redraw
          // fill background by drawing a rect
          ctx.fillStyle = 'black';
          ctx.fillRect(0, 0, size[0], size[1]);
          ctx.fillStyle = '#4f25c6';
          ctx.fillRect(0, size[1] / 2 - size[0] / 2, size[0], size[0]);
          ctx.strokeStyle = 'white';
          const borderWidth = 4;
          ctx.lineWidth = borderWidth;
          ctx.strokeRect(
            borderWidth / 2,
            size[1] / 2 - size[0] / 2,
            size[0] - borderWidth,
            size[0],
          );

          // Draw text when there's no drawing
          if (trail.length === 0) {
            ctx.fillStyle = '#ffe9e6';
            ctx.font = 'bold 40px sans-serif';
            ctx.fillText('Draw', 20, 50);
            ctx.fillText('Something', 20, 100);
          }

          // Draw the trail
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 30;
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

          if (!drawingRef.current && trail.length > 0) {
            // Shrink trail in a logarithmic size each animation frame
            trail.splice(0, Math.max(Math.round(Math.log(trail.length)), 1));
          }

          // Need to include this at the end, for now.
          ctx.invalidate();
        }
      });
    }

    // Stop animator when exiting (unmount)
    return () => animator.stop();
  }, [animator, ctx, drawingRef, layout, trailRef]); // update only when layout or context changes

  if (!isFocused) {
    return null;
  }

  return (
    <>
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
      <View style={styles.resultView} pointerEvents="none">
        <Text style={styles.result}>{result}</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  resultView: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
  },
  result: {
    fontSize: 96,
    color: 'white',
  },
});
