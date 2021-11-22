/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import * as React from 'react';
import {useEffect, useMemo} from 'react';
import {useCallback, useState} from 'react';
import {Text} from 'react-native';
import {Button, StyleSheet, View} from 'react-native';
import {Canvas, CanvasRenderingContext2D} from 'react-native-pytorch-core';
import AstroBirdGame from '../toolbox/canvas/AstroBirdGame';

export default function AstroBirdExample() {
  const [isTryAgainVisible, setIsTryAgainVisible] = useState<boolean>(false);
  const [
    drawingContext,
    setDrawingContext,
  ] = useState<CanvasRenderingContext2D>();

  const astroBird = useMemo(() => {
    if (drawingContext != null) {
      const game = new AstroBirdGame(drawingContext);
      game.onGameEnded(() => {
        setIsTryAgainVisible(true);
      });
      return game;
    }
    return null;
  }, [drawingContext, setIsTryAgainVisible]);

  const handleContext2D = useCallback(
    async (ctx: CanvasRenderingContext2D) => {
      setDrawingContext(ctx);
    },
    [setDrawingContext],
  );

  useEffect(() => {
    astroBird?.start();
    return function() {
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
      <Canvas style={styles.canvas} onContext2D={handleContext2D} />
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
