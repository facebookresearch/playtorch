/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @oncall playtorch
 */

import {Theme} from '@react-navigation/native';
import Colors from './Colors';

type PTLTheme = Theme & {};

export const DarkTheme: PTLTheme = {
  dark: true,
  colors: {
    primary: Colors.WHITE,
    background: Colors.ALMOST_BLACK,
    card: Colors.DARK_GRAY,
    text: Colors.WHITE,
    border: Colors.WHITE,
    notification: Colors.WHITE,
  },
};
