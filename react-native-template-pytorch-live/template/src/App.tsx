/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Examples from './examples/Examples';
import Demos from './demos/MyDemos';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import ModelPreloader from './components/ModelPreloader';
import {Models} from './Models';
import Toolbox from './toolbox/Toolbox';

// Before rendering any navigation stack
import {enableScreens} from 'react-native-screens';
enableScreens();

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <ModelPreloader modelInfos={Models} loadAsync={true}>
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
              labelStyle: {
                height: 22,
              },
              style: {backgroundColor: '#000', height: 60, paddingTop: 10},
            }}>
            <Tab.Screen name="My Demos" component={Demos} />
            <Tab.Screen name="Examples" component={Examples} />
            <Tab.Screen name="Toolbox" component={Toolbox} />
          </Tab.Navigator>
        </NavigationContainer>
      </ModelPreloader>
    </SafeAreaProvider>
  );
}
