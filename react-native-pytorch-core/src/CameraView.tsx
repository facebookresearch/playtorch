/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import * as React from 'react';
import {findNodeHandle, requireNativeComponent, UIManager, ViewProps} from 'react-native';
import {Image, wrapRef} from './ImageModule';
import type {NativeJSRef} from './NativeJSRef';

/**
 * Camera target resolution. It is not guaranteed that the camera runs at the
 * set target resolution, and it might pick the closest available resolution.
 *
 * {@see https://developer.android.com/reference/androidx/camera/core/ImageAnalysis.Builder#setTargetResolution(android.util.Size)}
 */
interface TargetResolution {
  /**
   * Camera resolution width in pixels.
   */
  width: number;

  /**
   * Camera resolution height in pixels.
   */
  height: number;
}

/**
 * Direction the camera faces relative to the device's screen.
 */
export enum CameraFacing {
  /**
   * Camera facing the opposite direction as the device's screen.
   */
  BACK = "back",

  /**
   * Camera facing the same direction as the device's screen.
   */
  FRONT = "front",
}

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
   * Camera target resolution. It is not guaranteed that the camera runs at the
   * set target resolution, and it might pick the closest available resolution.
   *
   * {@see https://developer.android.com/reference/androidx/camera/core/ImageAnalysis.Builder#setTargetResolution(android.util.Size)}
   */
  targetResolution?: TargetResolution;

  /**
   * Direction the camera faces relative to the device's screen.
   */
  facing?: CameraFacing,

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
  onFrame? (image: Image): void;
}

const nativeCameraViewName = 'PyTorchCoreCameraView';

const PyTorchCoreCameraView = requireNativeComponent<CameraProps>(
  nativeCameraViewName
);

/**
 * A camera component with [[CameraProps.onCapture]] and [[CameraProps.onFrame]] callbacks.
 * To programmatically trigger a capture, call the [[takePicture]] function.
 *
 * ```typescript
 * export default function App() {
 *   const {imageClass, processImage} = useImageClassification(
 *     require('./resnet18.ptl'),
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
export class Camera extends React.PureComponent<CameraProps> {
  cameraRef: React.RefObject<any>;

  constructor(props: CameraProps) {
    super(props);
    this.cameraRef = React.createRef();
  }

  takePicture() {
    if (this.cameraRef.current) {
      UIManager.dispatchViewManagerCommand(
        findNodeHandle(this.cameraRef.current),
        UIManager.getViewManagerConfig(nativeCameraViewName).Commands.takePicture.toString(),
        []
      );
    }
  }

  _handleOnCapture = (event: any) => {
    const { onCapture } = this.props;
    const { nativeEvent } = event;
    const { ID } = nativeEvent;
    const ref: NativeJSRef = { ID };
    const image = wrapRef(ref);
    onCapture != null && onCapture(image);
  };

  _handleOnFrame = (event: any) => {
    const { onFrame } = this.props;
    const { nativeEvent } = event;
    const { ID } = nativeEvent;
    const ref: NativeJSRef = { ID };
    const image = wrapRef(ref);
    onFrame != null && onFrame(image);
  };

  render() {
    const {
      facing,
      hideCaptureButton,
      onFrame,
      targetResolution,
      ...otherProps
    } = this.props;

    return (
      <PyTorchCoreCameraView
        {...otherProps}
        facing={facing}
        hideCaptureButton={hideCaptureButton}
        onCapture={this._handleOnCapture}
        onFrame={onFrame != null ? this._handleOnFrame : undefined}
        ref={this.cameraRef}
        targetResolution={targetResolution}
      />
    );
  }
}
