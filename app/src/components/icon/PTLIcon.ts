/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @oncall playtorch
 */

import {Platform} from 'react-native';
import {createIconSetFromIcoMoon} from '@expo/vector-icons';
const PTLIcon = createIconSetFromIcoMoon(
  require('./selection.json'),
  'PTLIconFont',
  'icomoon.ttf',
);

export default PTLIcon;

export const PTLIconNames = {
  BACK: Platform.OS === 'ios' ? 'iOS-Back' : 'Android-Back',
  CAMERA_FLIP: 'Camera-Flip',
  CAMERA_ROLL: 'Camera-Roll',
  CAMERA: 'Camera',
  DELETE: 'Delete',
  EXIT: 'Exit',
  INFO: 'Info',
  LINK_ARROW: 'Link-Arrow',
  MORE: 'More',
  SAVE: 'Save',
  SAVED: 'Saved',
  SETTINGS: 'Settings',
  SHARE: Platform.OS === 'ios' ? 'iOS-Share' : 'Android-Share',
};

export type PTLIconName = keyof typeof PTLIconNames;
