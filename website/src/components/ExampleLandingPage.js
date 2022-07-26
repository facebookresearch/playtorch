/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import React from 'react';
import {useEffect} from 'react';
import clsx from 'clsx';
import styles from './ExampleLandingPage.module.css';
import AppleLogoSvg from '@site/static/img/apple_logo_white.svg';
import AndroidLogoSvg from '@site/static/img/android_logo_white.svg';
import ExternalLinks from '@site/src/constants/ExternalLinks';

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

function RedirectToNotFound({history}) {
  useEffect(() => {
    // This is a hack to show the "Page Not Found" screen when an invalid example slug is provided
    // or no slug is provided. This page doesn't exist, so docusaurus will show the generic not found page.
    history.replace('/example-not-found');
  }, [history]);
  return null;
}

export default function ExampleLandingPage({match, history}) {
  const {slug} = match.params;

  // TODO: Show "Not Found" page if slug doesn't match known examples
  if (slug == null || slug.length === 0) {
    return <RedirectToNotFound history={history} />;
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
                    href={`playtorch://example?example=${slug}`}>
                    Open Example with PlayTorch
                  </a>
                </div>
                <div className="margin-top--lg">
                  <p className="margin-bottom--sm">
                    This example requires the PlayTorch app to get started.
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
      </div>
    </div>
  );
}
