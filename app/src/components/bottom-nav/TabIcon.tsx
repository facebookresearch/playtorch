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
import {HomeTabsParamList} from '../../types/navigation';

type BottomNavTabIconName = keyof HomeTabsParamList;

type Props = {
  tabName: BottomNavTabIconName;
  focused: boolean;
};

const TabIconSources = {
  Examples: {
    active: require('../../assets/images/examples-tab/examples-tab-active.png'),
    inactive: require('../../assets/images/examples-tab/examples-tab-inactive.png'),
  },
  MyDemos: {
    active: require('../../assets/images/my-demos-tab/my-demos-tab-active.png'),
    inactive: require('../../assets/images/my-demos-tab/my-demos-tab-inactive.png'),
  },
};

export default function TabIcon({tabName, focused}: Props) {
  return (
    <FastImage
      style={styles.icon}
      source={
        focused
          ? TabIconSources[tabName].active
          : TabIconSources[tabName].inactive
      }
    />
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 32,
    height: 32,
  },
});
