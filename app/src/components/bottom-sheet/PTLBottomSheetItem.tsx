/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @oncall playtorch
 */

import {useBottomSheetModal} from '@gorhom/bottom-sheet';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import Colors from '../../constants/Colors';
import PTLIcon, {PTLIconNames, PTLIconName} from '../icon/PTLIcon';

export type BottomSheetItemConfig = {
  label: string;
  icon: PTLIconName;
  onPress?: () => void;
};

export default function PTLBottomSheetItem({
  label,
  icon,
  onPress,
}: BottomSheetItemConfig) {
  const {dismiss} = useBottomSheetModal();
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        onPress && onPress();
        dismiss();
      }}>
      <PTLIcon name={PTLIconNames[icon]} color={Colors.WHITE} size={24} />
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  label: {
    fontSize: 13,
    lineHeight: 16,
    marginStart: 20,
    fontWeight: '700',
    color: Colors.WHITE,
  },
});
