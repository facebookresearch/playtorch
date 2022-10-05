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
import {useCallback, useEffect} from 'react';
import {useIsFocused} from '@react-navigation/native';
import * as BarCodeScanner from 'expo-barcode-scanner';
import {Camera} from 'expo-camera';
import {StyleSheet, View} from 'react-native';
import {ScannerScreenProps} from '../types/navigation';
import Colors from '../constants/Colors';
import {useHeaderHeight} from '@react-navigation/elements';
import {layoutStyle} from '../providers/Theme';
import {isValidSnackUrl} from 'snack-runtime';
import Svg, {Path} from 'react-native-svg';

export default function ScannerScreen({navigation}: ScannerScreenProps) {
  // React Navigation renders all screens in advance,
  // we only want to render the camera when it needs to be rendered.
  const isFocused = useIsFocused();
  const [permission] = Camera.useCameraPermissions();
  const headerHeight = useHeaderHeight();

  const onCameraBarCode = useCallback(
    ({data: snackUrl}: BarCodeScanner.BarCodeScannerResult) => {
      // Validation can be better, including a message like "Seems like you scanned a beer bottle".
      // But, this is just to make sure we don't load anything random
      if (isValidSnackUrl(snackUrl)) {
        navigation.replace('Snack', {snackUrl});
      }
    },
    [navigation],
  );
  useEffect(() => {
    if (permission?.granted === false) {
      navigation.goBack();
    }
  }, [permission, navigation]);

  if (!permission?.granted) {
    return null;
  }

  return (
    <View style={[layoutStyle, styles.container]}>
      {isFocused && (
        <Camera
          style={StyleSheet.absoluteFill}
          onBarCodeScanned={onCameraBarCode}
          barCodeScannerSettings={{
            barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
          }}
        />
      )}
      <Svg
        width={275}
        height={275}
        viewBox="0 0 275 275"
        style={{marginTop: -headerHeight}}>
        <Path
          d={`
            M1.5 51.5 L1.5 1.5 L51.5 1.5
            M273.5 51.5 L273.5 1.5 L223.5 1.5
            M1.5 223.5 L1.5 273.5 L51.5 273.5
            M273.5 223.5 L273.5 273.5 L223.5 273.5
          `}
          fill="none"
          stroke={Colors.PURPLE}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  permissionContainer: {
    paddingHorizontal: 32,
  },
  container: {
    justifyContent: 'center',
  },
  permissionText: {
    color: Colors.WHITE,
  },
  link: {
    color: '#9c90e8',
  },
});
