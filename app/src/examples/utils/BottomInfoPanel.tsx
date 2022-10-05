/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @oncall playtorch
 */

import * as React from 'react';
import {useMemo} from 'react';
import {PropsWithChildren} from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import Colors from '../../constants/Colors';

type Props = PropsWithChildren<{
  style?: ViewStyle;
}>;

export const BottomInfoPanelHeight = 148;

export default function BottomInfoPanel({style, children}: Props) {
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => getStyles(insets), [insets]);
  return <View style={[styles.infoPane, style]}>{children}</View>;
}

function getStyles(insets: EdgeInsets) {
  return StyleSheet.create({
    infoPane: {
      height: BottomInfoPanelHeight,
      width: '100%',
      backgroundColor: Colors.ALMOST_BLACK,
      flexDirection: 'row',
      paddingTop: 20,
      paddingBottom: insets.bottom,
      paddingLeft: 24 + insets.left,
      paddingRight: 24 + insets.right,
    },
  });
}
