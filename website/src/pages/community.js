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
import Layout from '@theme/Layout';
import styles from './community.module.css';

function Card({thumbnail, title, children}) {
  const imgUrl = thumbnail
    ? require(`@site/static/img/${thumbnail}`).default
    : require(`@site/static/img/default_card.png`).default;
  return (
    <div className={styles.showCard}>
      <div
        className={styles.cardThumbnail}
        style={{backgroundImage: `url(${imgUrl})`}}
      />
      <div className={styles.cardContent}>
        <h4 className={styles.cardTitle}>{title}</h4>
        <p>{children}</p>
      </div>
    </div>
  );
}

function SocialIcon({name, color = 'white'}) {
  const iconUrl = require(`@site/static/img/icon_${name}_${color}.png`).default;
  return <img className={styles.socialIcon} src={iconUrl} />;
}

function Community() {
  const graphicUrl = require('@site/static/img/community_network.png').default;
  return (
    <Layout title="Community" wrapperClassName="gradient-background">
      <div className={clsx(styles.heroBanner)}>
        <div className="container">
          <div className={clsx(['row', styles.headRow])}>
            <div className={clsx(['col', 'col--6', styles.headContent])}>
              <div>
                <h1 className={styles.title}>Community</h1>
                <div className={styles.subtitle}>
                  Let's unlock the vast potential of AI innovations together
                </div>
                <div className={styles.social}>
                  <SocialIcon name="discord" />
                  <SocialIcon name="github" />
                  <SocialIcon name="twitter" />
                </div>
              </div>
            </div>
            <div className="col col--6">
              <div
                className={styles.graphic}
                style={{backgroundImage: `url(${graphicUrl})`}}
              />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.showcase}>
        <div className={clsx(['container', 'margin-bottom--xl'])}>
          <div className="row">
            <div className="col col--8 col--offset-2">
              <h2 className={styles.showcaseTitle}>Join our community</h2>
              <p className={styles.showcaseInfo}>
                PlayTorch is in beta and we invite you to join us in our social
                channels. <br />
                Share what you have made, tell us what you need, and help us
                improve PlayTorch.
              </p>
            </div>
          </div>

          <div className="row">
            <div className="col col--4">
              <Card title="{Your demo}">
                This tile is reserved for you! Share your demos to be included
                in this page by{' '}
                <a href="https://github.com/facebookresearch/playtorch/issues/new?assignees=&labels=Use%20Case&template=use_case.yml">
                  submitting an issue
                </a>{' '}
                on Github.
              </Card>
            </div>
            <div className="col col--4">
              <Card thumbnail="social_card1.jpg" title="Join the conversation">
                Share with #playtorch on{' '}
                <a href="https://twitter.com/playtorch">Twitter</a> and{' '}
                <a href="https://stackoverflow.com/questions/tagged/playtorch">
                  Stack Overflow
                </a>
                . Join our <a href="https://discord.gg/sQkXTqEt33">Discord</a>{' '}
                community to chat.
              </Card>
            </div>
            <div className="col col--4">
              <Card thumbnail="social_card2.jpg" title="Find us on Github">
                File issues, send pull-requests, and check out the latest
                features on{' '}
                <a href="https://github.com/facebookresearch/playtorch/">
                  GitHub
                </a>
                .
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Community;
