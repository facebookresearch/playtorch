/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @oncall playtorch
 */

import {useNavigation} from '@react-navigation/native';
import * as React from 'react';
import {ReactElement, useEffect, useMemo, useRef, useState} from 'react';
import {StyleSheet} from 'react-native';
import {createSnackUrlFromSnackIdentifier} from 'snack-runtime';
import useSnackIdCache from '../../cache/useSnackIDCache';
import PTLBottomSheet, {
  PTLBottomSheetRef,
} from '../../components/bottom-sheet/PTLBottomSheet';
import {BottomSheetItemConfig} from '../../components/bottom-sheet/PTLBottomSheetItem';
import RadioPillGroup from '../../components/RadioPillGroup';
import {useSnackbar} from '../../providers/Snackbar';
import {RadioOption} from '../../types/radio';
import {useShareSnack} from '../../utils/Sharing';
import DemosGrid from './DemosGrid';

type DemoCategory = 'Saved' | 'Recently Viewed';

const SavedDemosRadioOption: RadioOption<DemoCategory> = {
  label: 'Saved',
  value: 'Saved',
};
const RecentlyViewedDemosRadioOption: RadioOption<DemoCategory> = {
  label: 'Recently Viewed',
  value: 'Recently Viewed',
};

export default function MyDemosSection(): ReactElement {
  const navigation = useNavigation();
  const shareSnack = useShareSnack();
  const {
    savedSnackIds,
    recentSnackIds,
    deleteSavedSnackId,
    saveSnackId,
    removeSnackIdFromRecent,
  } = useSnackIdCache();
  const radioOptions = useMemo(
    () => [
      ...(recentSnackIds.length > 0 ? [RecentlyViewedDemosRadioOption] : []),
      ...(savedSnackIds.size > 0 ? [SavedDemosRadioOption] : []),
    ],
    [savedSnackIds, recentSnackIds],
  );
  const defaultCategory = useMemo(() => {
    if (radioOptions.length <= 0) {
      return 'Recently Viewed';
    } else {
      return radioOptions[0].value;
    }
  }, [radioOptions]);
  const [selectedDemoCategory, setSelectedDemoCategory] =
    useState<DemoCategory>(defaultCategory);

  const bottomSheetRef = useRef<PTLBottomSheetRef>(null);
  const [bottomSheetMenuItems, setBottomSheetMenuItems] = useState<
    BottomSheetItemConfig[]
  >([]);
  const {showSnackbar} = useSnackbar();
  useEffect(() => {
    if (bottomSheetMenuItems.length > 0) {
      bottomSheetRef.current?.present();
    }
  }, [bottomSheetMenuItems, bottomSheetRef]);

  return (
    <>
      {radioOptions.length > 1 && (
        <RadioPillGroup<DemoCategory>
          style={styles.categoriesRadioGroup}
          options={radioOptions}
          selected={selectedDemoCategory}
          onSelect={setSelectedDemoCategory}
        />
      )}
      <DemosGrid
        snackIdentifiers={
          selectedDemoCategory === 'Recently Viewed'
            ? recentSnackIds
            : [...savedSnackIds]
        }
        openSnack={snackIdentifier =>
          navigation.navigate('Snack', {
            snackUrl: createSnackUrlFromSnackIdentifier(snackIdentifier),
          })
        }
        openMenu={snackIdentifier => {
          const isSaved = savedSnackIds.has(snackIdentifier);
          const menuItems: BottomSheetItemConfig[] = [
            {
              icon: 'SHARE',
              label: 'Share',
              onPress: async () => {
                await shareSnack(snackIdentifier);
              },
            },
            {
              icon: isSaved ? 'SAVED' : 'SAVE',
              label: isSaved ? 'Remove from Saved demos' : 'Save',
              onPress: () => {
                if (isSaved) {
                  deleteSavedSnackId(snackIdentifier);
                  showSnackbar('Removed from Saved demos');
                } else {
                  saveSnackId(snackIdentifier);
                  showSnackbar('Demo saved', 'SAVED');
                }
              },
            },
          ];
          if (selectedDemoCategory === 'Recently Viewed') {
            menuItems.push({
              icon: 'DELETE',
              label: 'Remove from Recently Viewed demos',
              onPress: () => {
                removeSnackIdFromRecent(snackIdentifier);
                showSnackbar('Removed from Recently Viewed demos');
              },
            });
          }
          setBottomSheetMenuItems(menuItems);
        }}
      />
      <PTLBottomSheet
        ref={bottomSheetRef}
        items={bottomSheetMenuItems}
        onDismiss={() => setBottomSheetMenuItems([])}
      />
    </>
  );
}

const styles = StyleSheet.create({
  categoriesRadioGroup: {
    marginBottom: 32,
  },
});
