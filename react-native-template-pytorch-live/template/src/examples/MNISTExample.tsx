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
  media,
  MobileModel,
  Module,
  Tensor,
  torch,
  torchvision,
} from 'react-native-pytorch-core';
import {Animator} from '../utils/Animator';
import {
  PTLColors as colors,
  PTLFontSizes as fontsizes,
} from '../components/UISettings';
import ModelPreloader from '../components/ModelPreloader';
import {MultiClassClassificationModels} from '../Models';

// Must be specified as hex to be parsed correctly.
const COLOR_CANVAS_BACKGROUND = colors.light;
const COLOR_TRAIL_STROKE = colors.accent2;

let mnistModel: Module | null = null;
async function getModel() {
  if (mnistModel != null) {
    return mnistModel;
  }
  const filePath = await MobileModel.download(
    MultiClassClassificationModels[0].model,
  );
  mnistModel = await torch.jit._loadForMobile(filePath);
  return mnistModel;
}

const HEX_RGB_RE = /^#?([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i;
function hexRgbToBytes(hexRgb: string): number[] {
  const match = HEX_RGB_RE.exec(hexRgb);
  if (!match) {
    throw `Invalid color hex string: ${hexRgb}`;
  }
  return match.slice(1).map(s => parseInt(s, 16));
}

/*
Tensor input is expected to have shape CHW and range [0, 1].

This is a vectorized version of looping over every pixel:

  d0 = colorCartesianDistance(pixelColor, backgroundColor)
  d1 = colorCartesianDistance(pixelColor, foregroundColor)
  value = d0 / (d0 + d1)

Where, for 3-channel data:

  colorCartesianDistance = function([r0, g0, b0], [r1, g1, b1]) => (
    Math.sqrt((r0 - r1) * (r0 - r1) + (g0 - g1) * (g0 - g1) + (b0 - b1) * (b0 - b1))
  );
*/
function maximizeContrast(
  tensor: Tensor,
  backgroundTensor: Tensor,
  foregroundTensor: Tensor,
): Tensor {
  const d0Diff = tensor.sub(backgroundTensor);
  const d0 = d0Diff.mul(d0Diff).sum(0, {keepdim: true}).sqrt();
  const d1Diff = tensor.sub(foregroundTensor);
  const d1 = d1Diff.mul(d1Diff).sum(0, {keepdim: true}).sqrt();
  return d0.div(d0.add(d1));
}

/**
 * The React hook provides MNIST model inference on an input image.
 */
function useMNISTModel() {
  const processImage = useCallback(async (image: Image) => {
    // Runs model inference on input image

    const blob = media.toBlob(image);
    const imageTensor = torch.fromBlob(blob, [
      image.getHeight(),
      image.getWidth(),
      3,
    ]);

    const grayscale = torchvision.transforms.grayscale();
    const resize = torchvision.transforms.resize(28);
    const normalize = torchvision.transforms.normalize([0.1307], [0.3081]);

    const bgColorGrayscale = grayscale(
      torch
        .tensor([[hexRgbToBytes(COLOR_CANVAS_BACKGROUND)]])
        .permute([2, 0, 1])
        .div(255),
    );
    const fgColorGrayscale = grayscale(
      torch
        .tensor([[hexRgbToBytes(COLOR_TRAIL_STROKE)]])
        .permute([2, 0, 1])
        .div(255),
    );

    let tensor = imageTensor.permute([2, 0, 1]).div(255);
    tensor = resize(tensor);
    tensor = grayscale(tensor);
    tensor = maximizeContrast(tensor, bgColorGrayscale, fgColorGrayscale);
    tensor = normalize(tensor);
    tensor = tensor.unsqueeze(0);
    const model = await getModel();
    const output = await model.forward<Tensor, Tensor[]>(tensor);

    const softmax = output[0].squeeze(0).softmax(-1);

    const sortedScore: number[][] = [];
    softmax
      .data()
      .forEach((score: number, index: number) =>
        sortedScore.push([score, index]),
      );

    return sortedScore.sort((a, b) => b[0] - a[0]);
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
          ctx.fillStyle = COLOR_CANVAS_BACKGROUND;
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
          ctx.strokeStyle = COLOR_TRAIL_STROKE;

          if (drawing.length > 0) {
            // ctx.strokeStyle = colors.accent2;
            ctx.beginPath();
            ctx.moveTo(drawing[0][0], drawing[0][1]);
            for (let i = 1; i < drawing.length; i++) {
              ctx.lineTo(drawing[i][0], drawing[i][1]);
            }
          }

          if (trail.length > 0) {
            // ctx.strokeStyle = colors.dark;
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
