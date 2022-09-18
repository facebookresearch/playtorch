/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import React from 'react';
import styles from './GithubButton.module.css';
import GitHubButton from 'react-github-btn';

export default function PlayTorchGithubButton() {
  return (
    <div className={styles.githubButton}>
      <GitHubButton
        data-show-count={true}
        data-size="large"
        href="https://github.com/facebookresearch/playtorch">
        Stars
      </GitHubButton>
    </div>
  );
}
