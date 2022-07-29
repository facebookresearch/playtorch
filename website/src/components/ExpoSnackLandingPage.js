/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import React from 'react';
import clsx from 'clsx';
import ExpoSnack from '@site/src/components/ExpoSnack';
import styles from './ExpoSnackLandingPage.module.css';
import RedirectStarterSnack from './RedirectStarterSnack';
import LandingPageHeader from './LandingPageHeader';

export default function ExpoSnackLandingPage({match}) {
  const {expoSnackPath} = match.params;

  if (expoSnackPath == null || expoSnackPath.length === 0) {
    return <RedirectStarterSnack />;
  }

  return (
    <div>
      <LandingPageHeader expoSnackPath={expoSnackPath} />
      <div className={clsx(styles.expoSnackContainer)}>
        <ExpoSnack snackPreview={false} snackId={expoSnackPath} />
      </div>
    </div>
  );
}
