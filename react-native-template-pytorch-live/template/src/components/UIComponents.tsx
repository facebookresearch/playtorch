/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import * as React from 'react';
import {StyleSheet, View, Text} from 'react-native';

export function HintText({text = 'Hint', additionalStyle = {}}) {
  return (
    <View style={[styles.hint, additionalStyle]}>
      <Text style={styles.hintText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hint: {
    position: 'absolute',
    top: 20,
    height: 50,
    paddingHorizontal: 25,
    borderRadius: 25,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  hintText: {
    color: '#fff',
    fontSize: 14,
  },
});
