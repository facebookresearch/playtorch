/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Canvas, CanvasRenderingContext2D} from 'react-native-pytorch-core';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const COLOR_CANVAS_BACKGROUND = '#4F25C6';

export default function MNISTDemo() {
  // Get safe area insets to account for notches, etc.
  const insets = useSafeAreaInsets();
  const [canvasSize, setCanvasSize] = useState<number>(0);
  // `ctx` is drawing context to draw shapes
  const [ctx, setCtx] = useState<CanvasRenderingContext2D>();

  const draw = useCallback(() => {
    if (ctx != null) {
      // fill background by drawing a rect
      ctx.fillStyle = COLOR_CANVAS_BACKGROUND;
      ctx.fillRect(0, 0, canvasSize, canvasSize);

      ctx.invalidate();
    }
  }, [ctx, canvasSize]);

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
      <View style={[styles.instruction, {marginTop: insets.top}]}>
        <Text style={styles.label}>Write a number</Text>
        <Text style={styles.label}>Let's test the MNIST model</Text>
      </View>
      <Canvas
        style={{
          height: canvasSize,
          width: canvasSize,
        }}
        onContext2D={setCtx}
      />
      <View style={[styles.resultView]} pointerEvents="none">
        <Text style={[styles.label, styles.secondary]}>
          Highest confidence will go here
        </Text>
        <Text style={[styles.label, styles.secondary]}>
          Second highest will go here
        </Text>
      </View>
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
