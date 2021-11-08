/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {
  ImageRequireSource,
  Image as RNImage,
  ImageResolvedAssetSource,
  NativeModules,
  Platform,
} from 'react-native';
import type { ImageData } from './CanvasView';
import type {NativeJSRef} from './NativeJSRef';

const {resolveAssetSource} = RNImage;

const {PyTorchCoreImageModule: ImageModule} = NativeModules;

/**
 * An image is a high-level data type, which can be used for model inference
 * with [[MobileModel.execute]] or it can be drawn on a [[Canvas.drawImage]].
 *
 * An [[Image]] object in JavaScript is a reference to a native image object
 * wrapped in [[NativeJSRef]]. The image data is not transferred over the React
 * Native Bridge, but it offers functions to manipulate the image. All
 * functions are executed `async` in native.
 *
 * :::info
 *
 * Eventually, this will change with the introduction of the new React Native
 * architecture including JSI, Fabric, and TurboModules.
 *
 * :::
 */
export interface Image extends NativeJSRef {
  /**
   * Get the height of an image (in pixel).
   */
  getHeight(): number;

  /**
   * Get the width of an image (in pixel).
   */
  getWidth(): number;

  /**
   * Get the natural height of an image (in pixel).
   */
  getNaturalHeight(): number;

  /**
   * Get the natural width of an image (in pixel).
   */
  getNaturalWidth(): number;

  /**
   * Get the pixel density for this image. The `width` and `height` multiplied
   * by the `pixelDensity` is `naturalWidth` and `naturalHeight`.
   */
  getPixelDensity(): number;

  /**
   * Until explicitly released, an [[Image]] will have a reference in memory.
   * Not calling [[Image.release]] can eventually result in an
   * `OutOfMemoryException`.
   *
   * :::caution
   *
   * While this is an `async` function, it does not need to be `await`ed. For
   * example, the `GC` on Android will eventually free the allocated memory.
   *
   * :::
   */
  release(): Promise<void>;

  /**
   * The [[Image.scale]] method of the [[Image]] API adds a scaling
   * transformation horizontally and/or vertically. For instance, a scaling
   * factor of `0.5` results in a unit size of `0.5` pixels; the image is thus
   * at half the normal size. Similarly, a scaling factor of `2.0` increases
   * the unit size so that one unit becomes two pixels; images are thus at
   * twice the normal size.
   *
   * The method will apply the scaling on a copy of the [[Image]] and return
   * the scaled [[Image]] asynchronously.
   *
   * @param sx Scaling factor in the horizontal direction. A negative value flips pixels across the vertical axis. A value of `1` results in no horizontal scaling.
   * @param sy Scaling factor in the vertical direction. A negative value flips pixels across the horizontal axis. A value of `1` results in no vertical scaling.
   */
  scale(sx: number, sy: number): Promise<Image>;
}

export const wrapRef = (ref: NativeJSRef): Image => ({
  ...ref,
  getWidth(): number {
    return ImageModule.getWidth(ref);
  },
  getHeight(): number {
    return ImageModule.getHeight(ref);
  },
  getNaturalWidth(): number {
    return ImageModule.getNaturalWidth(ref);
  },
  getNaturalHeight(): number {
    return ImageModule.getNaturalHeight(ref);
  },
  getPixelDensity(): number {
    return ImageModule.getPixelDensity(ref);
  },
  async scale(sx: number, sy: number): Promise<Image> {
    const scaledRef = await ImageModule.scale(ref, sx, sy);
    return wrapRef(scaledRef);
  },
  async release(): Promise<void> {
    return await ImageModule.release(ref);
  },
});

const IMAGE_PATH_CACHE: {[key: number]: ImageResolvedAssetSource} = {};

const getImageAssetSource = (
  imagePath: ImageRequireSource,
): ImageResolvedAssetSource => {
  let source = IMAGE_PATH_CACHE[imagePath];
  if (source == null) {
    source = resolveAssetSource(imagePath);
    IMAGE_PATH_CACHE[imagePath] = source;
  }
  return source;
};

/**
 * The [[ImageUtil]] object provides functions to load an [[Image]] either from
 * a URL or load an image that is bundled with the React Native app bundle. The
 * returned Image object can the then be used to run model inference or it can
 * be drawn on a canvas.
 */
export const ImageUtil = {

  /**
   * The `fromBundle` function loads an [[Image]] that is bundled with the
   * React Native app bundle. The function param is a `require` with a relative
   * path (the path is relative to the file that contains the
   * [[ImageUtils.fromBundle]] call). Be aware that the
   * [[ImageUtils.fromBundle]] function is an `async` function and needs to be
   * `await`ed to access the loaded image.
   *
   * @param imagePath The model path (i.e., a `require`).
   */
  async fromBundle(imagePath: ImageRequireSource): Promise<Image> {
    const source = getImageAssetSource(imagePath);
    if (Platform.OS === 'ios') {
      const ref: NativeJSRef = await ImageModule.fromBundle(source)
      return wrapRef(ref)
    } else {
      const ref: NativeJSRef = await ImageModule.fromBundle(source.uri);
      return wrapRef(ref);
    }
  },

  /**
   * The `fromFile` function loads an [[Image]] at the filepath (e.g., stored
   * on the file system).
   *
   * ```typescript
   * const image: Image = await ImageUtils.fromFile('/data/0/pytorch/image.png');
   * ```
   *
   * @param path The file path to the image.
   * @returns An image instance.
   */
  async fromFile(path: string): Promise<Image> {
    const ref: NativeJSRef = await ImageModule.fromFile(path);
    return wrapRef(ref);
  },

  /**
   * Transforms an [[ImageData]] into an [[Image]] object.
   *
   * @param imageData The ImageData that will be transformed into an [[Image]].
   */
  async fromImageData(imageData: ImageData): Promise<Image> {
    // Only send NativeJSRef ID to native and omit other fields
    const imageDataRef: NativeJSRef = {ID: imageData.ID};
    const ref: NativeJSRef = await ImageModule.fromImageData(imageDataRef);
    return wrapRef(ref);
  },

  /**
   * The `fromURL` function loads an [[Image]] from a URL. Be aware that the
   * `fromURL` function is an `async` function and needs to be `await`ed to
   * access the loaded image.
   *
   * ```typescript
   * const image: Image = await ImageUtils.fromURL('https://image.url');
   * ```
   *
   * @param url The image url.
   * @returns An image instance.
   */
  async fromURL(url: string): Promise<Image> {
    const ref: NativeJSRef = await ImageModule.fromURL(url);
    return wrapRef(ref);
  },


  /**
   * Saves an image to a file.
   *
   * ```typescript
   * const path: string = ImageUtils.toFile(image);
   * ```
   *
   * @param image Image to save.
   * @returns path Path to image file.
   */
  async toFile(image: Image): Promise<string> {
    return await ImageModule.toFile(image);
  },
};
