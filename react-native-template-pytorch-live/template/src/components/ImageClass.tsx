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
        <Text style={styles.labels} numberOfLines={1} ellipsizeMode="middle">
          {imageClass} ({inferenceTime}ms)
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  imageClasses: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 50,
    padding: 20,
    width: '90%',
    alignSelf: 'center',
    bottom: 120,
  },
  labels: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
  },
});
