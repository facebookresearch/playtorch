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
import {StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import Header from '../../components/Header';
import Colors from '../../constants/Colors';

export type IntroPageContentProps = {
  contentImg: number;
  headerText: string;
};

export default function IntroPageContent({
  contentImg,
  headerText,
}: IntroPageContentProps) {
  return (
    <View style={styles.container}>
      <Header level="h2">{headerText}</Header>
      <FastImage
        source={contentImg}
        style={styles.image}
        resizeMode={FastImage.resizeMode.contain}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    paddingHorizontal: 25,
    backgroundColor: Colors.TRANSPARENT,
  },
  image: {
    flex: 1,
    marginTop: 24,
  },
});
