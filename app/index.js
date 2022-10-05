/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import 'expo-dev-client';

import 'react-native-gesture-handler';
import {registerRootComponent} from 'expo';
import {registerSnackAssetSourceTransformer} from 'snack-runtime';

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);

// We need this to resolve Snack assets from a different cdn when using dev-clients
registerSnackAssetSourceTransformer();
