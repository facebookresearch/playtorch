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
    if (window) {
      window.location.replace(to);
    }
  }, [to]);

  return (
    <div className="container">
      <div className="row">
        <div className="col col--10 col--offset--1">
          <p>Redirecting...</p>
          <p>
            Click <a href={to}>here</a> if you are not automatically redirected
            to <a href={to}>{to}</a>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function BrowserOnlyRedirect({to}) {
  return <BrowserOnly>{() => <ExternalRedirect to={to} />}</BrowserOnly>;
}
