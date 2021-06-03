/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import * as React from 'react';
import {ReactNode} from 'react';
import {Platform} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {enableScreens} from 'react-native-screens';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ModelPreloader from './components/ModelPreloader';
import Demos from './demos/MyDemos';
import Examples from './examples/Examples';
import {Models} from './Models';
import Toolbox from './toolbox/Toolbox';

// Before rendering any navigation stack
enableScreens();

Icon.loadFont();

const Tab = createBottomTabNavigator();

type ModelPreloaderWrapperProps = {
  children?: ReactNode | ReactNode[];
};

/**
 * Wrapper around the `ModelPreloader` until PyTorch Live supports iOS as a
 * platform.
 */
function ModelPreloaderWrapper({children}: ModelPreloaderWrapperProps) {
  if (Platform.OS === 'android') {
    return (
      <ModelPreloader modelInfos={Models} loadAsync={true}>
        {children}
      </ModelPreloader>
    );
  }
  return <>{children}</>;
}

function AppWithNavigation() {
  const insets = useSafeAreaInsets();
  return (
    <ModelPreloaderWrapper>
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
              height: 60 + insets.bottom,
              paddingTop: 10,
            },
            labelStyle: {
              height: 22,
            },
          }}>
          <Tab.Screen name="My Demos" component={Demos} />
          <Tab.Screen name="Examples" component={Examples} />
          <Tab.Screen name="Toolbox" component={Toolbox} />
        </Tab.Navigator>
      </NavigationContainer>
    </ModelPreloaderWrapper>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppWithNavigation />
    </SafeAreaProvider>
  );
}
