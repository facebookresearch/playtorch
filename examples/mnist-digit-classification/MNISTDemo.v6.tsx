/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

 import React, {useCallback, useEffect, useState, useRef} from 'react';
 import {StyleSheet, Text, View} from 'react-native';
 import {
   Canvas,
   CanvasRenderingContext2D,
   Image,
   ImageUtil,
   MobileModel,
 } from 'react-native-pytorch-core';
 import {useSafeAreaInsets} from 'react-native-safe-area-context';

 const COLOR_CANVAS_BACKGROUND = '#4F25C6';
 const COLOR_TRAIL_STROKE = '#FFFFFF';

 type TrailPoint = {
   x: number;
   y: number;
 };

 // This is the custom model you have trained. See the tutorial for more on preparing a PyTorch model for mobile.
 const mnistModel = require('../../models/mnist.ptl');

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
     } = await MobileModel.execute<{scores: number[]}>(mnistModel, {
       image,
       crop_width: 1,
       crop_height: 1,
       scale_width: 28,
       scale_height: 28,
       colorBackground: COLOR_CANVAS_BACKGROUND,
       colorForeground: COLOR_TRAIL_STROKE,
     });

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
   const {processImage} = useMNISTModel();
   const classify = useCallback(
     async (ctx: CanvasRenderingContext2D) => {
       // Return immediately if canvas is size 0
       if (canvasSize === 0) {
         return null;
       }

       // Get image data center crop
       const imageData = await ctx.getImageData(0, 0, canvasSize, canvasSize);

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
     },
     [canvasSize, processImage, setResult],
   );
   return {
     result,
     classify,
   };
 }

 type NumberLabelSet = {
   english: string;
   asciiSymbol: string;
 };

 const numLabels: NumberLabelSet[] = [
   {
     english: 'zero',
     asciiSymbol: '🄌',
   },
   {
     english: 'one',
     asciiSymbol: '➊',
   },
   {
     english: 'two',
     asciiSymbol: '➋',
   },
   {
     english: 'three',
     asciiSymbol: '➌',
   },
   {
     english: 'four',
     asciiSymbol: '➍',
   },
   {
     english: 'five',
     asciiSymbol: '➎',
   },
   {
     english: 'six',
     asciiSymbol: '➏',
   },
   {
     english: 'seven',
     asciiSymbol: '➐',
   },
   {
     english: 'eight',
     asciiSymbol: '➑',
   },
   {
     english: 'nine',
     asciiSymbol: '➒',
   },
 ];

 export default function MNISTDemo() {
   // Get safe area insets to account for notches, etc.
   const insets = useSafeAreaInsets();
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
   }, [animationHandleRef, ctx, canvasSize, trailRef]);

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
     if (ctx != null) classify(ctx);
   }, [setDrawingDone, classify, ctx]);

   useEffect(() => {
     draw();
   }, [draw]); // update only when layout or context changes

   return (
     <View
       style={styles.container}
       onLayout={event => {
         const {layout} = event.nativeEvent;
         setCanvasSize(Math.min(layout?.width || 0, layout?.height || 0));
       }}>
       <View style={[styles.instruction, {marginTop: insets.top}]}>
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
