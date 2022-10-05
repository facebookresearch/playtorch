/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @oncall playtorch
 */

import {useIsFocused} from '@react-navigation/native';
import * as React from 'react';
import {useEffect, useMemo, useRef} from 'react';
import {Alert, StyleSheet, Text, View} from 'react-native';
import {Button, Paragraph} from 'react-native-paper';
import SnackRuntime, {
  extractSnackIdentifierFromSnackUrl,
  isEphemeralSnackUrl,
} from 'snack-runtime';
import useSnackIdCache from '../cache/useSnackIDCache';
import PTLBottomSheet, {
  PTLBottomSheetRef,
} from '../components/bottom-sheet/PTLBottomSheet';
import {BottomSheetItemConfig} from '../components/bottom-sheet/PTLBottomSheetItem';
import FullScreenEduInterstitial from '../components/FullScreenEduInterstitial';
import FullScreenLoading from '../examples/utils/FullScreenLoading';
import {useSnackbar} from '../providers/Snackbar';
import {iconStyle, paragraphStyle} from '../providers/Theme';
import {SnackScreenProps} from '../types/navigation';
import {useShareSnack} from '../utils/Sharing';
import useNativeEvent from '../utils/useNativeEvent';

export default function SnackScreen({
  navigation,
  route: {params},
}: SnackScreenProps) {
  const shareSnack = useShareSnack();
  const {snackUrl} = params;
  const {markSnackIdRecent, savedSnackIds, saveSnackId, deleteSavedSnackId} =
    useSnackIdCache();
  const snackIdentifier = useMemo(
    () => extractSnackIdentifierFromSnackUrl(snackUrl),
    [snackUrl],
  );
  const isEphemeralSnack = useMemo(
    () => isEphemeralSnackUrl(snackUrl),
    [snackUrl],
  );
  const canSave = useMemo(
    () => !isEphemeralSnack && snackIdentifier != null,
    [isEphemeralSnack, snackIdentifier],
  );
  const isSaved = useMemo(
    () => snackIdentifier != null && savedSnackIds.has(snackIdentifier),
    [snackIdentifier, savedSnackIds],
  );
  const [isSnackLoading, setIsSnackLoading] = React.useState<boolean>(false);
  const {showSnackbar} = useSnackbar();
  const saveDemoItemConfig = useMemo<BottomSheetItemConfig[]>(() => {
    if (!canSave) {
      return [];
    }
    return [
      {
        label: isSaved ? 'Remove from Saved Demos' : 'Save Demo',
        icon: isSaved ? 'SAVED' : 'SAVE',
        onPress: isSaved
          ? () => {
              if (snackIdentifier != null) {
                deleteSavedSnackId(snackIdentifier);
                showSnackbar('Removed from Saved demos');
              }
            }
          : () => {
              if (snackIdentifier != null) {
                saveSnackId(snackIdentifier);
                showSnackbar('Demo saved', 'SAVED');
              }
            },
      },
    ];
  }, [
    canSave,
    isSaved,
    saveSnackId,
    deleteSavedSnackId,
    snackIdentifier,
    showSnackbar,
  ]);
  useEffect(() => {
    if (snackIdentifier != null && !isEphemeralSnack) {
      markSnackIdRecent(snackIdentifier);
    }
  }, [snackIdentifier, isEphemeralSnack, markSnackIdRecent]);

  const bottomSheetRef = useRef<PTLBottomSheetRef>(null);
  useNativeEvent('onTwoFingerLongPress', bottomSheetRef.current?.present);

  // React Navigation renders all screens in advance,
  // we only want to render the Snack when it needs to be rendered.
  const isFocused = useIsFocused();
  if (!isFocused) {
    return null;
  }

  return (
    <View style={styles.container}>
      {snackUrl ? (
        <>
          <SnackRuntime
            snackUrl={snackUrl}
            onSnackReload={async () => {
              Alert.alert(
                'Unsupported Operation',
                'Reloading the app from the Expo Snack editor is not supported',
              );
            }}
            onSnackState={state => {
              setIsSnackLoading(state === 'loading');
            }}
          />
          <PTLBottomSheet
            ref={bottomSheetRef}
            items={[
              {
                label: 'Share',
                icon: 'SHARE',
                onPress: async () => {
                  if (snackIdentifier != null) {
                    await shareSnack(snackIdentifier);
                  }
                },
              },
              ...saveDemoItemConfig,
              {
                label: 'Exit Demo',
                icon: 'EXIT',
                onPress: () => navigation.goBack(),
              },
            ]}
          />
          {isSnackLoading && (
            <FullScreenLoading style={styles.loadingScreen} text="Loading" />
          )}
        </>
      ) : (
        <>
          <Text style={iconStyle}>🔗</Text>
          <Paragraph style={paragraphStyle}>
            Snack URL is required to show a Snack
          </Paragraph>
          <Button onPress={navigation.goBack}>Go back</Button>
        </>
      )}
      <FullScreenEduInterstitial />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingScreen: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
});
