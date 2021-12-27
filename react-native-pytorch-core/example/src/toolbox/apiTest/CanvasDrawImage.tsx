/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {useIsFocused} from '@react-navigation/native';
import React, {useCallback, useLayoutEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {Canvas, CanvasRenderingContext2D} from 'react-native-pytorch-core';
import useImageFromURL from '../../utils/useImageFromURL';

export default function CanvasDrawImage() {
  const isFocused = useIsFocused();
  const [drawingContext, setDrawingContext] =
    useState<CanvasRenderingContext2D>();

  const flamingoImage = useImageFromURL(
    'https://ids.si.edu/ids/deliveryService?max_w=800&id=NZP-20090127-0422MM-000002',
  );
  const birdImage = useImageFromURL(
    'https://digitalmedia.fws.gov/digital/api/singleitem/image/natdiglib/6198/default.jpg',
  );

  const handleContext2D = useCallback(
    async (ctx: CanvasRenderingContext2D) => {
      setDrawingContext(ctx);
    },
    [setDrawingContext],
  );

  useLayoutEffect(() => {
    const ctx = drawingContext;
    if (ctx != null) {
      ctx.clear();

      if (flamingoImage != null) {
        ctx.drawImage(flamingoImage, 10, 10);
        ctx.drawImage(flamingoImage, 50, 50, 200, 100);
        ctx.drawImage(flamingoImage, 350, 130, 100, 100, 50, 200, 100, 100);
      }

      if (birdImage != null) {
        ctx.drawImage(birdImage, 50, 350, 300, 200);
      }

      ctx.invalidate();
    }
  }, [drawingContext, flamingoImage, birdImage]);

  if (!isFocused) {
    return null;
  }

  return (
    <Canvas style={StyleSheet.absoluteFill} onContext2D={handleContext2D} />
  );
}
