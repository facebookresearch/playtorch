/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @oncall playtorch
 */

import {StatusBar} from 'expo-status-bar';
import * as React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationProvider} from './providers/Navigation';
import {ThemeProvider} from './providers/Theme';
import {ApolloProvider} from '@apollo/client';
import client from './graphql/client';
import {SnackIdCacheProvider} from './cache/useSnackIDCache';
import {useFonts} from 'expo-font';
import AppLoading from 'expo-app-loading';
import * as Linking from 'expo-linking';
import useAsync from 'react-use/lib/useAsync';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {StyleSheet} from 'react-native';
import {SnackbarProvider} from './providers/Snackbar';
import './utils/CacheManager';

export default function App() {
  const {value: initialUrl, loading: loadingInitialUrl} = useAsync(
    Linking.getInitialURL,
    [],
  );
  let [fontsLoaded] = useFonts({
    PTLIconFont: require('./assets/fonts/icomoon.ttf'),
  });
  if (!fontsLoaded || loadingInitialUrl) {
    return <AppLoading />;
  }
  return (
    <ApolloProvider client={client}>
      <SnackIdCacheProvider>
        <ThemeProvider>
          <GestureHandlerRootView style={StyleSheet.absoluteFill}>
            <SafeAreaProvider>
              <BottomSheetModalProvider>
                <SnackbarProvider>
                  <NavigationProvider initialUrl={initialUrl}>
                    <StatusBar style="light" />
                  </NavigationProvider>
                </SnackbarProvider>
              </BottomSheetModalProvider>
            </SafeAreaProvider>
          </GestureHandlerRootView>
        </ThemeProvider>
      </SnackIdCacheProvider>
    </ApolloProvider>
  );
}
