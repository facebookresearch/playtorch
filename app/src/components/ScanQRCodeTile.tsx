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
import {useCallback} from 'react';
import {Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import PillButton from './PillButton';
import Colors from '../constants/Colors';
import {Camera} from 'expo-camera';
import ExternalLinks from '../constants/ExternalLinks';

export default function ScanQRCodeTile() {
  const navigation = useNavigation();
  const [permission, requestPermission] = Camera.useCameraPermissions();

  const handleScanQRCode = useCallback(async () => {
    if (permission?.granted) {
      navigation.navigate('Scanner');
    } else {
      const {granted} = await requestPermission();
      if (granted) {
        navigation.navigate('Scanner');
      }
    }
  }, [navigation, permission, requestPermission]);

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={styles.container}
      onPress={handleScanQRCode}>
      <Image
        style={styles.viewfinder}
        source={require('../assets/images/qr-code/qr-code.png')}
      />
      <Text style={styles.hintText}>
        Visit {ExternalLinks.STARTER_SNACK_URL} and scan the QR code under “My
        Device”.
      </Text>
      <PillButton
        onPress={handleScanQRCode}
        label="Scan QR Code"
        buttonStyle="secondary"
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: Colors.DARK_GRAY,
    borderRadius: 16,
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    paddingTop: 24,
    paddingBottom: 32,
  },
  viewfinder: {
    alignSelf: 'center',
    height: 72,
    width: 72,
  },
  hintText: {
    color: Colors.WHITE,
    fontWeight: '500',
    fontSize: 13,
    lineHeight: 16,
    textAlign: 'center',
    marginTop: 19,
    marginBottom: 24,
    marginHorizontal: 60,
  },
});
