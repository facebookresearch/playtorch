/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {useIsFocused} from '@react-navigation/native';
import * as React from 'react';
import {useCallback} from 'react';
import {Camera, Image} from 'react-native-pytorch-core';
import useImageModelInference from '../../useImageModelInference';
import {StyleSheet} from 'react-native';
import ImageClass from '../../components/ImageClass';
import {ImageClassificationModels} from '../../Models';

export default function MobileNetV3() {
  const isFocused = useIsFocused();
  const {imageClass, metrics, processImage} = useImageModelInference(
    ImageClassificationModels[2],
  );

  const handleCapture = useCallback(
    async (image: Image) => {
      await processImage(image);
      image.release();
    },
    [processImage],
  );

  if (!isFocused) {
    return null;
  }

  return (
    <>
      <Camera
        onFrame={handleCapture}
        style={styles.camera}
        targetResolution={{width: 480, height: 640}}
      />
      <ImageClass imageClass={imageClass} metrics={metrics} />
    </>
  );
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
  },
  actions: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
});
