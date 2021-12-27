/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import * as React from 'react';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {enableScreens} from 'react-native-screens';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MyDemos from './demos/MyDemos';
import Examples from './examples/Examples';
import Toolbox from './toolbox/Toolbox';

// Before rendering any navigation stack
enableScreens();

Icon.loadFont();

const Tab = createBottomTabNavigator();

function AppWithNavigation() {
  const insets = useSafeAreaInsets();
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Examples"
        screenOptions={({route}) => ({
          tabBarIcon: ({color, size}) => {
            if (route.name === 'Toolbox') {
              return <Icon name="drawing-box" size={size} color={color} />;
            } else if (route.name === 'Examples') {
              return <Icon name="fire" size={size} color={color} />;
            } else if (route.name === 'My Demos') {
              return <Icon name="star" size={size} color={color} />;
            }
          },
        })}
        tabBarOptions={{
          activeTintColor: '#f60',
          inactiveTintColor: '#fff',
          style: {
            backgroundColor: '#000',
            borderTopWidth: 0,
            height: 65 + insets.bottom,
            paddingTop: 10,
          },
          labelStyle: {
            height: 22,
          },
        }}>
        <Tab.Screen name="My Demos" component={MyDemos} />
        <Tab.Screen name="Examples" component={Examples} />
        <Tab.Screen name="Toolbox" component={Toolbox} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppWithNavigation />
    </SafeAreaProvider>
  );
}
