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
      <Text style={styles.heading}>Your Demos</Text>
      <Text style={styles.info}>
        Build your own demos and add them in the "src/demos" folder.
      </Text>
      <Text style={styles.info}>
        To learn more, review the Image Classification tutorial in our
        documentation.
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
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 25,
  },
  info: {
    fontSize: 16,
    color: '#ffffffaa',
    lineHeight: 21,
    marginBottom: 12,
  },
});
