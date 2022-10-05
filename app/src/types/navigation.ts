/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @oncall playtorch
 */

import type {CompositeScreenProps} from '@react-navigation/native';
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import type {
  BottomTabNavigationProp,
  BottomTabScreenProps,
} from '@react-navigation/bottom-tabs';
import {InfoRowConfig} from '../screens/info/InfoRow';

export type InfoParams = {
  title: string;
  description: string;
  rowConfigs: InfoRowConfig[];
};

export type RootStackParamList = {
  Home: undefined;
  Scanner: undefined;
  Snack: {snackUrl: string};
  ViewExample: {exampleSlug: string};
  Intro: undefined;
  Info: InfoParams;
};

export type RootStackNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

export type HomeScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Home'
>;
export type ScannerScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Scanner'
>;
export type SnackScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Snack'
>;
export type ViewExampleScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ViewExample'
>;
export type IntroScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Intro'
>;
export type InfoScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Info'
>;

export type HomeTabsParamList = {
  Examples: undefined;
  MyDemos: undefined;
};

export type HomeTabsNavigationProp = BottomTabNavigationProp<HomeTabsParamList>;

export type ExamplesScreenProps = CompositeScreenProps<
  BottomTabScreenProps<HomeTabsParamList, 'Examples'>,
  NativeStackScreenProps<RootStackParamList>
>;
export type MyDemosScreenProps = CompositeScreenProps<
  BottomTabScreenProps<HomeTabsParamList, 'MyDemos'>,
  NativeStackScreenProps<RootStackParamList>
>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
