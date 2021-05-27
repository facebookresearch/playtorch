/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import * as React from 'react';
import {useCallback} from 'react';
import {requireNativeComponent, ViewProps} from 'react-native';
import {Image, wrapRef} from './ImageModule';
import type {NativeJSRef} from './NativeJSRef';

/**
 * Properties for the camera.
 *
 * ```typescript
 * <Camera
 *   onFrame={(image: Image) => {
 *     image.release();
 *   }}
 *   hideCaptureButton={true}
 * />
 * ```
 */
export interface CameraProps extends ViewProps {
  /**
   * Hides the capture button if set to `true`, otherwise the camera will show
   * a capture button.
   */
  hideCaptureButton?: boolean;

  /**
   * Callback with an [[Image]] after capture button was pressed.
   *
   * @param image An [[Image]] reference.
   */
  onCapture?(image: Image): void;

  /**
   * Callback when the camera delivers an [[Image]].
   *
   * :::caution
   *
   * Needs to call [[Image.release]] to receive the next frame. The camera
   * preview will continue to render updates, but new [[Image]] frames will be
   * omitted until [[Image.release]] is called.
   *
   * :::
   *
   * @param image An [[Image]] reference.
   */
  onFrame?(image: Image): void;
}

const PyTorchCoreCameraView = requireNativeComponent<CameraProps>(
  'PyTorchCoreCameraView'
);

/**
 * A camera component with [[CameraProps.onCapture]] and [[CameraProps.onFrame]] callbacks.
 *
 * ```typescript
 * export default function App() {
 *   const {imageClass, processImage} = useImageClassification(
 *     require('./resnet18.pt'),
 *   );
 *
 *   const handleFrame = useCallback(
 *     async (image: Image) => {
 *       await processImage(image);
 *       image.release();
 *     },
 *     [processImage],
 *   );
 *
 *   return (
 *     <>
 *       <Camera
 *         style={styles.camera}
 *         onFrame={handleFrame}
 *         hideCaptureButton={true}
 *       />
 *       <Text>{imageClass}</Text>
 *     </>
 *   );
 * }
 * ```
 *
 * @component
 */
export function Camera({
  onFrame,
  onCapture,
  hideCaptureButton,
  ...otherProps
}: CameraProps) {
  const handleFrame = useCallback(
    (event: any) => {
      const { nativeEvent } = event;
      const { ID } = nativeEvent;
      const ref: NativeJSRef = { ID };
      const image = wrapRef(ref);
      onFrame != null && onFrame(image);
    },
    [onFrame]
  );

  const handleCapture = useCallback(
    (event: any) => {
      const { nativeEvent } = event;
      const { ID } = nativeEvent;
      const ref: NativeJSRef = { ID };
      const image = wrapRef(ref);
      onCapture != null && onCapture(image);
    },
    [onCapture]
  );

  return (
    <PyTorchCoreCameraView
      {...otherProps}
      hideCaptureButton={hideCaptureButton}
      onCapture={handleCapture}
      onFrame={handleFrame}
    />
  );
}
