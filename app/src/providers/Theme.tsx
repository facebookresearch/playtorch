/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import React, {PropsWithChildren} from 'react';
import {StyleSheet} from 'react-native';
import {DefaultTheme, Provider} from 'react-native-paper';
import Colors from '../constants/Colors';

type Props = PropsWithChildren<{}>;

export function ThemeProvider({children}: Props) {
  return <Provider theme={DefaultTheme}>{children}</Provider>;
}

const styles = StyleSheet.create({
  layoutStyle: {
    flex: 1,
    backgroundColor: Colors.ALMOST_BLACK,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconStyle: {
    fontSize: 64,
    margin: 16,
  },
  paragraphStyle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  captionStyle: {
    fontSize: 16,
    lineHeight: 24,
  },
  emStyle: {
    textDecorationLine: 'underline',
  },
  linkStyle: {
    color: '#4630eb',
  },
});

export const layoutStyle = styles.layoutStyle;
export const iconStyle = styles.iconStyle;
export const paragraphStyle = styles.paragraphStyle;
export const captionStyle = styles.captionStyle;
export const linkStyle = styles.linkStyle;
