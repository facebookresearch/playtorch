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
import {useCallback, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Camera, Image, ModelInfo} from 'react-native-pytorch-core';
import {RadioOption} from '../../types/radio';
import RadioPillGroup from '../../components/RadioPillGroup';
import {ImageClassificationModels} from '../Models';
import {useLoadModels} from '../utils/ModelProvider';
import useImageClassification from './utils/useImageClassification';
import Colors from '../../constants/Colors';
import ClassLabelsDisplay from './utils/ClassLabelsDisplay';
import ModelMetricsDisplay from './utils/ModelMetricsDisplay';
import PTLIcon, {PTLIconNames} from '../../components/icon/PTLIcon';
import BottomInfoPanel from '../utils/BottomInfoPanel';

const imageClasses = require('./utils/ImageNetClasses.json');

const modelOptions: RadioOption<ModelInfo>[] = ImageClassificationModels.map(
  info => ({
    label: info.name,
    value: info,
  }),
);

export default function CameraExample() {
  const isFocused = useIsFocused();
  const isLoading = useLoadModels(ImageClassificationModels);
  const cameraRef = useRef<Camera>(null);
  const [activeModelInfo, setActiveModelInfo] = useState<ModelInfo>(
    ImageClassificationModels[0],
  );
  const {imageClass, isReady, metrics, processImage} = useImageClassification(
    activeModelInfo,
    imageClasses,
  );

  const handleFrame = useCallback(
    async (image: Image) => {
      if (isReady) {
        await processImage(image);
      }
      image.release();
    },
    [isReady, processImage],
  );

  const onPressCameraFlip = useCallback(() => {
    cameraRef.current?.flip();
  }, [cameraRef]);

  if (!isFocused || isLoading) {
    return null;
  }

  return (
    <>
      <RadioPillGroup<ModelInfo>
        style={styles.radioGroup}
        options={modelOptions}
        selected={activeModelInfo}
        onSelect={setActiveModelInfo}
        keyExtractor={modelInfo => modelInfo.name}
        listHeaderComponentStyle={styles.radioGroupEnds}
        listFooterComponentStyle={styles.radioGroupEnds}
      />
      {isFocused && (
        <Camera
          ref={cameraRef}
          hideCaptureButton={true}
          hideFlipButton={true}
          onFrame={handleFrame}
          style={styles.camera}
          targetResolution={{width: 480, height: 640}}
        />
      )}
      <BottomInfoPanel>
        <View style={styles.pane}>
          {imageClass && <ClassLabelsDisplay labels={imageClass.split(', ')} />}
        </View>
        <View style={styles.pane}>
          {metrics ? <ModelMetricsDisplay metrics={metrics!} /> : <View />}
          <PTLIcon
            name={PTLIconNames.CAMERA_FLIP}
            style={styles.flipIcon}
            onPress={onPressCameraFlip}
            size={40}
          />
        </View>
      </BottomInfoPanel>
    </>
  );
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  flipIcon: {
    color: Colors.WHITE,
  },
});
