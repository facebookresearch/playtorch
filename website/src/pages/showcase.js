/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import React from 'react';
import Layout from '@theme/Layout';
import styles from './showcase.module.css';

function Showcase() {
  return (
    <Layout title="Showcase">
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh',
          fontSize: '20px',
        }}>
        <p className={styles.showcase}>
          This is a placeholder for the PyTorch Live Showcase
        </p>
      </div>
    </Layout>
  );
}

export default Showcase;
