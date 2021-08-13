/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as React from 'react';
import { Text } from 'react-native'
import type { ModelInfo } from 'react-native-pytorch-core'
import useImageModelInference from '../useImageModelInference'
import {Camera, Image} from 'react-native-pytorch-core'
import { StyleSheet } from 'react-native';

const modelInfo: ModelInfo = {
    name: 'MobileNet V3 Small',
    model: require('../../models/mobilenet_v3_small.pt')
}

export default function Playground() {
    const {processImage, imageClass} = useImageModelInference(modelInfo);

    async function handleImage(image: Image) {
        await processImage(image);
        image.release();
    }

  return (
    <>
    <Text style={styles.text}>{imageClass}</Text>
    <Camera onCapture={handleImage} hideCaptureButton={false} style={styles.camera}/>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
  },
  camera: {
    flex: 10,
  },
  text: {
    flex: 1,
  },
});
