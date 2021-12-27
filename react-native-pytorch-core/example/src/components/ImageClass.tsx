/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import * as React from 'react';
import {StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {Text, View} from 'react-native';
import type {ModelResultMetrics} from 'react-native-pytorch-core';

type Props = {
  imageClass?: string;
  metrics?: ModelResultMetrics;
  style?: StyleProp<ViewStyle>;
};

export default function ImageClass({imageClass, metrics, style}: Props) {
  if (imageClass == null) {
    return null;
  }
  return (
    <View style={style}>
      <View style={styles.imageClasses}>
        <Text style={styles.labels} numberOfLines={2} ellipsizeMode="tail">
          {imageClass}
        </Text>
        <Text style={styles.small}>
          Time taken: {metrics?.totalTime}ms (p={metrics?.packTime}/i=
          {metrics?.inferenceTime}/u={metrics?.unpackTime})
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  imageClasses: {
    backgroundColor: 'white',
    padding: 20,
  },
  labels: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  small: {
    fontSize: 11,
    color: '#678',
    fontFamily: 'Courier New',
  },
});
