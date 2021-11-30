/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import styles from './SurveyLinkButton.module.css';

export default function SurveyLinkButton({docTitle}) {
  const surveyUrl = `https://docs.google.com/forms/d/e/1FAIpQLScsB21xJWM_VANad5GcVkQqKB_BptS77axbunzs7ZkwoE5JUw/viewform?usp=pp_url&entry.1880917601=${docTitle.replace(
    /\s/g,
    '+',
  )}`;
  return (
    <a href={surveyUrl} target="_blank">
      <div className={styles.surveyLinkBox}>Share what we can improve!</div>
    </a>
  );
}
