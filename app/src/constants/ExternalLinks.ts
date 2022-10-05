/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @oncall playtorch
 */

import {Platform} from 'react-native';

const BASE_WEBSITE_URL = 'https://playtorch.dev';

const ExternalLinks = {
  BASE_WEBSITE_URL,
  DISCORD_URL: 'https://discord.gg/sQkXTqEt33',
  STARTER_SNACK_URL: 'snack.playtorch.dev',
  GITHUB_URL: 'https://github.com/facebookresearch/playtorch',
  TWITTER_URL: 'https://twitter.com/playtorch',
  PRIVACY_POLICY_URL: `${BASE_WEBSITE_URL}/app/privacy/policy`,
  TERMS_URL: `${BASE_WEBSITE_URL}/app/legal/terms`,
  THIRD_PARTY_URL: `${BASE_WEBSITE_URL}/app/third-party-notices-${Platform.OS}`,
  snackWrapperLink: (snackIdentifier: string) =>
    `${BASE_WEBSITE_URL}/snack/${snackIdentifier}`,
  exampleWrapperLink: (exampleSlug: string) =>
    `${BASE_WEBSITE_URL}/example/${exampleSlug}`,
};

export default ExternalLinks;
