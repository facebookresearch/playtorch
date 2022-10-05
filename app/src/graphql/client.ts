/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @oncall playtorch
 */

import {ApolloClient, InMemoryCache} from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://api.expo.dev/graphql',
  cache: new InMemoryCache(),
});

export default client;
