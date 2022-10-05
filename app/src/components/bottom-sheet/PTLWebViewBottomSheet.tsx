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
import {forwardRef} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  TouchableOpacity,
} from '@gorhom/bottom-sheet';
import Colors from '../../constants/Colors';
import {WebView} from 'react-native-webview';

type Props = {
  url: string;
  title: string;
  onDismiss?: () => void;
};

const PTLWebViewBottomSheet = forwardRef<BottomSheetModal, Props>(
  ({url, title, onDismiss}, ref) => {
    return (
      <BottomSheetModal
        ref={ref}
        backgroundStyle={styles.background}
        onDismiss={onDismiss}
        handleIndicatorStyle={styles.handle}
        handleStyle={styles.handle}
        snapPoints={['95%']}
        backdropComponent={props => (
          <BottomSheetBackdrop
            {...props}
            style={[props.style, {backgroundColor: Colors.ALMOST_BLACK}]}
          />
        )}>
        <View style={styles.header}>
          <View style={styles.headerSideView}>
            <TouchableOpacity
              onPress={onDismiss}
              activeOpacity={0.7}
              style={[styles.cancelButton]}>
              <Text style={styles.cancelButtonLabel}>Cancel</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.headerSideView} />
        </View>
        <WebView
          style={styles.webview}
          source={{uri: url}}
          allowsInlineMediaPlayback
          nestedScrollEnabled
        />
      </BottomSheetModal>
    );
  },
);

const styles = StyleSheet.create({
  background: {
    backgroundColor: Colors.DARK_GRAY,
  },
  handle: {
    height: 0,
    width: 0,
    padding: 0,
    margin: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 25,
    paddingBottom: 24,
    paddingHorizontal: 21,
    alignItems: 'center',
  },
  title: {
    flexGrow: 1,
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '700',
    color: Colors.WHITE,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  cancelButton: {},
  cancelButtonLabel: {
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '700',
    color: Colors.WHITE,
  },
  webview: {
    flexGrow: 1,
    width: '100%',
  },
  headerSideView: {
    flexBasis: 0,
    flexGrow: 1,
  },
});

export default PTLWebViewBottomSheet;
