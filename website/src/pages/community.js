/**
 * Copyright (c) Facebook, Inc. and its affiliates.
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
    : require(`@site/static/img/default_card.jpg`).default;
  return (
    <div className={styles.showCard}>
      <div
        className={styles.cardThumbnail}
        style={{backgroundImage: `url(${imgUrl})`}}></div>
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
    <Layout title="Community">
      <div className={clsx('hero--primary', styles.heroBanner)}>
        <div className="container">
          <div className="row">
            <div className="col col--6">
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
            <div className="col col--6">
              <div
                className={styles.graphic}
                style={{backgroundImage: `url(${graphicUrl})`}}></div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.showcase}>
        <div className={clsx(['container', 'margin-bottom--l'])}>
          <div className="row">
            <div className="col col--12">
              <h2>Community Showcase</h2>
              <p className={styles.showcaseInfo}>
                Share what you have made with us. Create a PR in GitHub or fill
                out <a href="#">this form</a>. <br />
                Here is a selection of PyTorch Live demos created by us and the
                community.
              </p>
            </div>
          </div>

          <div className="row">
            <div className="col col--4">
              <Card title="Mario and Luigi">
                Roman finetuned the MobileNetV3 model to identify Nintendo
                characters.
              </Card>
            </div>

            <div className="col col--4">
              <Card title="Peach">
                William finetuned the MobileNetV3 model to identify fruits
              </Card>
            </div>

            <div className="col col--4">
              <Card title="Show us what you've made">
                Submit your PyTorch Live demo to be included here. Send a{' '}
                <a href="https://github.com/pytorch/live/" target="_blank">
                  pull request on GitHub.
                </a>
              </Card>
            </div>
          </div>
          <div className={clsx(['row', styles.lastRow])}>
            <div className="col col--4 col--offset-2">
              <Card
                thumbnail="social_card1.jpg"
                title="Join us in our social channels">
                Engage in conversations and share what you’ve made. Add{' '}
                <a
                  href="https://twitter.com/search?q=%23pytorchlive"
                  target="_blank">
                  #pytorchlive
                </a>{' '}
                hashtag on Twitter, and join our <a href="#">Discord</a>{' '}
                channels.
              </Card>
            </div>

            <div className="col col--4">
              <Card thumbnail="social_card2.jpg" title="Find us on Github">
                File issues, send pull-requests, and check out the latest
                features on{' '}
                <a href="https://github.com/pytorch/live/" target="_blank">
                  GitHub
                </a>
                . You can also submit a PR to request your demos to be included
                in our showcase.
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Community;
