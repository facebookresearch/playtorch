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
import styles from './ExpoSnackRouter.module.css';
import RedirectStarterSnack from './RedirectStarterSnack';

export default function ExpoSnackLandingPage({match}) {
  const {expoSnackPath} = match.params;

  if (expoSnackPath == null || expoSnackPath.length === 0) {
    return <RedirectStarterSnack />;
  }

  return (
    <div className={clsx(styles.container)}>
      <div className={clsx(styles.infoView)}>
        <div className="row">
          <div className="col col--10 col--offset--1">
            <div className="hero shadow--lw">
              <div className="container">
                <h1 className="hero__title">PlayTorch</h1>
                <p className="hero__subtitle">
                  PlayTorch is a framework for rapidly creating cross-platform
                  mobile AI experiences.
                </p>
                <div>
                  <a
                    className="button button--primary margin--xs"
                    href={`playtorch://snack?snackUrl=exp://exp.host/${expoSnackPath}`}>
                    Open with PlayTorch
                  </a>
                  <a
                    className="button button--primary button--outline margin--xs"
                    href="https://play.google.com/store/apps/details?id=dev.playtorch">
                    Download PlayTorch for Android
                  </a>
                  <a
                    className="button button--primary button--outline margin--xs"
                    href="https://[TODO ADD URL]">
                    Download PlayTorch for iOS
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={clsx(styles.expoSnackContainer)}>
        <ExpoSnack
          snackPreview={false}
          snackId={expoSnackPath}
          snackStyle={clsx(styles.expoSnack)}
        />
      </div>
    </div>
  );
}
