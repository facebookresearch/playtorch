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
import ExpoSnackLandingPage from './ExpoSnackLandingPage';

export default function ExpoSnackRouter({match}) {
  // match.url should be {baseUrl}/snack or {baseUrl}/expo
  return (
    <Switch>
      <Route
        path={`${match.url}/:expoSnackPath*`}
        component={ExpoSnackLandingPage}
      />
    </Switch>
  );
}
