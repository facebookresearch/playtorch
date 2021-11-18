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

function Community() {
  return (
    <Layout title="Community">
      <div className={clsx('hero--primary', styles.heroBanner)}>
        <h1 className={clsx('hero__title', styles.heroTitle)}>
          Let’s help each other and democratize AI together. Join our community.
        </h1>
        <div>
          <div className={styles.socialCard}>Join us on Discord</div>
          <div className={styles.socialCard}>Collaborate on GitHub</div>
          <div className={styles.socialCard}>Tag #pytorchlive on Twitter</div>
        </div>
      </div>
      <div className={styles.showcase}>
        <div className={clsx(['container', 'margin-bottom--xl'])}>
          <div className="row">
            <div className="col col--9">
              <h2>PyTorch Live Showcase</h2>
              <p className={styles.showcaseInfo}>
                Share what you have made with us. Create a PR in GitHub or fill
                out <a href="#">this form</a>. <br />
                Here is a selection of PyTorch Live demos created by us and the
                community.
              </p>

              <div className="row">
                <div className="col col--6">
                  <div className={styles.showCard}>
                    <div className={styles.cardThumbnail}></div>
                    <div className={styles.cardContent}>
                      <h4>Mario and Luigi</h4>
                      <p>
                        Roman finetuned the MobileNetV3 model to identify
                        Nintendo characters.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col col--6">
                  <div className={styles.showCard}>
                    <div className={styles.cardThumbnail}></div>
                    <div className={styles.cardContent}>
                      <h4>Peach</h4>
                      <p>
                        William finetuned the MobileNetV3 model to identify
                        fruits
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col col--6">
                  <div className={styles.showCard}>
                    <div className={styles.cardThumbnail}></div>
                    <div className={styles.cardContent}>
                      <h4>Wario</h4>
                      <p>
                        Clark created a style transfer model to turn your selfie
                        into Nintendo cartoon
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col col--6">
                  <div className={styles.showCard}>
                    <div className={styles.cardCTA}>
                      Show your PyTorch Live demo here. Send a{' '}
                      <a
                        href="https://github.com/pytorch/live/"
                        target="_blank">
                        pull request on GitHub
                      </a>
                      .
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col col--3">
              <h2>Join us in our social channels</h2>
              <p>
                Engage in conversations and share what you’ve made. Add{' '}
                <a
                  href="https://twitter.com/search?q=%23pytorchlive"
                  target="_blank">
                  #pytorchlive
                </a>{' '}
                hashtag on Twitter, and join our <a href="#">Discord</a>{' '}
                channels.
              </p>
              <h2>Find us on GitHub</h2>
              <p>
                File issues, send pull-requests, and check out the latest
                features on{' '}
                <a href="https://github.com/pytorch/live/" target="_blank">
                  GitHub
                </a>
                . You can also submit a PR to request your demos to be included
                in our showcase.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Community;
