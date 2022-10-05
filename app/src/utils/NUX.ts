/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @oncall playtorch
 */

import {useState} from 'react';
import {MMKV} from 'react-native-mmkv';

interface NUXManager {
  showNUX: boolean;
  dismissNUX: () => void;
  clear: () => void;
}

const storage = new MMKV({id: 'NUX'});

export type NUXKey = 'intro' | 'exit_fullscreen';

export function useNUX(key: NUXKey): NUXManager {
  const [showNUX, setShowNUX] = useState(!storage.getBoolean(key));
  function dismissNUX() {
    storage.set(key, true);
    setShowNUX(false);
  }
  return {
    showNUX,
    dismissNUX,
    clear: storage.clearAll,
  };
}
