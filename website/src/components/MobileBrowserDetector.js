/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

/**
 * NOTE: This is not a totally reliable method. There essentially aren't any
 * totally reliable methods. So be careful using this.
 *
 * Reference: https://stackoverflow.com/questions/3514784/what-is-the-best-way-to-detect-a-mobile-device
 */

/**
 * @returns boolean if we suspect the user is using an android mobile device
 */
export function getIsLikelyAndroidDevice() {
  if (/Android/i.test(navigator.userAgent)) {
    return true;
  }
  return false;
}

/**
 * @returns boolean if we suspect the user is using an ios mobile device
 */
export function getIsLikelyIOSDevice() {
  if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
    return true;
  }
  return false;
}

/**
 * @returns boolean if we suspect the user is using an android/ios mobile device
 */
export function getIsLikelyAndroidOrIOSDevice() {
  return getIsLikelyAndroidDevice() || getIsLikelyIOSDevice();
}
