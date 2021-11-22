/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import * as React from 'react';
import {Text, StyleSheet, View} from 'react-native';

export default function MyDemos() {
  return (
    <View style={styles.bg}>
      <Text style={styles.info}>
        Try your own demos by adding them into the "src/demos" folder.
      </Text>
      <Text style={styles.info}>
        Learn more at https://live.pytorch.org/tutorials.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: {
    padding: 30,
    backgroundColor: '#60f',
    alignSelf: 'stretch',
    height: '100%',
  },

  info: {
    fontSize: 18,
    color: '#fff',
    lineHeight: 24,
    marginBottom: 21,
  },
});
