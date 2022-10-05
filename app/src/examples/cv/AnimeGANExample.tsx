/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {useIsFocused} from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as React from 'react';
import {useCallback, useRef, useState} from 'react';
import {
  LayoutRectangle,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Camera,
  Canvas,
  CanvasRenderingContext2D,
  Image,
  ImageUtil,
} from 'react-native-pytorch-core';
import {uriWithoutSchema} from '../../utils/FileUtils';
import PTLIcon, {PTLIconNames} from '../../components/icon/PTLIcon';
import Colors from '../../constants/Colors';
import {ImageGenerationModels} from '../Models';
import BottomInfoPanel from '../utils/BottomInfoPanel';
import CaptureButton from '../utils/CaptureButton';
import FullScreenLoading from '../utils/FullScreenLoading';
import {useLoadModels} from '../utils/ModelProvider';
import ModelMetricsDisplay from './utils/ModelMetricsDisplay';
import useAnimeGANv2 from './utils/useAnimeGANv2';

type ViewState = 'CAPTURE_IMAGE' | 'PROCESSING' | 'DISPLAY_RESULTS';

export default function AnimeGANExample() {
  const isLoading = useLoadModels(ImageGenerationModels);
  const isFocused = useIsFocused();
  const cameraRef = useRef<Camera>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>();
  const [layout, setLayout] = useState<LayoutRectangle>();
  const [viewState, setViewState] = useState<ViewState>('CAPTURE_IMAGE');
  const {metrics, processImage} = useAnimeGANv2(ImageGenerationModels[0]);

  // This handler function handles the camera's capture event
  async function handleImage(image: Image) {
    setViewState('PROCESSING');

    // Wait for image to process
    const animeImage = await processImage(image);

    const ctx = contextRef.current;
    if (ctx != null && layout != null) {
      ctx.clearRect(0, 0, layout.width, layout.height);
      ctx.fillStyle = Colors.BLACK;
      ctx.fillRect(0, 0, layout.width, layout.height);

      const imageWidth = animeImage.getWidth();
      const imageHeight = animeImage.getHeight();
      const scale = Math.min(
        layout.width / imageWidth,
        layout.height / imageHeight,
      );
      const scaledWidth = imageWidth * scale;
      const scaleHeight = imageHeight * scale;
      ctx.drawImage(
        animeImage,
        Math.floor((layout.width - scaledWidth) / 2),
        Math.floor((layout.height - scaleHeight) / 2),
        scaledWidth,
        scaleHeight,
      );

      await ctx.invalidate();

      setViewState('DISPLAY_RESULTS');
    }

    await image.release();
    await animeImage.release();
  }

  async function handlePickImage() {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.cancelled) {
      setViewState('PROCESSING');
      const image = await ImageUtil.fromFile(uriWithoutSchema(result.uri));
      await handleImage(image);
    }
  }

  const captureImage = useCallback(() => {
    cameraRef.current?.takePicture();
  }, [cameraRef]);

  const onPressCameraFlip = useCallback(() => {
    cameraRef.current?.flip();
  }, [cameraRef]);

  // Handle the reset button and return to the camera capturing mode
  const handleReset = useCallback(() => {
    setViewState('CAPTURE_IMAGE');
  }, [setViewState]);

  // Don't run this example when it's not actively in view in the navigation
  if (!isFocused || isLoading) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <Canvas
          style={styles.canvas}
          onLayout={event => {
            setLayout(event.nativeEvent.layout);
          }}
          onContext2D={ctx => (contextRef.current = ctx)}
        />
        {viewState === 'CAPTURE_IMAGE' && (
          <Camera
            ref={cameraRef}
            style={styles.camera}
            onCapture={handleImage}
            hideCaptureButton={true}
            hideFlipButton={true}
            targetResolution={{width: 1080, height: 1920}}
          />
        )}
      </View>

      <BottomInfoPanel style={styles.bottomInfoPanel}>
        <View style={styles.bottomInfoRow}>
          <View style={styles.infoSideContainerLeft}>
            {viewState === 'CAPTURE_IMAGE' && (
              <PTLIcon
                name={PTLIconNames.CAMERA_ROLL}
                size={40}
                style={styles.cameraIcon}
                onPress={handlePickImage}
              />
            )}
          </View>
          <View style={styles.infoButtonContainer}>
            {viewState === 'CAPTURE_IMAGE' ? (
              <CaptureButton onPress={captureImage} />
            ) : (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleReset}
                style={styles.resetButton}>
                <PTLIcon
                  name={PTLIconNames.CAMERA}
                  size={36}
                  style={styles.cameraIcon}
                />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.infoSideContainerRight}>
            {viewState === 'CAPTURE_IMAGE' && (
              <PTLIcon
                name={PTLIconNames.CAMERA_FLIP}
                size={40}
                style={styles.cameraIcon}
                onPress={onPressCameraFlip}
              />
            )}
            {viewState === 'DISPLAY_RESULTS' && metrics && (
              <ModelMetricsDisplay metrics={metrics!} />
            )}
          </View>
        </View>
      </BottomInfoPanel>
      {viewState === 'PROCESSING' && (
        <FullScreenLoading style={StyleSheet.absoluteFill} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  canvas: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  bottomInfoPanel: {
    paddingTop: 24,
  },
  bottomInfoRow: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    flexGrow: 0,
    alignItems: 'center',
    width: '100%',
  },
  infoButtonContainer: {
    flexGrow: 0,
  },
  infoSideContainerLeft: {
    flexGrow: 1,
    flexBasis: 0,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  infoSideContainerRight: {
    flexGrow: 1,
    flexBasis: 0,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  resultMessage: {
    color: Colors.WHITE,
    fontSize: 11,
    lineHeight: 16,
    width: '100%',
  },
  resetButton: {
    color: Colors.WHITE,
    backgroundColor: Colors.MEDIUM_GRAY,
    height: 64,
    width: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    color: Colors.WHITE,
  },
});
