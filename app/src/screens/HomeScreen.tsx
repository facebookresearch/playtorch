/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @oncall playtorch
 */

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import * as React from 'react';
import {StyleSheet} from 'react-native';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import TabIcon from '../components/bottom-nav/TabIcon';
import Colors from '../constants/Colors';
import {HomeTabsParamList} from '../types/navigation';
import ExamplesScreen from './examples/ExamplesScreen';
import MyDemosScreen from './my-demos/MyDemosScreen';

const Tab = createBottomTabNavigator<HomeTabsParamList>();

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const {tabBarStyle, tabBarLabelStyle} = getStyles(insets);

  // Use stable tab icon, which otherwise would result in a linter warning
  // (ESLINT) react/no-unstable-nested-components
  const myDemosTabBarIcon = React.useCallback(({focused}) => {
    return <TabIcon tabName="MyDemos" focused={focused} />;
  }, []);

  // Use stable tab icon, which otherwise would result in a linter warning
  // (ESLINT) react/no-unstable-nested-components
  const examplesTabBarIcon = React.useCallback(({focused}) => {
    return <TabIcon tabName="Examples" focused={focused} />;
  }, []);

  return (
    <Tab.Navigator
      initialRouteName="MyDemos"
      screenOptions={{
        tabBarActiveTintColor: Colors.PURPLE,
        tabBarInactiveTintColor: Colors.WHITE,
        tabBarStyle,
        tabBarLabelStyle,
        lazy: false,
      }}>
      <Tab.Screen
        name="MyDemos"
        component={MyDemosScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'My Demos',
          tabBarIcon: myDemosTabBarIcon,
        }}
      />
      <Tab.Screen
        name="Examples"
        component={ExamplesScreen}
        options={{
          headerShown: false,
          tabBarIcon: examplesTabBarIcon,
        }}
      />
    </Tab.Navigator>
  );
}

function getStyles(insets: EdgeInsets) {
  return StyleSheet.create({
    tabBarStyle: {
      backgroundColor: Colors.ALMOST_BLACK,
      borderTopWidth: 0,
      height: 65 + insets.bottom,
      paddingTop: 10,
    },
    tabBarLabelStyle: {
      height: 22,
    },
  });
}
