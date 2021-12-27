/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import * as React from 'react';
import {useEffect, useMemo} from 'react';
import {useCallback, useState} from 'react';
import {LayoutRectangle, Text} from 'react-native';
import {Button, StyleSheet, View} from 'react-native';
import {Canvas, CanvasRenderingContext2D} from 'react-native-pytorch-core';
import AstroBirdGame from './AstroBirdGame';

export default function AstroBirdExample() {
  const [isTryAgainVisible, setIsTryAgainVisible] = useState<boolean>(false);
  const [layout, setLayout] = useState<LayoutRectangle | null>(null);
  const [drawingContext, setDrawingContext] =
    useState<CanvasRenderingContext2D>();

  const astroBird = useMemo(() => {
    if (drawingContext != null && layout !== null) {
      const game = new AstroBirdGame(
        drawingContext,
        layout.width,
        layout.height,
      );
      game.onGameEnded(() => {
        setIsTryAgainVisible(true);
      });
      return game;
    }
    return null;
  }, [drawingContext, layout, setIsTryAgainVisible]);

  const handleContext2D = useCallback(
    async (ctx: CanvasRenderingContext2D) => {
      setDrawingContext(ctx);
    },
    [setDrawingContext],
  );

  useEffect(() => {
    astroBird?.start();
    return function () {
      astroBird?.stop();
      astroBird?.destroy();
    };
  }, [astroBird]);

  const handleStart = useCallback(() => {
    setIsTryAgainVisible(false);
    astroBird?.start();
  }, [astroBird, setIsTryAgainVisible]);

  const handleTouch = useCallback(() => {
    astroBird?.tap();
  }, [astroBird]);

  return (
    <View style={styles.container} onTouchStart={handleTouch}>
      <Canvas
        style={styles.canvas}
        onContext2D={handleContext2D}
        onLayout={event => {
          const {layout} = event.nativeEvent;
          setLayout(layout);
        }}
      />
      {isTryAgainVisible && (
        <View style={styles.tryAgain}>
          <Text style={styles.tryAgainText}>Nice job! Want to try again?</Text>
          <Button title="Let's go!" onPress={handleStart} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  canvas: {
    flex: 1,
    overflow: 'hidden',
  },
  tryAgain: {
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    padding: 20,
    borderRadius: 5,
    position: 'absolute',
    alignSelf: 'center',
    top: 180,
  },
  tryAgainText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
