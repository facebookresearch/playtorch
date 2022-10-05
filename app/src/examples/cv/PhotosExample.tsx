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
import {ImageUtil, ModelInfo} from 'react-native-pytorch-core';
import RadioPillGroup from '../../components/RadioPillGroup';
import {RadioOption} from '../../types/radio';
import {ImageClassificationModels} from '../Models';
import BottomInfoPanel, {BottomInfoPanelHeight} from '../utils/BottomInfoPanel';
import {useLoadModels} from '../utils/ModelProvider';
import ClassLabelsDisplay from './utils/ClassLabelsDisplay';
import ModelMetricsDisplay from './utils/ModelMetricsDisplay';
import PredefinedImageList from './utils/PredefinedImageList';
import useImageClassification from './utils/useImageClassification';

const imageClasses = require('./utils/ImageNetClasses.json');

const modelOptions: RadioOption<ModelInfo>[] = ImageClassificationModels.map(
  info => ({
    label: info.name,
    value: info,
  }),
);

export default function PhotosExample() {
  const isLoading = useLoadModels(ImageClassificationModels);
  const isFocused = useIsFocused();

  const [activeModelInfo, setActiveModelInfo] = useState<ModelInfo>(
    ImageClassificationModels[0],
  );
  const {imageClass, isReady, metrics, processImage} = useImageClassification(
    activeModelInfo,
    imageClasses,
  );

  const handleImageURL = useCallback(
    async (bundledImage: number) => {
      if (isReady) {
        const image = await ImageUtil.fromBundle(bundledImage);
        await processImage(image);
        await image.release();
      }
    },
    [isReady, processImage],
  );

  const showBottomInfoPanel = imageClass != null && metrics != null;

  if (!isFocused || isLoading) {
    return null;
  }

  return (
    <View style={styles.container}>
      <RadioPillGroup<ModelInfo>
        style={styles.radioGroup}
        options={modelOptions}
        selected={activeModelInfo}
        onSelect={setActiveModelInfo}
        keyExtractor={modelInfo => modelInfo.name}
        listHeaderComponentStyle={styles.radioGroupEnds}
        listFooterComponentStyle={styles.radioGroupEnds}
      />
      <PredefinedImageList
        showHint={true}
        onSelectImage={handleImageURL}
        listFooterHeight={showBottomInfoPanel ? BottomInfoPanelHeight : 0}
      />
      {showBottomInfoPanel && (
        <BottomInfoPanel style={styles.info}>
          <View style={styles.pane}>
            <ClassLabelsDisplay labels={imageClass!.split(', ')} />
          </View>
          <View style={styles.pane}>
            <ModelMetricsDisplay metrics={metrics!} />
          </View>
        </BottomInfoPanel>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  info: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  radioGroup: {
    width: '100%',
    paddingBottom: 16,
  },
  radioGroupEnds: {
    width: 24,
  },
  pane: {
    flex: 1,
    height: '100%',
  },
});
