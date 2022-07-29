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
import styles from './LandingPageHeader.module.css';
import ExternalLinks from '@site/src/constants/ExternalLinks';
import AppleLogoSvg from '@site/static/img/apple_logo_white.svg';
import AndroidLogoSvg from '@site/static/img/android_logo_white.svg';
import {getIsLikelyAndroidOrIOSDevice} from './MobileBrowserDetector';

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

export default function LandingPageHeader({expoSnackPath}) {
  const isLikelyAndroidOrIOSDevice = getIsLikelyAndroidOrIOSDevice();

  return (
    <div className="row">
      <div className="col col--10 col--offset--1">
        <div className="hero">
          <div className="container">
            <h1 className="hero__title">PlayTorch</h1>
            <p className="hero__subtitle">
              PlayTorch is a framework for rapidly creating cross-platform
              mobile AI experiences.
            </p>
            {isLikelyAndroidOrIOSDevice && (
              <div>
                <p className="margin-bottom--sm">Already have the app?</p>
                <a
                  className="button button--primary margin--xs"
                  href={`playtorch://snack?snackUrl=exp://exp.host/${expoSnackPath}`}>
                  Open with PlayTorch
                </a>
              </div>
            )}
            <div className="margin-top--lg">
              <p className="margin-bottom--sm">
                {isLikelyAndroidOrIOSDevice
                  ? 'This snack requires the PlayTorch app to get started.'
                  : 'This snack requires the PlayTorch app. Download the app and then open this page on your mobile device to get started.'}
              </p>
              <AppStoreButton
                href={ExternalLinks.APP_STORE}
                LogoComponent={AppleLogoSvg}
                label="Join the iOS Beta"
              />
              <AppStoreButton
                href={ExternalLinks.GOOGLE_PLAY_STORE}
                LogoComponent={AndroidLogoSvg}
                label="Download PlayTorch for Android"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
