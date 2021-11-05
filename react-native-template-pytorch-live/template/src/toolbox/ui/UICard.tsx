/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import React, {useState} from 'react';
import {StyleSheet, ScrollView, SafeAreaView, View, Text} from 'react-native';

import {
  PTLColors as colors,
  PTLFontSizes as fontsizes,
  PTLVisual as visuals,
} from '../../components/UISettings';

import {BasicCard, IconButton} from '../../components/UIComponents';

const photo1 = require('../../../assets/images/wnn_photo1_fpo.jpg');
const photo2 = require('../../../assets/images/wnn_photo2_fpo.jpg');
const photo3 = require('../../../assets/images/swan.jpg');

export default function UICard() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.wrapper}>
          <BasicCard img={photo1}>
            <View style={styles.content}>
              <Text>Hello!</Text>
            </View>
          </BasicCard>
          <BasicCard img={photo2}>
            <View style={styles.contentCenter}>
              <IconButton icon="plus" size="small" />
            </View>
          </BasicCard>
          <BasicCard img={photo3}>
            <View style={styles.content}>
              <Text style={styles.titleText}>Heading</Text>
              <Text style={styles.infoText}>More descriptions</Text>
            </View>
          </BasicCard>
          <BasicCard img={photo1} height={300}>
            <View style={styles.content}>
              <Text style={styles.titleText}>Taller!</Text>
              <Text style={styles.infoText}>More descriptions</Text>
            </View>
          </BasicCard>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// You can customize your UI elements using CSS-like properties.
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    backgroundColor: colors.light,
    padding: visuals.padding,
  },
  content: {
    padding: 10,
  },
  contentCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
  titleText: {
    fontSize: fontsizes.p,
    fontWeight: 'bold',
    color: colors.dark,
  },
  infoText: {
    fontSize: fontsizes.small,
    color: colors.neutralBlack,
  },
});
