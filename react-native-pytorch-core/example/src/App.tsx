/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {NavigationContainer} from '@react-navigation/native';
import * as React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {enableScreens} from 'react-native-screens';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toolbox from './toolbox/Toolbox';

// Before rendering any navigation stack
enableScreens();

Icon.loadFont();

function AppWithNavigation() {
  return (
    <NavigationContainer>
      <Toolbox />
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
