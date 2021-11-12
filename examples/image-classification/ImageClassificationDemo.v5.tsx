/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import * as React from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {Camera, Image, ModelInfo} from 'react-native-pytorch-core';
import useImageModelInference from '../useImageModelInference';

const modelInfo: ModelInfo = {
  name: 'MobileNet V3 Small',
  model: require('../../models/mobilenet_v3_small.ptl'),
};

export default function ImageClassificationDemo() {
  const {processImage, imageClass} = useImageModelInference(modelInfo);

  async function handleImage(image: Image) {
    await processImage(image);
    // It is important to release the image to avoid memory leaks
    image.release();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{imageClass}</Text>
      <Camera
        hideCaptureButton={true}
        style={styles.camera}
        onFrame={handleImage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    flexGrow: 1,
    padding: 20,
  },
  label: {
    marginBottom: 10,
  },
  camera: {
    flexGrow: 1,
    width: '100%',
  },
});
