import React, {useCallback, useEffect, useState, useRef} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Canvas, CanvasRenderingContext2D} from 'react-native-pytorch-core';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const COLOR_CANVAS_BACKGROUND = '#4F25C6';
const COLOR_TRAIL_STROKE = '#FFFFFF';

type TrailPoint = {
  x: number;
  y: number;
};

export default function MNISTDemo() {
  // Get safe area insets to account for notches, etc.
  const insets = useSafeAreaInsets();
  const [canvasSize, setCanvasSize] = useState<number>(0);

  // `ctx` is drawing context to draw shapes
  const [ctx, setCtx] = useState<CanvasRenderingContext2D>();

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
  }, [setDrawingDone]);

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
            Highest confidence will go here
          </Text>
          <Text style={[styles.label, styles.secondary]}>
            Second highest will go here
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
