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
  media,
  Tensor,
  torch,
} from 'react-native-pytorch-core';
import {uriWithoutSchema} from '../../utils/FileUtils';
import PTLIcon, {PTLIconNames} from '../../components/icon/PTLIcon';
import Colors from '../../constants/Colors';
import {ImageSegmentationModels} from '../Models';
import BottomInfoPanel from '../utils/BottomInfoPanel';
import CaptureButton from '../utils/CaptureButton';
import FullScreenLoading from '../utils/FullScreenLoading';
import {useLoadModels} from '../utils/ModelProvider';
import ModelMetricsDisplay from './utils/ModelMetricsDisplay';
import useImageSegmentation from './utils/useImageSegmentation';

type ViewState = 'CAPTURE_IMAGE' | 'PROCESSING' | 'DISPLAY_RESULTS';

const MAX_IMAGE_EDGE_SIZE = 640;

export default function ImageSegmentationExample() {
  const isLoading = useLoadModels(ImageSegmentationModels);
  const isFocused = useIsFocused();
  const cameraRef = useRef<Camera>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>();
  const [layout, setLayout] = useState<LayoutRectangle>();
  const [viewState, setViewState] = useState<ViewState>('CAPTURE_IMAGE');
  const {metrics, processImage} = useImageSegmentation(
    ImageSegmentationModels[0],
  );

  // This is a drawImage function wrapped in useCallback (for improving render performance)
  const drawImage = useCallback(
    async (image: Image, maskTensor?: Tensor, clear: boolean = true) => {
      // canvas context
      const ctx = contextRef.current;

      if (ctx != null && layout != null && image != null) {
        if (clear) {
          ctx.clearRect(0, 0, layout.width, layout.height);
        }

        // Scale image to fit screen
        const imageWidth = image.getWidth();
        const imageHeight = image.getHeight();
        const scale = Math.max(
          layout.width / imageWidth,
          layout.height / imageHeight,
        );
        const displayWidth = imageWidth * scale;
        const displayHeight = imageHeight * scale;
        const offsetX = (layout.width - displayWidth) / 2;
        const offsetY = (layout.height - displayHeight) / 2;
        if (!maskTensor) {
          ctx.drawImage(image, offsetX, offsetY, displayWidth, displayHeight);
          await ctx.invalidate();
        } else {
          const blob = media.toBlob(image);
          let imageTensor = torch.fromBlob(blob, [imageHeight, imageWidth, 3]);
          imageTensor = imageTensor.permute([2, 0, 1]);

          const alphaMask = 0.5;
          const alphaImage = 1.0;
          const alphaOut = alphaMask + alphaImage * (1 - alphaMask);
          const a = maskTensor.mul(alphaMask);
          const b = imageTensor.mul(alphaImage * (1 - alphaMask));
          const outTensor = a.add(b).div(alphaOut).to({dtype: torch.uint8});
          const outImage = media.imageFromTensor(outTensor);
          ctx.drawImage(
            outImage,
            offsetX,
            offsetY,
            displayWidth,
            displayHeight,
          );
          await ctx.invalidate();
          await outImage.release();
        }
      }
    },
    [contextRef, layout], // dependencies for useCallback
  );

  // This handler function handles the camera's capture event
  async function handleImage(image: Image) {
    setViewState('PROCESSING');

    const ctx = contextRef.current;
    if (ctx != null && layout != null) {
      // Resizing the image to prevent long-running inference and
      // post-processing
      const width = image.getWidth();
      const height = image.getHeight();
      const scale = Math.max(
        MAX_IMAGE_EDGE_SIZE / width,
        MAX_IMAGE_EDGE_SIZE / height,
      );
      const scaledImage = await image.scale(scale, scale);
      // Wait for image to process through DeepLabv3 model and draw resulting
      // image
      const segmentationData = await processImage(scaledImage);
      await drawImage(scaledImage, segmentationData);
      await scaledImage.release();
      setViewState('DISPLAY_RESULTS');
    }
    await image.release();
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
            targetResolution={{width: 480, height: 640}}
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
