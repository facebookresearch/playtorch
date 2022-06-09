/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import * as React from 'react';
import styles from './ForkSnackButton.module.css';

export default function ForkSnackButton({
  snackIdentifier,
  label = 'Click to Copy Starter Snack',
}) {
  return (
    <a
      href={`https://snack.expo.dev/${snackIdentifier}?supportedPlatforms=my-device`}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.forkSnackButton}>
      {label}
    </a>
  );
}
