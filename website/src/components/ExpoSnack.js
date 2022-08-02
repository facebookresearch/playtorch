/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import React, {useEffect, useRef} from 'react';
import clsx from 'clsx';
import {useThemeConfig} from '@docusaurus/theme-common';
import styles from './ExpoSnack.module.css';

/**
 * Embeds an Expo Snack with contents from snack id. It requires the
 * "https://snack.expo.dev/embed.js" script to be loaded for the Expo Snack
 * embed to work (see scripts property in the docusaurus.config.js)
 *
 * More details about Expo Snack attributes:
 * https://github.com/expo/snack/blob/main/docs/embedding-snacks.md
 */
export default function ExpoSnack({snackPreview = true, snackId, snackStyle}) {
  const {isDarkTheme} = useThemeConfig();
  const snackContainerRef = useRef(null);
  // This is a workaround to initialize Expo Snacks when navigating between
  // different tutorials as well as switching between light and dark mode
  // themes
  useEffect(() => {
    const snackContainer = snackContainerRef.current;
    if (snackContainer !== null && window.ExpoSnack != null) {
      window.ExpoSnack.remove(snackContainer);
      window.ExpoSnack.append(snackContainer);
    }
  }, [isDarkTheme]);
  return (
    <div
      ref={snackContainerRef}
      className={clsx([styles.expoSnack, snackStyle])}
      data-snack-id={snackId}
      data-snack-loading="lazy"
      data-snack-platform="mydevice"
      data-snack-preview={snackPreview}
      data-snack-sdkversion="44.0.0"
      data-snack-supported-platforms="mydevice"
      data-snack-theme={isDarkTheme ? 'dark' : 'light'}
    />
  );
}
