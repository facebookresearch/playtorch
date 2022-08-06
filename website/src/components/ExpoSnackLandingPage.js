/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import Head from '@docusaurus/Head';
import ExpoSnack from '@site/src/components/ExpoSnack';
import clsx from 'clsx';
import * as React from 'react';
import styles from './ExpoSnackLandingPage.module.css';
import LandingPageHeader from './LandingPageHeader';
import RedirectStarterSnack from './RedirectStarterSnack';

export default function ExpoSnackLandingPage({match}) {
  const {expoSnackPath} = match.params;

  if (expoSnackPath == null || expoSnackPath.length === 0) {
    return <RedirectStarterSnack />;
  }

  return (
    <div>
      <Head title={`${expoSnackPath} | PlayTorch Snack`} />
      <LandingPageHeader
        heroTitle={expoSnackPath}
        nameOfSharedItem="snack"
        urlToOpenInPlayTorch={`playtorch://snack?snackUrl=exp://exp.host/${expoSnackPath}`}
      />
      <div className={clsx(styles.expoSnackContainer)}>
        <ExpoSnack snackPreview={false} snackId={expoSnackPath} />
      </div>
    </div>
  );
}
