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
import {StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import Colors from '../constants/Colors';

const GradientAssets = {
  full: require('../assets/images/gradient-bg/gradient-bg.png'),
  bottom: require('../assets/images/bottom-gradient-bg/bottom-gradient-bg.png'),
  onboarding1: require('../assets/images/onboarding-bg/onboarding-bg-1.png'),
  onboarding2: require('../assets/images/onboarding-bg/onboarding-bg-2.png'),
  onboarding3: require('../assets/images/onboarding-bg/onboarding-bg-3.png'),
};

export type GradientBgType = keyof typeof GradientAssets;

type Props = {
  gradient?: GradientBgType;
};

/**
 * The gradient background is a workaround solution and will most likely be
 * replaced by a gradient drawn on a canvas component.
 *
 * @returns A component with a gradient image as background.
 */
export default function GradientBackground({gradient = 'full'}: Props) {
  return (
    <FastImage
      style={styles.gradientBackground}
      source={GradientAssets[gradient]}
    />
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
    backgroundColor: Colors.ALMOST_BLACK,
  },
});
