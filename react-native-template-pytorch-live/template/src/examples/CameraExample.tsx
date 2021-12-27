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
import {useCallback, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Camera, Image} from 'react-native-pytorch-core';
import ImageClassInfo from '../components/ImageClassInfo';
import {ImageClassificationModels} from '../Models';
import ModelSelector from '../components/ModelSelector';
import useImageModelInference from '../useImageModelInference';
import type {ModelInfo} from 'react-native-pytorch-core';
import ModelPreloader from '../components/ModelPreloader';

export default function CameraExample() {
  const isFocused = useIsFocused();
  const [activeModelInfo, setActiveModelInfo] = useState<ModelInfo>(
    ImageClassificationModels[0],
  );
  const {imageClass, metrics, processImage} =
    useImageModelInference(activeModelInfo);

  const handleFrame = useCallback(
    async (image: Image) => {
      await processImage(image);
      image.release();
    },
    [processImage],
  );

  return (
    <ModelPreloader modelInfos={ImageClassificationModels}>
      {isFocused && (
        <Camera
          hideCaptureButton={true}
          onFrame={handleFrame}
          style={styles.camera}
          targetResolution={{width: 480, height: 640}}
        />
      )}
      <ModelSelector
        style={styles.actions}
        modelInfos={ImageClassificationModels}
        defaultModelInfo={activeModelInfo}
        onSelectModelInfo={setActiveModelInfo}
      />
      <View style={styles.info}>
        <ImageClassInfo imageClass={imageClass} metrics={metrics} />
      </View>
    </ModelPreloader>
  );
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
  },
  info: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    margin: 30,
  },
  actions: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
  },
});
