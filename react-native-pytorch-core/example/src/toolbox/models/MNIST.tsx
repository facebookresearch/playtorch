/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {MultiClassClassificationModels} from '../../Models';
import React, {useCallback, useEffect, useState, useRef} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {
  Canvas,
  CanvasRenderingContext2D,
  Image,
  ImageUtil,
  MobileModel,
} from 'react-native-pytorch-core';

const COLOR_CANVAS_BACKGROUND = '#4F25C6';
const COLOR_TRAIL_STROKE = '#FFFFFF';

type TrailPoint = {
  x: number;
  y: number;
};

type MNISTResult = {
  num: number;
  score: number;
};

/**
 * The React hook provides MNIST model inference on an input image.
 */
function useMNISTModel() {
  const processImage = useCallback(async (image: Image) => {
    // Runs model inference on input image
    const {
      result: {scores},
    } = await MobileModel.execute<{scores: number[]}>(
      MultiClassClassificationModels[0].model,
      {
        image,
        crop_width: 1,
        crop_height: 1,
        scale_width: 28,
        scale_height: 28,
        colorBackground: COLOR_CANVAS_BACKGROUND,
        colorForeground: COLOR_TRAIL_STROKE,
      },
    );

    // Get the score of each number (index), and sort the array by the most likely first.
    const sortedScore: MNISTResult[] = scores
      .map((score, index) => ({score: score, num: index}))
      .sort((a, b) => b.score - a.score);
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
 * @param canvasSize The size of the square canvas
 */
function useMNISTCanvasInference(canvasSize: number) {
  const [result, setResult] = useState<MNISTResult[]>();
  const isRunningInferenceRef = useRef(false);
  const {processImage} = useMNISTModel();
  const classify = useCallback(
    async (ctx: CanvasRenderingContext2D, forceRun: boolean = false) => {
      // Return immediately if canvas is size 0 or if an inference is
      // already in-flight. Ignore in-flight inference if `forceRun` is set to
      // true.
      if (canvasSize === 0 || (isRunningInferenceRef.current && !forceRun)) {
        return;
      }

      // Set inference running if not force run
      if (!forceRun) {
        isRunningInferenceRef.current = true;
      }

      // Get image data center crop
      const imageData = await ctx.getImageData(0, 0, canvasSize, canvasSize);

      // Convert image data to image.
      const image: Image = await ImageUtil.fromImageData(imageData);

      // Release image data to free memory
      imageData.release();

      // Run MNIST inference on the image
      const processedResult = await processImage(image);

      // Release image to free memory
      image.release();

      // Set result state to force re-render of component that uses this hook
      setResult(processedResult);

      // If not force run, add a little timeout to give device time to process
      // other things
      if (!forceRun) {
        setTimeout(() => {
          isRunningInferenceRef.current = false;
        }, 100);
      }
    },
    [isRunningInferenceRef, canvasSize, processImage, setResult],
  );
  return {
    result,
    classify,
  };
}

type NumberLabelSet = {
  english: string;
  chinese: string;
  asciiSymbol: string;
  spanish: string;
};

const numLabels: NumberLabelSet[] = [
  {
    english: 'zero',
    chinese: '零',
    asciiSymbol: '🄌',
    spanish: 'cero',
  },
  {
    english: 'one',
    chinese: '一',
    asciiSymbol: '➊',
    spanish: 'uno',
  },
  {
    english: 'two',
    chinese: '二',
    asciiSymbol: '➋',
    spanish: 'dos',
  },
  {
    english: 'three',
    chinese: '三',
    asciiSymbol: '➌',
    spanish: 'tres',
  },
  {
    english: 'four',
    chinese: '四',
    asciiSymbol: '➍',
    spanish: 'cuatro',
  },
  {
    english: 'five',
    chinese: '五',
    asciiSymbol: '➎',
    spanish: 'cinco',
  },
  {
    english: 'six',
    chinese: '六',
    asciiSymbol: '➏',
    spanish: 'seis',
  },
  {
    english: 'seven',
    chinese: '七',
    asciiSymbol: '➐',
    spanish: 'siete',
  },
  {
    english: 'eight',
    chinese: '八',
    asciiSymbol: '➑',
    spanish: 'ocho',
  },
  {
    english: 'nine',
    chinese: '九',
    asciiSymbol: '➒',
    spanish: 'nueve',
  },
];

// This is an example of creating a simple animation using Animator utility class
export default function MNIST() {
  const [canvasSize, setCanvasSize] = useState<number>(0);

  // `ctx` is drawing context to draw shapes
  const [ctx, setCtx] = useState<CanvasRenderingContext2D>();

  const {classify, result} = useMNISTCanvasInference(canvasSize);

  const trailRef = useRef<TrailPoint[]>([]);
  const [drawingDone, setDrawingDone] = useState(false);
  const animationHandleRef = useRef<number | null>(null);

  const draw = useCallback(() => {
    if (animationHandleRef.current != null) return;
    if (ctx != null) {
      animationHandleRef.current = requestAnimationFrame(() => {
        const trail = trailRef.current;
        if (trail != null) {
          // fill background by drawing a rect
          ctx.fillStyle = COLOR_CANVAS_BACKGROUND;
          ctx.fillRect(0, 0, canvasSize, canvasSize);

          // Draw the trail
          ctx.strokeStyle = COLOR_TRAIL_STROKE;
          ctx.lineWidth = 25;
          ctx.lineJoin = 'round';
          ctx.lineCap = 'round';
          ctx.miterLimit = 1;

          if (trail.length > 0) {
            ctx.beginPath();
            ctx.moveTo(trail[0].x, trail[0].y);
            for (let i = 1; i < trail.length; i++) {
              ctx.lineTo(trail[i].x, trail[i].y);
            }
          }
          ctx.stroke();
          // Need to include this at the end, for now.
          ctx.invalidate();
          animationHandleRef.current = null;
        }
      });
    }
  }, [animationHandleRef, canvasSize, ctx, trailRef]);

  // handlers for touch events
  const handleMove = useCallback(
    async event => {
      const position: TrailPoint = {
        x: event.nativeEvent.locationX,
        y: event.nativeEvent.locationY,
      };
      const trail = trailRef.current;
      if (trail.length > 0) {
        const lastPosition = trail[trail.length - 1];
        const dx = position.x - lastPosition.x;
        const dy = position.y - lastPosition.y;
        // add a point to trail if distance from last point > 5
        if (dx * dx + dy * dy > 25) {
          trail.push(position);
        }
      } else {
        trail.push(position);
      }
      draw();
    },
    [trailRef, draw],
  );

  const handleStart = useCallback(() => {
    setDrawingDone(false);
    trailRef.current = [];
  }, [trailRef, setDrawingDone]);

  const handleEnd = useCallback(() => {
    setDrawingDone(true);
    if (ctx != null) classify(ctx, true);
  }, [setDrawingDone, classify, ctx]);

  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <View
      style={styles.container}
      onLayout={event => {
        const {layout} = event.nativeEvent;
        setCanvasSize(Math.min(layout?.width || 0, layout?.height || 0));
      }}>
      <View style={styles.instruction}>
        <Text style={styles.label}>Write a number</Text>
        <Text style={styles.label}>
          Let's see if the AI model will get it right
        </Text>
      </View>
      <Canvas
        style={{
          height: canvasSize,
          width: canvasSize,
        }}
        onContext2D={setCtx}
        onTouchMove={handleMove}
        onTouchStart={handleStart}
        onTouchEnd={handleEnd}
      />
      {drawingDone && (
        <View style={[styles.resultView]} pointerEvents="none">
          <Text style={[styles.label, styles.secondary]}>
            {result &&
              `${numLabels[result[0].num].asciiSymbol} it looks like ${
                numLabels[result[0].num].english
              }`}
          </Text>
          <Text style={[styles.label, styles.secondary]}>
            {result &&
              `${numLabels[result[1].num].asciiSymbol} or it might be ${
                numLabels[result[1].num].english
              }`}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: '#180b3b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultView: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'flex-start',
    flexDirection: 'column',
    padding: 15,
  },
  instruction: {
    position: 'absolute',
    top: 0,
    alignSelf: 'flex-start',
    flexDirection: 'column',
    padding: 15,
  },
  label: {
    fontSize: 16,
    color: '#ffffff',
  },
  secondary: {
    color: '#ffffff99',
  },
});
