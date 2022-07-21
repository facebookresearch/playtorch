/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import React, {useState, useEffect} from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import styles from './index.module.css';
import DocVideo from '../components/DocVideo';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

import AppStoreBadge from '@site/static/img/download_on_the_app_store_badge.svg';
import GooglePlayBadgeUrl from '@site/static/img/google_play_badge.png';

function Row({
  content,
  button,
  video,
  odd,
  textOnly = false,
  head = false,
  tail = false,
  link,
}) {
  return (
    <div
      className={clsx([
        styles.contentRow,
        odd ? styles.odd : '',
        head ? styles.firstRow : '',
        tail ? styles.lastRow : '',
      ])}>
      <div className={clsx([styles.content])}>
        <div className={clsx([styles.message, head ? styles.heading : ''])}>
          {content}
        </div>
        <a className={clsx([styles.buttonWrapper])} href={link || '#'}>
          {button}
        </a>
      </div>
      <div className={clsx([styles.content])}>
        {!textOnly && <div className={styles.video}>{video}</div>}
      </div>
    </div>
  );
}

function AppStoreRow({
  content,
  video,
  odd,
  head = false,
  tail = false,
  appStoreLink,
  googlePlayLink,
}) {
  return (
    <div
      className={clsx([
        styles.contentRow,
        odd ? styles.odd : '',
        head ? styles.firstRow : '',
        tail ? styles.lastRow : '',
      ])}>
      <div className={clsx([styles.content])}>
        <div className={clsx([styles.message, head ? styles.heading : ''])}>
          {content}
        </div>
        <div className={clsx([styles.appStoreButtonRow])}>
          <a
            className={clsx([styles.googlePlayButtonWrapper])}
            href={googlePlayLink || '#'}>
            <img
              className={clsx([styles.googlePlayBadge])}
              alt="Google Play Badge"
              src={GooglePlayBadgeUrl}
            />
          </a>
          <a
            className={clsx([styles.appStoreButtonWrapper])}
            href={appStoreLink || '#'}>
            <AppStoreBadge
              className={clsx([styles.appStoreBadge])}
              title="Download on the App Store Badge"
              role="img"
            />
          </a>
        </div>
      </div>
      <div className={clsx([styles.content])}>
        <div className={styles.video}>{video}</div>
      </div>
    </div>
  );
}

function WideRow({content, video, head = false, tail = false}) {
  return (
    <div
      className={clsx([
        styles.wideContentRow,
        head ? styles.firstRow : '',
        tail ? styles.lastRow : '',
      ])}>
      <div className={clsx([styles.wideContent])}>
        <div className={clsx([styles.message, head ? styles.heading : ''])}>
          {content}
        </div>
      </div>
      <div className={clsx([styles.wideContent])}>
        <div className={styles.wideVideo}>{video}</div>
      </div>
    </div>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  const [balloonStyle, setBalloonStyle] = useState({});

  useEffect(() => {
    function updateBalloon(evt) {
      const rect = document.body.getBoundingClientRect();
      const height = document.body.scrollHeight - rect.height;
      const t = Math.abs(rect.top) / height;
      const size = Math.sin(Math.PI * (0.5 - Math.abs(t - 0.5))) * 300;
      setBalloonStyle({
        width: `${size}vh`,
        height: `${size}vh`,
        top: `${50 - size / 2}vh`,
        right: `${-size / 2}vh`,
        borderRadius: `${size}vh`,
        filter: `blur(${t < 0.25 ? (0.25 - t) * 4 * 30 : 0}px)`,
        opacity: t > 0.5 ? (1 - (t - 0.5) * 2) * 0.8 : 0.8,
      });
    }

    let ticking = false;
    function scrollHandler(evt) {
      if (!ticking) {
        requestAnimationFrame(function () {
          updateBalloon(evt);
          ticking = false;
        });
        ticking = true;
      }
    }

    document.addEventListener('scroll', scrollHandler, {passive: true});
    return () => {
      document.removeEventListener('scroll', scrollHandler, {passive: true});
    };
  }, [setBalloonStyle]);

  const heroVideo = (
    <DocVideo
      asset="PlayTorch_View_Demo"
      noMargin={true}
      autoPlay={true}
      loop={true}
      controls={false}
      poster="PlayTorch_View_Demo.jpg"
    />
  );
  const heroContent = (
    <div>Build your AI powered mobile prototypes in minutes</div>
  );

  const firstPropVideo = (
    <DocVideo
      asset="PlayTorch_Video"
      noMargin={true}
      noMaxWidth={true}
      controls={true}
      muted={false}
      defaultMuted={false}
      poster="PlayTorch_Video.jpg"
    />
  );
  const firstPropContent = 'How it works';

  const secondPropVideo = (
    <DocVideo
      asset="PlayTorch_AnimeGan"
      noMargin={true}
      autoPlay={true}
      loop={true}
      controls={false}
      poster="PlayTorch_AnimeGAN.jpg"
    />
  );
  const secondPropContent =
    'Easily integrate on-device vision and language models into your apps';
  const secondPropButton = (
    <div className={styles.button}>Check out the API</div>
  );

  const thirdPropVideo = (
    <DocVideo
      asset="PlayTorch_QA"
      noMargin={true}
      autoPlay={true}
      loop={true}
      controls={false}
      poster="PlayTorch_QA.jpg"
    />
  );
  const thirdPropContent =
    'Build cross-platform mobile apps with PyTorch and React Native';
  const thirdPropButton = (
    <div className={styles.button}>Try our tutorials</div>
  );

  const forthPropVideo = (
    <DocVideo
      asset="PlayTorch_Overview"
      noMargin={true}
      autoPlay={true}
      loop={true}
      controls={false}
      poster="PlayTorch_Overview.jpg"
    />
  );
  const forthPropContent =
    "Join our community of AI researchers, mobile developers and hackers. Let's unlock the vast potential of AI innovations together.";
  const forthPropButton = (
    <div className={styles.button}>Join our community</div>
  );

  return (
    <Layout wrapperClassName="gradient-background">
      <div className={styles.balloon} style={balloonStyle} />
      <main>
        <div className="container">
          <AppStoreRow
            content={heroContent}
            video={heroVideo}
            odd={false}
            head={true}
            appStoreLink={siteConfig.customFields.appStoreUrl}
            googlePlayLink={siteConfig.customFields.googlePlayUrl}
          />

          <WideRow content={firstPropContent} video={firstPropVideo} />

          <Row
            content={secondPropContent}
            video={secondPropVideo}
            button={secondPropButton}
            odd={false}
            link="docs/api/core"
          />

          <Row
            content={thirdPropContent}
            video={thirdPropVideo}
            button={thirdPropButton}
            odd={true}
            link="docs/tutorials/mnist-digit-classification"
          />

          <Row
            content={forthPropContent}
            video={forthPropVideo}
            button={forthPropButton}
            odd={false}
            tail={true}
            link="community"
          />
        </div>
      </main>
    </Layout>
  );
}
