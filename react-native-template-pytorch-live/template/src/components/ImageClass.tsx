/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import * as React from 'react';
import {StyleProp} from 'react-native';
import {StyleSheet, ViewStyle} from 'react-native';
import {Text, View} from 'react-native';

type Props = {
  imageClass?: string;
  inferenceTime?: number;
  style?: StyleProp<ViewStyle>;
};

export default function ImageClass({style, imageClass, inferenceTime}: Props) {
  if (imageClass == null) {
    return null;
  }
  return (
    <View style={style}>
      <View style={styles.imageClasses}>
        <Text style={styles.labels} numberOfLines={2} ellipsizeMode="tail">
          {imageClass}
        </Text>
        <Text style={styles.small}>Time taken: {inferenceTime}ms</Text>
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
  },
});
