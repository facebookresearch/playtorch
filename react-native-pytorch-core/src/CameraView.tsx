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

type CameraProps = {
  hideCaptureButton?: boolean,
  onCapture?(image: Image): void,
  onFrame?(image: Image): void,
} & ViewProps;

const PyTorchCoreCameraView = requireNativeComponent<CameraProps>(
  'PyTorchCoreCameraView',
);

export function Camera({onFrame, onCapture, hideCaptureButton, ...otherProps}: CameraProps) {
  const handleFrame = useCallback(
    (event: any) => {
      const {nativeEvent} = event;
      const {ID} = nativeEvent;
      const ref: NativeJSRef = {ID};
      const image = wrapRef(ref);
      onFrame != null && onFrame(image);
    },
    [onFrame],
  );

  const handleCapture = useCallback(
    (event: any) => {
      const {nativeEvent} = event;
      const {ID} = nativeEvent;
      const ref: NativeJSRef = {ID};
      const image = wrapRef(ref);
      onCapture != null && onCapture(image);
    },
    [onCapture],
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
