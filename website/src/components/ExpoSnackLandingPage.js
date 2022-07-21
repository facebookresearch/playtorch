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
import AppleLogoSvg from '@site/static/img/apple_logo_white.svg';
import AndroidLogoSvg from '@site/static/img/android_logo_white.svg';
import {GOOGLE_PLAY_STORE, APP_STORE} from '@site/src/constants/ExternalLinks';

function AppStoreButton({href, LogoComponent, label}) {
  return (
    <a className="button button--primary margin--xs" href={href}>
      <div className={clsx(styles.appStoreButtonContainer)}>
        <LogoComponent className={clsx(styles.appStoreLogo)} />
        <div className={clsx(styles.appStoreButtonText)}>{label}</div>
      </div>
    </a>
  );
}

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
                  <p className="margin-bottom--sm">Already have the app?</p>
                  <a
                    className="button button--primary margin--xs"
                    href={`playtorch://snack?snackUrl=exp://exp.host/${expoSnackPath}`}>
                    Open with PlayTorch
                  </a>
                </div>
                <div className="margin-top--lg">
                  <p className="margin-bottom--sm">
                    This snack requires the PlayTorch app to get started.
                  </p>
                  <AppStoreButton
                    href={APP_STORE}
                    LogoComponent={AppleLogoSvg}
                    label="Download PlayTorch for iOS"
                  />
                  <AppStoreButton
                    href={GOOGLE_PLAY_STORE}
                    LogoComponent={AndroidLogoSvg}
                    label="Download PlayTorch for Android"
                  />
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
