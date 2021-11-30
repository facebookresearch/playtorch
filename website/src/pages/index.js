/**
 * Copyright (c) Facebook, Inc. and its affiliates.
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

export default function Home() {
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
      asset="demo_catdog"
      noMargin={true}
      autoPlay={true}
      loop={true}
      controls={false}
      poster="demo_catdog.jpg"
    />
  );
  const heroContent = (
    <div>
      <div className={styles.titleWrapper}>
        <h1 className={styles.title}>PyTorch&nbsp;&nbsp;Live</h1>
        <div className={styles.beta}>BETA</div>
      </div>
      <div>Build your AI-powered mobile apps in minutes</div>
    </div>
  );
  const heroButton = <div className={styles.button}>Get Started</div>;

  const firstPropVideo = (
    <DocVideo
      asset="demo_mnist"
      noMargin={true}
      autoPlay={true}
      loop={true}
      controls={false}
      poster="demo_mnist.jpg"
    />
  );
  const firstPropContent =
    'Quickly set up your dev environment and bootstrap ML mobile app projects';
  const firstPropButton = (
    <div className={styles.button}>Run CLI setup tool</div>
  );

  const secondPropVideo = (
    <DocVideo
      asset="demo_model"
      noMargin={true}
      autoPlay={true}
      loop={true}
      controls={false}
      poster="demo_model.jpg"
    />
  );
  const secondPropContent =
    'Easily integrate on-device vision and language models into your apps';
  const secondPropButton = (
    <div className={styles.button}>Check out the API</div>
  );

  const thirdPropVideo = (
    <DocVideo
      asset="demo_ui"
      noMargin={true}
      autoPlay={true}
      loop={true}
      controls={false}
      poster="demo_ui.jpg"
    />
  );
  const thirdPropContent =
    'Build cross-platform mobile apps with PyTorch and React Native';
  const thirdPropButton = (
    <div className={styles.button}>Try our tutorials</div>
  );

  const forthPropVideo = (
    <DocVideo
      asset="demo_community"
      noMargin={true}
      autoPlay={true}
      loop={true}
      controls={false}
      poster="demo_community.jpg"
    />
  );
  const forthPropContent =
    "Join our community of AI researchers, mobile developers and hackers. Let's unlock the vast potential of AI innovations together.";
  const forthPropButton = (
    <div className={styles.button}>Join our community</div>
  );

  return (
    <Layout>
      <div className={styles.balloon} style={balloonStyle} />
      <main>
        <div className="container">
          <Row
            content={heroContent}
            video={heroVideo}
            button={heroButton}
            odd={false}
            head={true}
            link="docs/tutorials/get-started"
          />

          <Row
            content={firstPropContent}
            video={firstPropVideo}
            button={firstPropButton}
            odd={true}
            link="docs/tutorials/get-started"
          />

          <Row
            content={secondPropContent}
            video={secondPropVideo}
            button={secondPropButton}
            odd={false}
            link="docs/tutorials/prepare-custom-model"
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
