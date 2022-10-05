/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @oncall playtorch
 */

import React from 'react';
import {useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {useSnackData} from '../../utils/ExpoUtils';
import Colors from '../../constants/Colors';
import PTLIcon, {PTLIconNames} from '../../components/icon/PTLIcon';

type DemoTileProps = {
  snackIdentifier: string;
  onPress?: () => void;
  style?: ViewStyle;
  onMenuPress?: () => void;
};

export default function DemoTile({
  snackIdentifier,
  onPress,
  style,
  onMenuPress,
}: DemoTileProps) {
  const {
    snackDescription,
    snackTitle,
    loadingSnackMetadata,
    snackMetadataError,
  } = useSnackData(snackIdentifier);
  useEffect(() => {
    snackMetadataError &&
      console.error('error querying snack', snackMetadataError);
  }, [snackMetadataError]);
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={{
        ...styles.tileContainer,
        ...style,
      }}>
      <View style={styles.textContainer}>
        <Text style={styles.titleText} numberOfLines={2}>
          {loadingSnackMetadata ? 'Loading...' : snackTitle}
        </Text>
        <Text style={styles.descriptionText} numberOfLines={5}>
          {loadingSnackMetadata ? 'Loading...' : snackDescription}
        </Text>
      </View>
      <PTLIcon
        name={PTLIconNames.MORE}
        style={styles.more}
        size={24}
        onPress={onMenuPress}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tileContainer: {
    borderRadius: 16,
    backgroundColor: Colors.DARK_GRAY,
    paddingHorizontal: 16,
    paddingVertical: 19,
    height: 160,
    maxHeight: 160,
    width: '100%',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
  },
  titleText: {
    color: Colors.WHITE,
    marginBottom: 9,
    fontWeight: '700',
    fontSize: 13,
    lineHeight: 16,
  },
  descriptionText: {
    color: Colors.WHITE,
    fontWeight: '500',
    fontSize: 11,
    lineHeight: 16,
    flexShrink: 1,
    paddingBottom: 16,
    flexWrap: 'wrap',
  },
  more: {
    color: Colors.WHITE,
    paddingHorizontal: 12,
    paddingVertical: 8,
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
});
