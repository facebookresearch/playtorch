/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {Camera} from 'react-native-pytorch-core';

export default function CanvasDrawImage() {
  return (
    <>
      <Camera style={styles.camera} />
      <Text style={styles.baseText}> Hello </Text>
      {/* this is to show that flex layout works! */}
    </>
  );
}

const styles = StyleSheet.create({
  baseText: {
    height: 100,
    backgroundColor: 'red',
  },
  camera: {
    flex: 1,
  },
});
