/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @oncall playtorch
 */

import React, {useMemo} from 'react';
import {StyleSheet, Text, TouchableOpacity, ViewStyle} from 'react-native';
import Colors from '../constants/Colors';

type Props = {
  buttonStyle: 'primary' | 'secondary';
  label: string;
  onPress: () => void;
  style?: ViewStyle;
};

export default function PillButton({
  buttonStyle,
  label,
  onPress,
  style,
}: Props) {
  const styles = useMemo(
    () => (buttonStyle === 'primary' ? primaryStyles : secondaryStyles),
    [buttonStyle],
  );
  return (
    <TouchableOpacity
      style={[styles.labelContainer, style]}
      onPress={onPress}
      activeOpacity={0.7}>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const primaryStyles = StyleSheet.create({
  label: {
    fontSize: 13,
    fontStyle: 'normal',
    fontWeight: 'bold',
    letterSpacing: 1.3,
    lineHeight: 16,
    textAlign: 'center',
    textTransform: 'uppercase',
    color: Colors.WHITE,
  },
  labelContainer: {
    backgroundColor: Colors.ALMOST_BLACK,
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const secondaryStyles = StyleSheet.create({
  label: {
    ...primaryStyles.label,
    color: Colors.BLACK,
  },
  labelContainer: {
    ...primaryStyles.labelContainer,
    backgroundColor: Colors.WHITE,
  },
});
