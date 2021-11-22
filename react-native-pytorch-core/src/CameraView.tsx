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
import {requireNativeComponent, ViewStyle} from 'react-native';
import {Image, wrapRef} from './ImageModule';
import type {NativeJSRef} from './NativeJSRef';

type ViewProps = {
  hideCaptureButton?: boolean,
  onCapture?(image: Image): void,
  onFrame?(image: Image): void,
  style?: ViewStyle,
};

const PyTorchCoreCameraView = requireNativeComponent<ViewProps>(
  'PyTorchCoreCameraView',
);

export function Camera({style, onFrame, onCapture, hideCaptureButton}: ViewProps) {
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
      hideCaptureButton={hideCaptureButton}
      onCapture={handleCapture}
      onFrame={handleFrame}
      style={style}
    />
  );
}
