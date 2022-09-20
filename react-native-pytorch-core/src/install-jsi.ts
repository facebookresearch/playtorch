/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @internal
 * @ignore
 * @packageDocumentation
 */

// Adapted from react-native-quick-sqlite
// https://github.com/ospfranco/react-native-quick-sqlite/blob/6b50202a7f4a09f5a7e5662f57da5dca9662f39b/src/index.ts

import {NativeModules} from 'react-native';

declare global {
  function nativeCallSyncHook(): unknown;
  var __torchlive__: object | undefined;
}

if (global.__torchlive__ == null) {
  const PlayTorchJSIModule = NativeModules.PyTorchCoreJSI;

  if (PlayTorchJSIModule == null) {
    throw new Error(
      'PlayTorchJSIModule not found. Maybe try rebuilding the app.',
    );
  }

  // Check if we are running on-device (JSI)
  if (global.nativeCallSyncHook == null || PlayTorchJSIModule.install == null) {
    throw new Error(
      'Failed to install react-native-pytorch-core: React Native is not running on-device. The PlayTorchJSIModule can only be used when synchronous method invocations (JSI) are possible. If you are using a remote debugger (e.g. Chrome), switch to an on-device debugger (e.g. Flipper) instead.',
    );
  }

  // Call the synchronous blocking install() function
  const result = PlayTorchJSIModule.install();
  if (result !== true)
    throw new Error(
      `Failed to install react-native-pytorch-core: The native PlayTorchJSIModule could not be installed! Looks like something went wrong when installing JSI bindings: ${result}`,
    );

  // Check again if the constructor now exists. If not, throw an error.
  if (global.__torchlive__ == null)
    throw new Error(
      'Failed to install react-native-pytorch-core, the native initializer function does not exist. Are you trying to use PlayTorchJSIModule from different JS Runtimes?',
    );
}
