/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import Head from '@docusaurus/Head';
import * as React from 'react';
import {useEffect} from 'react';
import LandingPageHeader from './LandingPageHeader';

function RedirectToNotFound({history}) {
  useEffect(() => {
    // This is a hack to show the "Page Not Found" screen when an invalid example slug is provided
    // or no slug is provided. This page doesn't exist, so docusaurus will show the generic not found page.
    history.replace('/example-not-found');
  }, [history]);
  return null;
}

export default function ExampleLandingPage({match, history}) {
  const {slug} = match.params;

  // TODO: Show "Not Found" page if slug doesn't match known examples
  if (slug == null || slug.length === 0) {
    return <RedirectToNotFound history={history} />;
  }

  return (
    <div>
      <Head title={`${slug} | PlayTorch Example`} />
      <LandingPageHeader
        heroTitle={slug}
        nameOfSharedItem="example"
        urlToOpenInPlayTorch={`playtorch://example?example=${slug}`}
      />
    </div>
  );
}
