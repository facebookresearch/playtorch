/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @oncall playtorch
 */

import {gql} from '@apollo/client';

export interface SnackMetadata {
  hashId: string;
  name: string;
  description: string;
  previewImage: string;
}

export interface SnackMetadataData {
  snack: {
    byHashId: SnackMetadata;
  };
}

export interface SnackMetadataVars {
  hashId: string;
}

const SnackMetadataQuery = gql`
  query SnackMetadata($hashId: ID!) {
    snack {
      byHashId(hashId: $hashId) {
        hashId
        name
        description
        previewImage
      }
    }
  }
`;

export default SnackMetadataQuery;
