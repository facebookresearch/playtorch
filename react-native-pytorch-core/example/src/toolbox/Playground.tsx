/**
 * Copyright (c) Facebook, Inc. and its affiliates.
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
import useImageModelInference from '../useImageModelInference';
import {StyleSheet, Text} from 'react-native';

export default function CameraTakePicture() {
  const isFocused = useIsFocused();
  const {imageClass, processImage} = useImageModelInference({
    model: require('../../models/mobilenet_v3_small.pt'),
    name: 'MobileNet V3',
  });

  const handleCapture = useCallback(
    async (image: Image) => {
      await processImage(image);
      image.release();
    },
    [processImage],
  );

  return (
    <>
      <Text>{imageClass}</Text>
      {isFocused && (
        <Camera
          onCapture={handleCapture}
          style={styles.camera}
          targetResolution={{width: 480, height: 640}}
        />
      )}
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
