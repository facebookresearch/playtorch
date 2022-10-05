/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @oncall playtorch
 */

import React, {PropsWithChildren, useMemo} from 'react';
import {StyleProp, StyleSheet, Text, TextStyle} from 'react-native';
import Colors from '../constants/Colors';

export type HeaderLevel = 'h1' | 'h2';

type Props = {
  style?: StyleProp<TextStyle>;
  level: HeaderLevel;
};

export default function Header({
  children,
  style,
  level,
}: PropsWithChildren<Props>) {
  const styles = useMemo(() => getStyles(level), [level]);
  return <Text style={[styles.header, style]}>{children}</Text>;
}

const HeaderFontSizes: {[key in HeaderLevel]: number} = {
  h1: 44,
  h2: 36,
};

const HeaderLineHeights: {[key in HeaderLevel]: number} = {
  h1: 56,
  h2: 40,
};

function getStyles(level: HeaderLevel) {
  return StyleSheet.create({
    header: {
      color: Colors.WHITE,
      fontFamily: 'System',
      fontSize: HeaderFontSizes[level],
      fontStyle: 'normal',
      fontWeight: 'bold',
      lineHeight: HeaderLineHeights[level],
    },
  });
}
