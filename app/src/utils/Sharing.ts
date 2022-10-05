/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @oncall playtorch
 */

import {useCallback} from 'react';
import {Share} from 'react-native';
import ExternalLinks from '../constants/ExternalLinks';

type ShareSnackFunction = (snackIdentifier: string) => Promise<void>;

export function useShareSnack(): ShareSnackFunction {
  return useCallback(async (snackIdentifier: string): Promise<void> => {
    const shareUrl = ExternalLinks.snackWrapperLink(snackIdentifier);
    try {
      await Share.share({
        message: shareUrl,
      });
    } catch (error: any) {
      console.error(error.message);
    }
  }, []);
}
