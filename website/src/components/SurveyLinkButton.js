/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import React from 'react';
import styles from './SurveyLinkButton.module.css';

export default function SurveyLinkButton({docTitle}) {
  /*
   * TODO: T106994597
   * We don't use docTitle yet, but if we can figure out a way to seed the GitHub form
   * It will be nice to have them all ready go to
   */
  const surveyUrl =
    'https://github.com/pytorch/live/issues/new?assignees=&labels=Tutorial+Feedback&template=tutorial_feedback.yml';
  return (
    <a href={surveyUrl} target="_blank">
      <div className={styles.surveyLinkBox}>Share what we can improve!</div>
    </a>
  );
}
