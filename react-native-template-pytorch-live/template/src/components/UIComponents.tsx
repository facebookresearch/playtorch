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
  Image,
  ImageSourcePropType,
} from 'react-native';
import {
  PTLColors as colors,
  PTLFontSizes as fontsizes,
  PTLVisual as visuals,
  PTLTextBoxStyle,
} from '../components/UISettings';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

/*
 * Here is a very basic set of UI components to get you started quickly.
 * As PyTorch Live moves forward, we will be developing even simpler ways to help you create UI.
 * You can also use third-party React Native UI frameworks with PyTorch Live to build your own apps.
 */

// HintText is a pop-up "pill" for messages
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

type BasicButtonProps = {
  onPress?: (event: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
  size?: 'small' | 'large';
  content?: string;
  disabled?: boolean;
  background?: string;
};

type IconProps = {
  icon: string;
  dark?: boolean;
};

type IconButtonProps = BasicButtonProps & IconProps;

// Basic Button
export function BasicButton({
  onPress,
  style,
  size,
  disabled = false,
  background = colors.accent4,
  children,
}: React.PropsWithChildren<BasicButtonProps>) {
  return (
    <TouchableOpacity disabled={disabled} onPress={onPress}>
      <View
        style={[
          styles.button,
          size == 'small' && {paddingHorizontal: 20, paddingVertical: 10},
          background != null && {backgroundColor: background},
          disabled && {backgroundColor: colors.tintBlack},
          style,
        ]}>
        <Text
          style={[
            styles.buttonLabel,
            size == 'small' && {fontSize: fontsizes.small},
          ]}>
          {children}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

// Icon Button in a circle
export function IconButton({
  icon = 'blur',
  onPress,
  style,
  size,
  background = colors.accent4,
  disabled = false,
  dark = true,
}: IconButtonProps) {
  return (
    <TouchableOpacity
      disabled={disabled}
      style={styles.iconContainer}
      onPress={onPress}>
      <View
        style={[
          styles.circleButton,
          size === 'small' && styles.small,
          background != null && {backgroundColor: background},
          disabled && {backgroundColor: colors.neutralBlack},
          style,
        ]}>
        <Icon
          name={icon}
          size={size === 'small' ? 24 : 42}
          color={dark ? colors.white : colors.black}
        />
      </View>
    </TouchableOpacity>
  );
}

type RowProps = {
  label: string;
  style?: StyleProp<ViewStyle>;
  bold?: boolean;
  divider?: boolean;
};

// A double row to fit a label and your contents vertically
export function DoubleLineRow({
  label,
  children,
  bold = false,
  divider: border,
  style,
}: React.PropsWithChildren<RowProps>) {
  return (
    <View style={[styles.doubleRow, border && styles.bottomBorder, style]}>
      <Text
        style={[
          styles.rowLabel,
          styles.doubleRowLabel,
          bold && {fontWeight: 'bold', color: colors.dark},
        ]}>
        {label}
      </Text>
      {children}
    </View>
  );
}

// A single row to fit a label and your contents horizontally
export function SingleLineRow({
  label,
  children,
  bold = false,
  divider: border,
  style,
}: React.PropsWithChildren<RowProps>) {
  return (
    <View style={[styles.singleRow, border && styles.bottomBorder, style]}>
      <Text
        style={[
          styles.rowLabel,
          bold && {fontWeight: 'bold', color: colors.dark},
        ]}>
        {label}
      </Text>
      {children}
    </View>
  );
}

type CardProps = {
  img: ImageSourcePropType;
  style?: StyleProp<ViewStyle>;
  width?: number;
  height?: number;
  onPress?: (event: GestureResponderEvent) => void;
};

// A basic Card for displaying visual information
export function BasicCard({
  img,
  onPress,
  width = 150,
  height = 200,
  style,
  children,
}: React.PropsWithChildren<CardProps>) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View
        style={[
          styles.card,
          width != null && {width: width},
          height != null && {height: height},
          style,
        ]}>
        <View style={styles.thumbnail}>
          <Image source={img} style={styles.thumb_image} />
        </View>

        <View style={styles.cardInner}>{children}</View>
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
    color: colors.white,
    fontSize: 14,
  },
  circleButton: {
    backgroundColor: colors.white,
    width: 90,
    height: 90,
    alignSelf: 'flex-end',
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  small: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  iconContainer: {
    alignSelf: 'center',
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    alignSelf: 'auto',
    borderRadius: visuals.borderRadius,
  },
  buttonLabel: {
    color: colors.white,
    fontSize: fontsizes.p,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  doubleRow: {
    flex: 1,
    padding: visuals.padding,
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  singleRow: {
    flex: 1,
    padding: visuals.padding,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowLabel: {
    color: colors.neutralBlack,
    fontSize: fontsizes.smaller,
    flex: 1,
  },
  doubleRowLabel: {
    marginBottom: 10,
  },
  bottomBorder: {
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: colors.tintBlack,
  },
  card: {
    overflow: 'hidden',
    height: 200,
    margin: 10,
    backgroundColor: colors.white,
    borderRadius: 5,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
    flexDirection: 'column',
    alignSelf: 'flex-start',
  },
  cardInner: {
    flex: 0.5,
  },
  thumbnail: {
    flex: 0.5,
    backgroundColor: colors.neutralBlack,
  },
  thumb_image: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
