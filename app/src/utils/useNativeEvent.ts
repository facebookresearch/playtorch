/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @oncall playtorch
 */

import {useEffect} from 'react';
import {
  DeviceEventEmitter,
  NativeEventEmitter,
  NativeModules,
  Platform,
} from 'react-native';

type PlayTorchNativeEvents = 'onTwoFingerLongPress';

export default function useNativeEvent(
  eventName: PlayTorchNativeEvents,
  eventHandler?: () => void,
) {
  useEffect(() => {
    if (eventHandler == null) {
      return;
    }
    if (Platform.OS === 'ios') {
      const {PTLEventEmitter} = NativeModules;
      const eventEmitter = new NativeEventEmitter(PTLEventEmitter);
      const subscription = eventEmitter.addListener(eventName, eventHandler);
      return () => {
        subscription.remove();
      };
    } else {
      const subscription = DeviceEventEmitter.addListener(
        eventName,
        eventHandler,
      );
      return () => {
        subscription.remove();
      };
    }
  }, [eventName, eventHandler]);
}
