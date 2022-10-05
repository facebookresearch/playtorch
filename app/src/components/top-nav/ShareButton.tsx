/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @oncall playtorch
 */

import React, {useCallback} from 'react';
import {Share, StyleSheet} from 'react-native';
import Colors from '../../constants/Colors';
import PTLIcon, {PTLIconNames} from '../icon/PTLIcon';

type Props = {
  shareUrl: string;
  tintColor?: string;
  pressColor?: string;
  pressOpacity?: number;
};

export default function ShareButton({shareUrl}: Props) {
  const onShare = useCallback(async () => {
    if (!shareUrl) {
      return;
    }
    try {
      await Share.share({
        message: shareUrl,
      });
    } catch (error: any) {
      console.error(error.message);
    }
  }, [shareUrl]);
  return (
    <PTLIcon
      name={PTLIconNames.SHARE}
      onPress={onShare}
      style={styles.icon}
      size={24}
    />
  );
}

const styles = StyleSheet.create({
  icon: {
    color: Colors.WHITE,
  },
});
