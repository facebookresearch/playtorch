/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

/**
 * NOTE: This is not a totally reliable method. There essentially aren't any
 * totally reliable methods. So be careful using this.
 *
 * Reference: https://stackoverflow.com/questions/3514784/what-is-the-best-way-to-detect-a-mobile-device
 */

/**
 * @returns boolean if we suspect the user is using an android mobile device, or false if in SSR
 */
export function getIsLikelyAndroidDevice() {
  // Return false for SSR environment
  if (!ExecutionEnvironment.canUseDOM) {
    return false;
  }
  if (navigator == null) {
    return false;
  }
  if (/Android/i.test(navigator.userAgent)) {
    return true;
  }
  return false;
}

/**
 * @returns boolean if we suspect the user is using an ios mobile device, or false if in SSR
 */
export function getIsLikelyIOSDevice() {
  // Return false for SSR environment
  if (!ExecutionEnvironment.canUseDOM) {
    return false;
  }
  if (navigator == null) {
    return false;
  }
  if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
    return true;
  }
  return false;
}

/**
 * @returns boolean if we suspect the user is using an android/ios mobile device, or false if in SSR
 */
export function getIsLikelyAndroidOrIOSDevice() {
  return getIsLikelyAndroidDevice() || getIsLikelyIOSDevice();
}
