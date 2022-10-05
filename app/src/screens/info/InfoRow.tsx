/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @oncall playtorch
 */

import * as React from 'react';
import {useRef} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {InfoParams} from '../../types/navigation';
import PTLIcon, {PTLIconNames} from '../../components/icon/PTLIcon';
import Colors from '../../constants/Colors';
import {StackActions, useNavigation} from '@react-navigation/native';
import PTLWebViewBottomSheet from '../../components/bottom-sheet/PTLWebViewBottomSheet';
import {PTLBottomSheetRef} from '../../components/bottom-sheet/PTLBottomSheet';

export type InfoRowConfig = {
  label: string;
  url?: string;
  text?: string;
  infoScreenProps?: InfoParams;
};

export default function InfoRow({
  label,
  url,
  text,
  infoScreenProps,
}: InfoRowConfig) {
  const navigation = useNavigation();
  const bottomSheetRef = useRef<PTLBottomSheetRef>(null);

  const isExternalLink = url != null;

  function handlePress() {
    if (isExternalLink) {
      bottomSheetRef.current?.present();
    } else {
      const pushAction = StackActions.push('Info', infoScreenProps);
      navigation.dispatch(pushAction);
    }
  }

  if (text != null) {
    return (
      <View style={styles.border}>
        <View style={styles.container}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.label}>{text}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.border}>
      <TouchableOpacity onPress={handlePress} style={styles.container}>
        <Text style={styles.label}>{label}</Text>
        <PTLIcon
          name={PTLIconNames.LINK_ARROW}
          style={isExternalLink ? null : styles.internal}
          size={16}
          color={Colors.WHITE}
        />
      </TouchableOpacity>
      {isExternalLink && (
        <PTLWebViewBottomSheet
          ref={bottomSheetRef}
          title={label}
          url={url!}
          onDismiss={() => {
            bottomSheetRef.current?.close();
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 27,
    paddingBottom: 29,
  },
  border: {
    borderBottomColor: Colors.ALMOST_WHITE_30,
    borderBottomWidth: 1,
  },
  label: {
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '700',
    color: Colors.WHITE,
  },
  internal: {
    transform: [{rotate: '45deg'}],
  },
});
