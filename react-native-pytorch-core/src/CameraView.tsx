/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import * as React from 'react';
import {
  findNodeHandle,
  requireNativeComponent,
  UIManager,
  ViewProps,
} from 'react-native';
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
  BACK = 'back',

  /**
   * Camera facing the same direction as the device's screen.
   */
  FRONT = 'front',
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
   * Hides the flip button if set to `true`, otherwise the camera will show
   * a flip button.
   */
  hideFlipButton?: boolean;

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
  facing?: CameraFacing;

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

const nativeCameraViewName = 'PyTorchCoreCameraView';

const PyTorchCoreCameraView =
  requireNativeComponent<CameraProps>(nativeCameraViewName);

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
  private cameraRef: React.RefObject<any>;

  /** @internal */
  constructor(props: CameraProps) {
    super(props);
    this.cameraRef = React.createRef();
  }

  /**
   * The [[takePicture]] function captures an image from the camera and then
   * trigger the [[onCapture]] callback registered on the [[Camera]]
   * component.
   *
   * ```typescript
   * export default function CameraTakePicture() {
   *   const cameraRef = React.useRef<Camera>(null);
   *
   *   async function handleCapture(image: Image) {
   *     // Use captured image before releasing it.
   *     image.release();
   *   }
   *
   *   function handleTakePicture() {
   *     const camera = cameraRef.current;
   *     if (camera != null) {
   *       camera.takePicture();
   *     }
   *   }
   *
   *   return (
   *     <>
   *       <Camera
   *         ref={cameraRef}
   *         onCapture={handleCapture}
   *         hideCaptureButton={true}
   *         style={StyleSheet.absoluteFill}
   *         targetResolution={{width: 480, height: 640}}
   *         facing={CameraFacing.BACK}
   *       />
   *       <Button title="Take Picture" onPress={handleTakePicture} />
   *     </>
   *   );
   * }
   * ```
   */
  public takePicture(): void {
    if (this.cameraRef.current) {
      const takePictureCommandId =
        UIManager.getViewManagerConfig(nativeCameraViewName).Commands
          .takePicture;
      const cameraViewHandle = findNodeHandle(this.cameraRef.current);
      UIManager.dispatchViewManagerCommand(
        cameraViewHandle,
        takePictureCommandId,
        [],
      );
    }
  }

  public flip(): void {
    if (this.cameraRef.current) {
      const flipCommandId =
        UIManager.getViewManagerConfig(nativeCameraViewName).Commands.flip;
      const cameraViewHandle = findNodeHandle(this.cameraRef.current);
      UIManager.dispatchViewManagerCommand(cameraViewHandle, flipCommandId, []);
    }
  }

  private handleOnCapture = (event: any): void => {
    const {onCapture} = this.props;
    const {nativeEvent} = event;
    const {ID} = nativeEvent;
    const ref: NativeJSRef = {ID};
    const image = wrapRef(ref);
    onCapture != null && onCapture(image);
  };

  private handleOnFrame = (event: any): void => {
    const {onFrame} = this.props;
    const {nativeEvent} = event;
    const {ID} = nativeEvent;
    const ref: NativeJSRef = {ID};
    const image = wrapRef(ref);
    onFrame != null && onFrame(image);
  };

  /** @internal */
  public render(): React.ReactNode {
    const {
      facing,
      hideCaptureButton,
      hideFlipButton,
      onFrame,
      targetResolution,
      ...otherProps
    } = this.props;

    return (
      <PyTorchCoreCameraView
        {...otherProps}
        facing={facing}
        hideCaptureButton={hideCaptureButton}
        hideFlipButton={hideFlipButton}
        onCapture={this.handleOnCapture}
        onFrame={onFrame != null ? this.handleOnFrame : undefined}
        ref={this.cameraRef}
        targetResolution={targetResolution}
      />
    );
  }
}
