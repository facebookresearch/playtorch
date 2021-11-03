/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import * as React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  GestureResponderEvent,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {PTLColors as colors} from '../components/UISettings';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export function HintText({
  text = 'Hint',
  position = 'top',
  spacing = 20,
  additionalStyle = {},
}) {
  const isTop = position === 'top';
  return (
    <View
      style={[
        styles.hint,
        isTop ? {top: spacing} : {bottom: spacing},
        additionalStyle,
      ]}>
      <Text style={styles.hintText}>{text}</Text>
    </View>
  );
}

type IconButtonProps = {
  icon: string;
  onPress?: (event: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
  size?: string;
  dark?: boolean;
};

export function IconButton({
  icon = 'blur',
  onPress,
  style,
  size,
  dark,
}: IconButtonProps) {
  return (
    <TouchableOpacity style={styles.iconContainer} onPress={onPress}>
      <View
        style={[styles.button, size === 'small' ? styles.small : {}, style]}>
        <Icon
          name="camera"
          size={size === 'small' ? 28 : 42}
          color={dark ? colors.white : colors.black}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  hint: {
    position: 'absolute',
    height: 50,
    paddingHorizontal: 25,
    borderRadius: 25,
    backgroundColor: colors.semiBlack,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  hintText: {
    color: '#fff',
    fontSize: 14,
  },
  button: {
    backgroundColor: colors.white,
    width: 90,
    height: 90,
    alignSelf: 'flex-end',
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  small: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  iconContainer: {
    alignSelf: 'center',
  },
});
