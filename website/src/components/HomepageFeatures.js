/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import styles from './HomepageFeatures.module.css';
import useBaseUrl from '@docusaurus/useBaseUrl';

const FeatureList = [
  {
    title: (
      <>
        PyTorch Live helps you build mobile AI experiences in just a few minutes.
      </>
    ),
    description: 'Get started',
  },
  {
    title: (
      <>
        Use React Native templates to quickly build visual, interactive UI.
      </>
    ),
    description: 'Tutorials',
  },
  {
    title: (
      <>
        Easily integrate open source, mobile ML models into your projects.
      </>
    ),
    description: 'API',
  },
];

function Feature({title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center padding-horiz--md">
        <p className="p__value_props">{title}</p>
        <div className={styles.button}>
          <Link
            className="button button--outline button--lg"
            to="/docs/tutorials/install-cli">
            {description}
          </Link>
        </div>
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
        <HomepageVisual />
      </div>
    </section>
  );
}

function HomepageCLIDemoVideo() {
  const imgSrc = useBaseUrl('../../static/img/cli.gif');
  return <img src={imgSrc} alt="PyTorch Live demo video" />;
};

export function HomepageVisual() {
  return (
    <div className="col padding-top--xl">
      <HomepageCLIDemoVideo />
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

//
