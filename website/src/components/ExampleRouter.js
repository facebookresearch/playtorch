/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import React from 'react';
import {Switch, Route} from 'react-router-dom';
import ExampleLandingPage from './ExampleLandingPage';

export default function ExampleRouter({match}) {
  // match.url should be {baseUrl}/example
  return (
    <Switch>
      <Route path={`${match.url}/:slug`} component={ExampleLandingPage} />
      <Route component={ExampleLandingPage} />
    </Switch>
  );
}
