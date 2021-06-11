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
    <div className={clsx('col col--3')}>
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
      </div>
    </section>
  );
}

//<Svg className={styles.featureSvg} alt={title} />
