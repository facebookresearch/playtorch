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
import {StyleProp, StyleSheet, Text, TextStyle} from 'react-native';
import {ModelResultMetrics} from 'react-native-pytorch-core';
import Colors from '../../../constants/Colors';

type Props = {
  metrics: ModelResultMetrics;
  style?: StyleProp<TextStyle>;
};

export default function ModelMetricsDisplay({
  metrics: {totalTime, packTime, inferenceTime, unpackTime},
  style,
}: Props) {
  return (
    <Text style={[styles.text, style]}>
      {`Time Taken=${totalTime}ms\nPack=${packTime}ms\nInference=${inferenceTime}ms\nUnpack=${unpackTime}ms`}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '500',
    color: Colors.WHITE,
  },
});
