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
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Example} from '../../types/example';
import Colors from '../../constants/Colors';

type ExampleProp = {
  example: Example;
  onPress: () => void;
};

export default function ExampleCard({
  example: {img, title, description},
  onPress,
}: ExampleProp) {
  return (
    <TouchableOpacity activeOpacity={0.7} style={styles.card} onPress={onPress}>
      <View style={styles.label}>
        <Text style={styles.titleText}>{title}</Text>
        <Text style={styles.descriptionText} numberOfLines={2}>
          {description}
          {'\n'}
        </Text>
      </View>
      <View style={styles.thumbnail}>
        <FastImage source={img} style={styles.thumbImage} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    backgroundColor: Colors.DARK_GRAY,
    borderRadius: 16,
    flexDirection: 'column',
    width: '100%',
    aspectRatio: 1,
  },
  thumbnail: {
    flexGrow: 1,
    flexBasis: 0,
  },
  thumbImage: {
    flexGrow: 0,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  label: {
    paddingStart: 20,
    paddingTop: 15,
    paddingEnd: 13,
    paddingBottom: 15,
  },
  titleText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.WHITE,
    lineHeight: 16,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 13,
    color: Colors.ALMOST_WHITE_60,
    lineHeight: 16,
  },
  gradient: {
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
  },
});
