/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @oncall playtorch
 */

import {
  BottomSheetBackdrop,
  BottomSheetModal,
  useBottomSheetDynamicSnapPoints,
} from '@gorhom/bottom-sheet';
import * as React from 'react';
import {forwardRef, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import Colors from '../../constants/Colors';
import PTLBottomSheetItem, {BottomSheetItemConfig} from './PTLBottomSheetItem';

type Props = {
  items: BottomSheetItemConfig[];
  onDismiss?: () => void;
};

export type PTLBottomSheetRef = BottomSheetModal;

const PTLBottomSheet = forwardRef<BottomSheetModal, Props>(
  ({items, onDismiss}, ref) => {
    const insets = useSafeAreaInsets();
    const initialSnapPoints = useMemo(() => ['25%', 'CONTENT_HEIGHT'], []);
    const styles = useMemo(() => getStyles(insets), [insets]);

    const {
      animatedHandleHeight,
      animatedSnapPoints,
      animatedContentHeight,
      handleContentLayout,
    } = useBottomSheetDynamicSnapPoints(initialSnapPoints);

    return (
      <BottomSheetModal
        ref={ref}
        backgroundStyle={styles.background}
        index={1}
        onDismiss={onDismiss}
        handleHeight={animatedHandleHeight}
        contentHeight={animatedContentHeight}
        snapPoints={animatedSnapPoints}
        handleIndicatorStyle={styles.handleIndicator}
        backdropComponent={props => (
          <BottomSheetBackdrop
            {...props}
            style={[props.style, {backgroundColor: Colors.ALMOST_BLACK}]}
          />
        )}>
        <View style={styles.contentContainer} onLayout={handleContentLayout}>
          {items.map(config => (
            <PTLBottomSheetItem {...config} key={config.label} />
          ))}
        </View>
      </BottomSheetModal>
    );
  },
);

function getStyles(insets: EdgeInsets) {
  return StyleSheet.create({
    background: {
      backgroundColor: Colors.DARK_GRAY,
    },
    handleIndicator: {
      backgroundColor: Colors.LIGHT_GRAY,
      width: 40,
      height: 4,
      borderRadius: 2,
    },
    contentContainer: {flex: 1, paddingBottom: insets.bottom + 33},
  });
}

export default PTLBottomSheet;
