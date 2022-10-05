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
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import Colors from '../constants/Colors';

type Props = {
  label: string;
  selected: boolean;
  onPress?: () => void;
};

export default function RadioPill({label, selected, onPress}: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[styles.container, selected && styles.containerSelected]}
      onPress={onPress}>
      <Text style={[styles.label, selected && styles.labelSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.ALMOST_BLACK,
    borderWidth: 1,
    borderRadius: 18,
    borderColor: Colors.ALMOST_BLACK,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  containerSelected: {
    backgroundColor: Colors.ALMOST_BLACK,
    borderColor: Colors.WHITE,
  },
  label: {
    color: Colors.ALMOST_WHITE_60,
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '500',
  },
  labelSelected: {
    color: Colors.WHITE,
  },
});
