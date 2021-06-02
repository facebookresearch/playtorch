/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import * as React from 'react';
import {useState, useCallback} from 'react';
import {StyleSheet} from 'react-native';
import {ImageUtil} from 'react-native-pytorch-core';
import ImageClass from '../components/ImageClass';
import {ModelInfo, Models} from '../Models';
import ModelSelector from '../components/ModelSelector';
import PredefinedImageList from '../components/PredefinedImageList';
import useImageModelInference from '../useImageModelInference';

export default function PhotosExample() {
  const [activeModelInfo, setActiveModelInfo] = useState<ModelInfo>(Models[0]);
  const {imageClass, inferenceTime, processImage} = useImageModelInference(
    activeModelInfo,
  );

  const handleImageURL = useCallback(
    (url: string) => {
      (async () => {
        const image = await ImageUtil.fromURL(url);
        processImage(image);
      })();
    },
    [processImage],
  );

  return (
    <>
      <PredefinedImageList onSelectImage={handleImageURL} />
      <ModelSelector
        style={styles.actions}
        modelInfos={Models}
        defaultModelInfo={activeModelInfo}
        onSelectModelInfo={setActiveModelInfo}
      />
      <ImageClass imageClass={imageClass} inferenceTime={inferenceTime} />
    </>
  );
}

const styles = StyleSheet.create({
  actions: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
});
