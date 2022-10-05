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
import {StyleSheet, Text} from 'react-native';
import Colors from '../../../constants/Colors';

type Props = {
  labels: string[];
};

export default function ClassLabelsDisplay({labels}: Props) {
  return <Text style={styles.text}>{labels.join('\n')}</Text>;
}

const styles = StyleSheet.create({
  text: {
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '700',
    color: Colors.WHITE,
  },
});
