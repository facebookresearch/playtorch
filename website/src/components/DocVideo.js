/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import styles from './DocVideo.module.css';
import React, {useState} from 'react';
import clsx from 'clsx';

export default function DocVideo({
  asset,
  width = '100%',
  height = '100%',
  controls = true,
  style = {},
  loop,
  autoPlay,
  noMargin = false,
}) {
  return (
    <video
      className={clsx([styles.docVideo, noMargin ? styles.noMargin : ''])}
      style={style}
      muted
      controls={controls}
      loop={loop}
      autoPlay={autoPlay}
      width={width}
      height={height}>
      <source
        src={require(`@site/static/video/${asset}.mp4`).default}
        type="video/mp4"
      />
      <source
        src={require(`@site/static/video/${asset}.webm`).default}
        type="video/webm"
      />
      Sorry, your browser doesn't support embedded videos.
    </video>
  );
}
