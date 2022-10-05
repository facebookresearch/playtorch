/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
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
import {ModelResultMetrics} from 'react-native-pytorch-core/lib/typescript/MobileModelModule';
import {
  PTLColors as colors,
  PTLFontSizes as fontsizes,
  PTLVisual as visual,
} from './UISettings';

type Props = {
  imageClass?: string;
  metrics?: ModelResultMetrics;
  style?: StyleProp<ViewStyle>;
  placeholder?: string;
  numberOfLines?: number;
};

export default function ImageClassInfo({
  imageClass,
  metrics,
  placeholder,
  numberOfLines = 1,
  style,
}: Props) {
  if (placeholder) {
    return (
      <View style={[styles.imageClasses, style]}>
        <Text style={[styles.labels, styles.placeholder]}>{placeholder}</Text>
      </View>
    );
  } else if (imageClass == null) {
    return null;
  }
  return (
    <View style={[styles.imageClasses, style]}>
      <Text
        style={styles.labels}
        numberOfLines={numberOfLines}
        ellipsizeMode="tail">
        {imageClass}
      </Text>
      <Text style={styles.small}>
        Time: {metrics?.totalTime}ms (p={metrics?.packTime}/i=
        {metrics?.inferenceTime}/u={metrics?.unpackTime})
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  imageClasses: {
    backgroundColor: colors.white,
    padding: visual.padding,
    borderRadius: visual.borderRadius,
  },
  labels: {
    fontWeight: 'bold',
    fontSize: fontsizes.p,
    color: colors.accent1,
  },
  placeholder: {
    color: colors.neutralBlack,
    fontSize: fontsizes.small,
  },
  small: {
    fontSize: fontsizes.small,
    color: colors.semiBlack,
  },
});
