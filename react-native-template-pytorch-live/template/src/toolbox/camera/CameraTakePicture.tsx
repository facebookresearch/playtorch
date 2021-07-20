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
import {useCallback, useState} from 'react';
import {Camera, Image} from 'react-native-pytorch-core';
import ImageClass from '../../components/ImageClass';
import {ModelInfo, ImageClassificationModels} from '../../Models';
import ModelSelector from '../../components/ModelSelector';
import useImageModelInference from '../../useImageModelInference';
import {StyleSheet} from 'react-native';

export default function CameraTakePicture() {
  const isFocused = useIsFocused();
  const [activeModelInfo, setActiveModelInfo] = useState<ModelInfo>(
    ImageClassificationModels[0],
  );
  const {imageClass, metrics, processImage} = useImageModelInference(
    activeModelInfo,
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
      {isFocused && <Camera style={styles.camera} onCapture={handleCapture} />}
      <ModelSelector
        style={styles.actions}
        modelInfos={ImageClassificationModels}
        defaultModelInfo={activeModelInfo}
        onSelectModelInfo={setActiveModelInfo}
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
