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
import styles from './AppStoreButtons.module.css';
import ExternalLinks from '@site/src/constants/ExternalLinks';
import AppStoreBadge from '@site/static/img/download_on_the_app_store_badge.svg';
import GooglePlayBadgeUrl from '@site/static/img/google_play_badge.png';

export function GooglePlayButton() {
  return (
    <a
      className={clsx([styles.googlePlayButtonWrapper])}
      href={ExternalLinks.GOOGLE_PLAY_STORE}>
      <img
        className={clsx([styles.googlePlayBadge])}
        alt="Google Play Badge"
        src={GooglePlayBadgeUrl}
      />
    </a>
  );
}

export function AppStoreButton() {
  return (
    <a
      className={clsx([styles.appStoreButtonWrapper])}
      href={ExternalLinks.APP_STORE}>
      <AppStoreBadge
        className={clsx([styles.appStoreBadge])}
        title="Download on the App Store Badge"
        role="img"
      />
    </a>
  );
}

export default function AppStoreButtons() {
  return (
    <div className={clsx([styles.appStoreButtonRow])}>
      <GooglePlayButton />
      <AppStoreButton />
    </div>
  );
}
