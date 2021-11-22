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
} from 'react-native';
import type {NativeJSRef} from './NativeJSRef';

const {resolveAssetSource} = RNImage;

const {PyTorchCoreImageModule: ImageModule} = NativeModules;

export type Image = {
  getWidth(): number,
  getHeight(): number,
  scale(sx: number, sy: number): Promise<Image>,
  release(): Promise<void>,
} & NativeJSRef;

export const wrapRef = (ref: NativeJSRef): Image => ({
  ...ref,
  getWidth(): number {
    return ImageModule.getWidth(ref);
  },
  getHeight(): number {
    return ImageModule.getHeight(ref);
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

export const ImageUtil = {
  async load(url: string): Promise<Image> {
    const ref: NativeJSRef = await ImageModule.load(url);
    return wrapRef(ref);
  },
  async fromBundle(imagePath: ImageRequireSource): Promise<Image> {
    const source = getImageAssetSource(imagePath);
    const ref: NativeJSRef = await ImageModule.fromBundle(source.uri);
    return wrapRef(ref);
  },
};
