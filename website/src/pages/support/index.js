/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import * as React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import styles from './styles.module.css';
import ExternalLinks from '@site/src/constants/ExternalLinks';

function SocialIcon({name, link, color = 'white'}) {
  const iconUrl = require(`@site/static/img/icon_${name}_${color}.png`).default;
  return (
    <a href={link} alt={`Link to ${name} to report PlayTorch app issues.`}>
      <div className={styles.socialIconButton}>
        <div className={styles.socialIconButtonInner}>
          <img className={styles.socialIcon} src={iconUrl} />
          <div className={styles.socialIconLabel}>Ask on {name}</div>
        </div>
      </div>
    </a>
  );
}

export default function Support() {
  return (
    <Layout title="Support" wrapperClassName="gradient-background">
      <div className={clsx(styles.heroBanner)}>
        <div className="container">
          <div className={clsx(['row', styles.headRow])}>
            <div
              className={clsx([
                'col',
                'col--8',
                'col--offset-2',
                styles.headContent,
              ])}>
              <div>
                <h1 className={styles.title}>How can we help?</h1>
                <div className={styles.subtitle}>
                  If you're running into problems, we want to help you figure
                  them out ASAP.
                </div>
                <div className={styles.social}>
                  <SocialIcon name="discord" link={ExternalLinks.DISCORD} />
                  <SocialIcon
                    name="github"
                    link={ExternalLinks.GITHUB_ISSUES}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
