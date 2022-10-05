/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @oncall playtorch
 */

import React from 'react';
import {StyleProp, StyleSheet, Text, View, ViewStyle} from 'react-native';
import {useHeaderHeight} from '@react-navigation/elements';
import FastImage from 'react-native-fast-image';
import Colors from '../../constants/Colors';
import GradientBackground from '../../components/GradientBackground';

const spinnerImg = require('../../assets/images/loading-bar-circle.gif');

type Props = {
  style?: StyleProp<ViewStyle>;
  text?: string;
};

export default function FullScreenLoading({style, text = 'Processing'}: Props) {
  const headerHeight = useHeaderHeight();
  return (
    <View style={[styles.container, style]}>
      <GradientBackground gradient="bottom" />
      <View style={[styles.spinnerBox, {marginTop: -headerHeight}]}>
        <FastImage style={styles.spinner} source={spinnerImg} />
        <Text style={styles.text}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    width: '100%',
    height: '100%',
  },
  gradientBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
    backgroundColor: Colors.ALMOST_BLACK,
  },
  spinner: {
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
  spinnerBox: {
    height: 175,
    width: 175,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: Colors.WHITE,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 16,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});
