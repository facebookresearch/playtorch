/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @oncall playtorch
 */

import React from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';
import Colors from '../../constants/Colors';

type Props = {
  count: number;
  activeIndex: number;
  style?: ViewStyle;
};

export default function NuxPageIndicator({count, activeIndex, style}: Props) {
  const Dots = [];
  for (let i = 0; i < count; i++) {
    Dots.push(
      <View
        key={i}
        style={[
          styles.dot,
          i === activeIndex ? styles.activeDot : styles.inactiveDot,
        ]}
      />,
    );
  }
  return <View style={[styles.container, style]}>{Dots}</View>;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: Colors.WHITE,
  },
  inactiveDot: {
    backgroundColor: Colors.ALMOST_WHITE_30,
  },
});
