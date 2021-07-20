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
import {StyleSheet, View, Text} from 'react-native';
import {ImageUtil} from 'react-native-pytorch-core';
import ImageClass from '../components/ImageClass';
import {ModelInfo, ImageClassificationModels} from '../Models';
import ModelSelector from '../components/ModelSelector';
import PredefinedImageList from '../components/PredefinedImageList';
import useImageModelInference from '../useImageModelInference';

export default function PhotosExample() {
  const [activeModelInfo, setActiveModelInfo] = useState<ModelInfo>(
    ImageClassificationModels[0],
  );
  const {imageClass, metrics, processImage} = useImageModelInference(
    activeModelInfo,
  );

  const handleImageURL = useCallback(
    (url: string) => {
      (async () => {
        const image = await ImageUtil.fromURL(url);
        processImage(image);
        setHint(false);
      })();
    },
    [processImage],
  );

  const [hint, setHint] = useState(true);

  return (
    <>
      <PredefinedImageList onSelectImage={handleImageURL} />
      <View style={styles.info}>
        <ModelSelector
          style={styles.actions}
          modelInfos={ImageClassificationModels}
          defaultModelInfo={activeModelInfo}
          onSelectModelInfo={setActiveModelInfo}
        />
        <ImageClass imageClass={imageClass} metrics={metrics} />
      </View>
      <View style={[styles.hint, {opacity: hint ? 1 : 0}]}>
        <Text style={styles.hintText}>
          Click an image to test the current model
        </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  info: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  actions: {
    flexDirection: 'row',
  },
  hint: {
    position: 'absolute',
    top: 20,
    height: 50,
    paddingHorizontal: 25,
    borderRadius: 25,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  hintText: {
    color: '#fff',
    fontSize: 14,
  },
});
