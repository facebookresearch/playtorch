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
  Text,
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
import PTLIcon, {PTLIconNames} from '../../components/icon/PTLIcon';
import Colors from '../../constants/Colors';
import {uriWithoutSchema} from '../../utils/FileUtils';
import {ObjectDetectionModels} from '../Models';
import BottomInfoPanel from '../utils/BottomInfoPanel';
import CaptureButton from '../utils/CaptureButton';
import FullScreenLoading from '../utils/FullScreenLoading';
import {useLoadModels} from '../utils/ModelProvider';
import useObjectDetection, {BoundingBox} from './utils/useObjectDetection';

type ViewState = 'CAPTURE_IMAGE' | 'PROCESSING' | 'DISPLAY_RESULTS';

const objectColors = [
  '#FF3B30',
  '#5856D6',
  '#34C759',
  '#007AFF',
  '#FF9500',
  '#AF52DE',
  '#5AC8FA',
  '#FFCC00',
  '#FF2D55',
];

export default function ObjectDetectionExample() {
  const isLoading = useLoadModels(ObjectDetectionModels);
  const isFocused = useIsFocused();
  const cameraRef = useRef<Camera>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>();
  const [layout, setLayout] = useState<LayoutRectangle>();
  const [viewState, setViewState] = useState<ViewState>('CAPTURE_IMAGE');
  const {detectObjects} = useObjectDetection(ObjectDetectionModels[0]);
  const [resultMessage, setResultMessage] = useState('');

  // This is a drawImage function wrapped in useCallback (for improving render performance)
  const drawImage = useCallback(
    (image: Image, boundingBoxes?: BoundingBox[], clear: boolean = true) => {
      // canvas context
      const ctx = contextRef.current;

      if (ctx != null && layout != null && image != null) {
        // draw image in the center of the canvas
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
        ctx.drawImage(image, offsetX, offsetY, displayWidth, displayHeight);

        // draw bounding boxes and label them, if provided
        if (boundingBoxes) {
          ctx.font = `13px monospace`;
          ctx.fillStyle = Colors.BLACK;
          ctx.textAlign = 'center';

          boundingBoxes.forEach((boundingBox, index) => {
            const {objectClass, bounds} = boundingBox;
            const x = offsetX + bounds[0] * scale;
            const y = offsetY + bounds[1] * scale;
            const w = bounds[2] * scale;
            const h = bounds[3] * scale;

            ctx.strokeStyle = objectColors[index % objectColors.length];
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.rect(x, y, w, h);
            ctx.stroke();

            const textHorizontalPadding = 20;
            const textWidth =
              objectClass.length * 5 + 2 * textHorizontalPadding;
            ctx.strokeStyle = Colors.BLACK;
            ctx.lineWidth = 25;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(x + w / 2 - textWidth / 2, y);
            ctx.lineTo(x + w / 2 + textWidth / 2, y);
            ctx.stroke();

            ctx.fillStyle = Colors.WHITE;
            ctx.fillText(objectClass, x + w / 2, y + 4);
          });
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
      // Wait for image to process through DETR model and draw resulting image
      const boundingBoxes = await detectObjects(image);
      drawImage(image, boundingBoxes);
      await ctx.invalidate();
      setResultMessage(
        `Found ${boundingBoxes.length} object${
          boundingBoxes.length === 1 ? '' : 's'
        }`,
      );
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
    setResultMessage('');
  }, [setViewState, setResultMessage]);

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
            {viewState === 'DISPLAY_RESULTS' && (
              <Text style={styles.resultMessage}>{resultMessage}</Text>
            )}
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
