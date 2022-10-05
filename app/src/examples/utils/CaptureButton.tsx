/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @oncall playtorch
 */

import React, {useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import Colors from '../../constants/Colors';

type Props = {
  onPress: () => void;
};

export default function CaptureButton({onPress}: Props) {
  const [pressed, setPressed] = useState(false);
  return (
    <Pressable
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => {
        setPressed(false);
        if (onPress != null) {
          onPress();
        }
      }}
      style={styles.outer}>
      <View style={[styles.inner, pressed && styles.innerShrunk]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  outer: {
    height: 64,
    width: 64,
    backgroundColor: Colors.WHITE,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inner: {
    backgroundColor: Colors.WHITE,
    height: 56,
    width: 56,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: Colors.ALMOST_BLACK,
  },
  innerShrunk: {
    borderWidth: 5,
  },
});
