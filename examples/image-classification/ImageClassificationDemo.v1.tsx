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

export default function ImageClassificationDemo() {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Image Classification</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    padding: 20,
    flexGrow: 1,
  },
  label: {
    marginBottom: 10,
  },
});
