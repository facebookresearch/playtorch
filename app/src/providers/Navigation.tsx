/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @oncall playtorch
 */

import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {HeaderButtonProps} from '@react-navigation/native-stack/lib/typescript/src/types';
import * as Linking from 'expo-linking';
import * as React from 'react';
import {PropsWithChildren, useCallback, useEffect, useMemo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import Colors from '../constants/Colors';
import {DarkTheme} from '../constants/Themes';
import {EXAMPLES_BY_SLUG} from '../examples/examples-config';
import {
  HomeScreen,
  InfoScreen,
  IntroScreen,
  ScannerScreen,
  SnackScreen,
  ViewExampleScreen,
} from '../screens';
import ViewExampleNavIcons from '../screens/view-example/ViewExampleNavIcons';
import {RootStackParamList} from '../types/navigation';
import {useNUX} from '../utils/NUX';

type Props = PropsWithChildren<{
  initialUrl: string | null | undefined;
}>;

const Stack = createNativeStackNavigator<RootStackParamList>();

export function NavigationProvider({initialUrl, children}: Props) {
  const navigationRef = useNavigationContainerRef();
  const {showNUX} = useNUX('intro');
  const insets = useSafeAreaInsets();
  const {wrapperStyle, headerStyle, headerTitleStyle} = useMemo(
    () => getStyles(insets),
    [insets],
  );

  const handleDeepLink = useCallback(
    (url: string) => {
      const {hostname, queryParams} = Linking.parse(url);
      switch (hostname) {
        case 'snack':
          navigationRef.current?.navigate('Snack', {
            snackUrl: `${queryParams?.snackUrl}`,
          });
          break;
        case 'example':
          navigationRef.current?.navigate('ViewExample', {
            exampleSlug: `${queryParams?.example}`,
          });
      }
    },
    [navigationRef],
  );

  useEffect(() => {
    const handler: Linking.URLListener = ({url}) => {
      handleDeepLink(url);
    };
    const subscription = Linking.addEventListener('url', handler);
    return () => subscription.remove();
  }, [handleDeepLink]);

  useEffect(() => {
    if (initialUrl != null) {
      handleDeepLink(initialUrl);
    }
  }, [initialUrl, handleDeepLink]);

  const stableView = useCallback(() => <View />, []);
  const navigationHeaderTitle = useCallback(
    (props: {children: string}) => (
      <Text style={headerTitleStyle}>{props.children}</Text>
    ),
    [headerTitleStyle],
  );
  const viewExampleHeaderRight = useCallback(
    (props: HeaderButtonProps, exampleSlug: string) => (
      <ViewExampleNavIcons exampleSlug={exampleSlug} {...props} />
    ),
    [],
  );

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={DarkTheme}
      onReady={() => {
        if (showNUX) {
          navigationRef.current?.navigate('Intro');
        }
      }}>
      <View style={wrapperStyle}>
        <Stack.Navigator
          screenOptions={{
            headerBackVisible: true,
            headerBackTitleVisible: false,
            headerStyle,
            headerTitleAlign: 'center',
            headerTitleStyle,
            headerTintColor: Colors.WHITE,
            headerLeft: stableView,
            headerTitle: navigationHeaderTitle,
          }}>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen name="Scanner" component={ScannerScreen} />
          <Stack.Screen
            name="Snack"
            component={SnackScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="ViewExample"
            component={ViewExampleScreen}
            options={({
              route: {
                params: {exampleSlug},
              },
            }) => ({
              title: EXAMPLES_BY_SLUG[exampleSlug].title,
              headerRight: props => viewExampleHeaderRight(props, exampleSlug),
            })}
          />
          <Stack.Screen
            options={{headerShown: false}}
            name="Intro"
            component={IntroScreen}
          />
          <Stack.Screen
            name="Info"
            component={InfoScreen}
            options={({
              route: {
                params: {title},
              },
            }) => ({
              title,
            })}
          />
        </Stack.Navigator>
        {children}
      </View>
    </NavigationContainer>
  );
}

function getStyles(insets: EdgeInsets) {
  return StyleSheet.create({
    wrapperStyle: {
      flex: 1,
      backgroundColor: Colors.ALMOST_BLACK,
    },
    headerStyle: {
      backgroundColor: Colors.ALMOST_BLACK,
      shadowColor: Colors.TRANSPARENT,
      paddingVertical: 14,
      paddingTop: insets.top,
    },
    headerTitleStyle: {
      color: Colors.WHITE,
      fontSize: 13,
      lineHeight: 16,
      letterSpacing: 1.5,
      textTransform: 'uppercase',
      textAlign: 'center',
      fontWeight: '700',
    },
  });
}
