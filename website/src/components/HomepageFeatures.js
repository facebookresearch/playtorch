/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import React from 'react';
import Link from '@docusaurus/Link';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';
import DocVideo from '../components/DocVideo';

const FeatureList = [
  {
    title: (
      <>
        PyTorch Live helps you build mobile AI experiences in just a few
        minutes.
      </>
    ),
    description: 'Get started now',
    to: '/docs/tutorials/get-started',
    video: 'demo_mnist',
  },
  {
    title: (
      <>Use React Native templates to quickly build visual, interactive UI.</>
    ),
    description: 'View our tutorials',
    to: '/docs/tutorials/image-classification',
    video: 'demo_ui',
  },
  {
    title: (
      <>Easily integrate open source, mobile ML models into your projects.</>
    ),
    description: 'Check out our API',
    to: '/docs/api/core',
    video: 'demo_model',
  },
];

function Feature({title, description, video, to}) {
  return (
    <div className={clsx('col col--4')}>
      <div className={styles.feature}>
        <p className={styles.featureText}>{title}</p>

        <div className={styles.featureVideo}>
          <DocVideo
            asset={video}
            className={styles.featureDocVideo}
            autoPlay={true}
            loop={true}
            controls={false}
          />
        </div>

        <Link className={styles.featureButton} to={to}>
          {description}
        </Link>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

function HomepageHeroVideo() {
  return (
    <video
      controls={false}
      autoPlay={true}
      loop={true}
      muted={true}
      className="video__hero_video"
      alt="PyTorch Live demo video">
      <source
        src={require('@site/static/video/hero_video.webm').default}
        type="video/webm"
      />
      <source
        src={require('@site/static/video/hero_video.mp4').default}
        type="video/mp4"
      />
      Sorry, your browser doesn't support embedded videos.
    </video>
  );
}

export function HomepageVisual() {
  return (
    <div className="col padding-top--xl">
      <HomepageHeroVideo />
    </div>
  );
}

export function HomepageDemos() {
  return (
    <div className="container padding-top--lg">
      <div className="col center">
        <h1>Demos made with PyTorch Live</h1>
      </div>
      <div className="row">
        {FeatureList.map((props, idx) => (
          <Feature key={idx} {...props} />
        ))}
      </div>
    </div>
  );
}
