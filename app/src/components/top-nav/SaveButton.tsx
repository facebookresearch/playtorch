/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @oncall playtorch
 */

import React, {useCallback, useMemo} from 'react';
import {StyleSheet} from 'react-native';
import {extractSnackIdentifierFromSnackUrl} from 'snack-runtime';
import useSnackIdCache from '../../cache/useSnackIDCache';
import PTLIcon, {PTLIconNames} from '../icon/PTLIcon';
import Colors from '../../constants/Colors';

type Props = {
  snackUrl: string;
  tintColor?: string;
  pressColor?: string;
  pressOpacity?: number;
};

export default function SaveButton({snackUrl}: Props) {
  const snackIdentifier = useMemo(
    () => extractSnackIdentifierFromSnackUrl(snackUrl),
    [snackUrl],
  );
  const {savedSnackIds, saveSnackId, deleteSavedSnackId} = useSnackIdCache();
  const handleSaveClick = useCallback(() => {
    if (snackIdentifier) {
      if (savedSnackIds.has(snackIdentifier)) {
        deleteSavedSnackId(snackIdentifier);
      } else {
        saveSnackId(snackIdentifier);
      }
    }
  }, [snackIdentifier, saveSnackId, deleteSavedSnackId, savedSnackIds]);
  return (
    <PTLIcon
      name={
        snackIdentifier && savedSnackIds.has(snackIdentifier)
          ? PTLIconNames.SAVED
          : PTLIconNames.SAVE
      }
      onPress={handleSaveClick}
      style={styles.icon}
      size={24}
    />
  );
}

const styles = StyleSheet.create({
  icon: {
    color: Colors.WHITE,
  },
});
