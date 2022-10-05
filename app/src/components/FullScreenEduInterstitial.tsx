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
import {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import Colors from '../constants/Colors';
import PillButton from './PillButton';
import {useNUX} from '../utils/NUX';
import Header from './Header';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useMemo} from 'react';
import GradientBackground from './GradientBackground';
const swipeUpImg = require('../assets/images/two-finger-press/two-finger-press.png');

export default function FullScreenEduInterstitial() {
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => getStyles(insets), [insets]);
  const {showNUX, dismissNUX} = useNUX('exit_fullscreen');
  const [dismissed, setDismissed] = useState(!showNUX);

  if (dismissed) {
    return null;
  }

  return (
    <View style={[StyleSheet.absoluteFill, styles.container]}>
      <GradientBackground gradient="bottom" />
      <View style={styles.eduContentContainer}>
        <FastImage source={swipeUpImg} style={styles.swipeUpImg} />
        <Header level="h2" style={styles.header}>
          Long press with two fingers to open the menu
        </Header>
        <PillButton
          buttonStyle="primary"
          label="Don't show this again"
          onPress={() => {
            setDismissed(true);
            dismissNUX();
          }}
          style={styles.dismissButton}
        />
      </View>
      <PillButton
        buttonStyle="secondary"
        label="Got it"
        onPress={() => setDismissed(true)}
        style={styles.continueButton}
      />
    </View>
  );
}

function getStyles(insets: EdgeInsets) {
  return StyleSheet.create({
    container: {
      justifyContent: 'center',
    },
    eduContentContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 53,
    },
    swipeUpImg: {
      height: 80,
      width: 68,
      marginBottom: 14,
    },
    header: {
      textAlign: 'center',
      marginBottom: 24,
    },
    dismissButton: {
      width: '100%',
      borderWidth: 2,
      borderColor: Colors.WHITE,
    },
    continueButton: {
      marginHorizontal: 53,
      marginBottom: insets.bottom + 53,
    },
  });
}
