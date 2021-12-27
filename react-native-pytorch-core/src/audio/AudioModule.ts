/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {NativeModules} from 'react-native';

const {PyTorchCoreAudioModule: AudioModule} = NativeModules;

export const AudioUtil = {
  async record(length: number) {
    return await AudioModule.record(length);
  },
};
