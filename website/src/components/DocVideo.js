/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import styles from './DocVideo.module.css';
import React, {useRef, useEffect} from 'react';
import clsx from 'clsx';

export default function DocVideo({
  asset,
  width = '100%',
  height = '100%',
  controls = true,
  style = {},
  loop,
  autoPlay,
  muted = true,
  defaultMuted = true,
  playsInline = true,
  noMargin = false,
  poster,
}) {
  const videoRef = useRef(undefined);
  useEffect(() => {
    videoRef.current.muted = muted;
    videoRef.current.defaultMuted = defaultMuted;
    videoRef.current.playsInline = playsInline;
  }, [defaultMuted, muted, playsInline]);

  return (
    <video
      ref={videoRef}
      className={clsx([styles.docVideo, noMargin ? styles.noMargin : ''])}
      style={style}
      controls={controls}
      loop={loop}
      autoPlay={autoPlay}
      width={width}
      height={height}
      muted={muted}
      playsInline={playsInline}
      defaultMuted={defaultMuted}
      poster={poster ? require(`@site/static/img/${poster}`).default : null}>
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
