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
import {StyleSheet, View} from 'react-native';
import {Camera, Image} from 'react-native-pytorch-core';
import ImageClassInfo from '../../components/ImageClassInfo';
import {ImageClassificationModels} from '../../Models';
import useImageModelInference from '../../useImageModelInference';

export default function CameraTakePicture() {
  const isFocused = useIsFocused();
  const {imageClass, metrics, processImage} = useImageModelInference(
    ImageClassificationModels[0],
  );

  const handleCapture = useCallback(
    async (image: Image) => {
      await processImage(image);
      image.release();
    },
    [processImage],
  );

  return (
    <>
      {isFocused && (
        <Camera
          onCapture={handleCapture}
          style={styles.camera}
          targetResolution={{width: 480, height: 640}}
        />
      )}
      <View style={styles.info}>
        <ImageClassInfo imageClass={imageClass} metrics={metrics} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
  },
  info: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    margin: 30,
  },
});
