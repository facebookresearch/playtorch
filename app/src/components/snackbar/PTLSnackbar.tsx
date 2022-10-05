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
import {useMemo, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Snackbar} from 'react-native-paper';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import useDebounce from 'react-use/lib/useDebounce';
import Colors from '../../constants/Colors';
import PTLIcon, {PTLIconName, PTLIconNames} from '../icon/PTLIcon';

export type PTLSnackbarConfig = {
  message: string;
  icon?: PTLIconName;
};

type Props = PTLSnackbarConfig & {onDismiss: () => void};

export default function PTLSnackbar({message, icon, onDismiss}: Props) {
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => getStyles(insets), [insets]);
  const [visible, setVisible] = useState(true);
  useDebounce(
    () => {
      if (!visible) {
        onDismiss();
      }
    },
    500,
    [visible],
  );
  return (
    <Snackbar
      visible={visible}
      duration={1200}
      onDismiss={() => {
        setVisible(false);
      }}
      style={styles.snackbar}
      wrapperStyle={styles.snackbarWrapper}>
      <View style={styles.contentContainer}>
        {icon != null && (
          <PTLIcon name={PTLIconNames[icon]} style={styles.icon} size={24} />
        )}
        <Text style={styles.message}>{message}</Text>
      </View>
    </Snackbar>
  );
}

function getStyles(insets: EdgeInsets) {
  return StyleSheet.create({
    snackbar: {
      borderRadius: 16,
      backgroundColor: Colors.DARK_GRAY,
      margin: 0,
    },
    snackbarWrapper: {
      marginBottom: insets.bottom + 33,
      paddingHorizontal: 24,
      flexDirection: 'column',
    },
    icon: {
      color: Colors.WHITE,
      marginEnd: 8,
    },
    message: {
      fontSize: 13,
      lineHeight: 16,
      color: Colors.WHITE,
      fontWeight: '700',
      alignItems: 'center',
    },
    contentContainer: {
      flex: 1,
      flexDirection: 'row',
      height: 56,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    },
  });
}
