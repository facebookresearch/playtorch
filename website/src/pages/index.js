/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {FbInternalOnly} from 'internaldocs-fb-helpers';
import styles from './index.module.css';
import HomepageFeatures from '../components/HomepageFeatures';
import DocVideo from '../components/DocVideo';
import {InternalCTAButton} from '../fb/FBInternalComponents';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <div>
          <Link className="hero__cta" to="/docs/tutorials/get-started">Try our latest build</Link>
          <FbInternalOnly>
            <InternalCTAButton cls="hero__cta" />
          </FbInternalOnly>
        </div>
      </div>
      <div className="hero__video">
        <DocVideo asset="demo_catdog" style={{margin: 0}} autoPlay={true} loop={true} controls={false} />
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`PyTorch Live`}
      description={`${siteConfig.title}`}>
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>

    </Layout>
  );
}
