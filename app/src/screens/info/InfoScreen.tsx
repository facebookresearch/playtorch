/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @oncall playtorch
 */

import * as React from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import Colors from '../../constants/Colors';
import GradientBackground from '../../components/GradientBackground';
import InfoRow, {InfoRowConfig} from './InfoRow';
import {InfoScreenProps} from '../../types/navigation';

export default function InfoScreen({
  route: {
    params: {description, rowConfigs},
  },
}: InfoScreenProps) {
  return (
    <View style={styles.container}>
      <GradientBackground gradient="bottom" />
      <Text style={styles.description}>{description}</Text>
      <FlatList<InfoRowConfig>
        data={rowConfigs}
        renderItem={({item}) => <InfoRow {...item} />}
        keyExtractor={({label}) => label}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  description: {
    fontSize: 13,
    lineHeight: 16,
    color: Colors.WHITE,
    fontWeight: '500',
    paddingTop: 27,
    paddingHorizontal: 24,
    paddingBottom: 36,
    width: '100%',
    borderBottomColor: Colors.ALMOST_WHITE_30,
    borderBottomWidth: 1,
  },
});
