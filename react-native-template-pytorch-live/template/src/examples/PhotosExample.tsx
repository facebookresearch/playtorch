/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import * as React from 'react';
import {useState, useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {ImageUtil} from 'react-native-pytorch-core';
import ImageClassInfo from '../components/ImageClassInfo';
import {ImageClassificationModels} from '../Models';
import ModelSelector from '../components/ModelSelector';
import PredefinedImageList from '../components/PredefinedImageList';
import useImageModelInference from '../useImageModelInference';
import type {ModelInfo} from 'react-native-pytorch-core';
import ModelPreloader from '../components/ModelPreloader';

export default function PhotosExample() {
  const [activeModelInfo, setActiveModelInfo] = useState<ModelInfo>(
    ImageClassificationModels[0],
  );
  const {imageClass, metrics, processImage} =
    useImageModelInference(activeModelInfo);

  const handleImageURL = useCallback(
    (url: string) => {
      (async () => {
        const image = await ImageUtil.fromURL(url);
        await processImage(image);
        setLastURL(url);
        setHint(false);
      })();
    },
    [processImage],
  );

  const [hint, setHint] = useState(true);
  const [lastURL, setLastURL] = useState<string>();

  return (
    <ModelPreloader modelInfos={ImageClassificationModels}>
      <View style={styles.container}>
        <PredefinedImageList onSelectImage={handleImageURL} />

        <View style={styles.actions}>
          <ModelSelector
            style={styles.actions}
            modelInfos={ImageClassificationModels}
            defaultModelInfo={activeModelInfo}
            onSelectModelInfo={model => {
              setActiveModelInfo(model);
              if (lastURL) {
                handleImageURL(lastURL);
              }
            }}
          />
        </View>
        <View style={styles.info}>
          <ImageClassInfo
            placeholder={
              hint ? 'Select an AI model and click an image to test it' : ''
            }
            numberOfLines={2}
            imageClass={imageClass}
            metrics={metrics}
          />
        </View>
      </View>
    </ModelPreloader>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
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
