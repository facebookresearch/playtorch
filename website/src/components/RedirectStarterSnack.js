/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import * as React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

function ExternalRedirect({to}) {
  React.useEffect(() => {
    window.location.href =
      'https://snack.expo.dev/@playtorch/playtorch-starter?supportedPlatforms=my-device';
  }, []);

  return null;
}

export default function RedirectStarterSnack() {
  return <BrowserOnly>{() => <ExternalRedirect />}</BrowserOnly>;
}
