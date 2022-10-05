/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @oncall playtorch
 */

import {useApolloClient} from '@apollo/client';
import {useEffect, useState} from 'react';
import SnackMetadataQuery, {
  SnackMetadataData,
  SnackMetadataVars,
} from '../graphql/queries/SnackMetadataQuery';

type StringMap = {[k: string]: string};

const hashIdMemoryCache: StringMap = {};

export async function getSnackHashIDFromIdentifier(
  snackIdentifier: string,
): Promise<string> {
  if (hashIdMemoryCache[snackIdentifier] != null) {
    return hashIdMemoryCache[snackIdentifier];
  }
  const res = await fetch(
    `https://exp.host/--/api/v2/snack/${snackIdentifier}`,
    {
      headers: {
        'Snack-Api-Version': '3.0.0',
      },
    },
  );
  const {hashId} = await res.json();
  if (typeof hashId === 'string') {
    hashIdMemoryCache[snackIdentifier] = hashId;
  }
  return hashId;
}

export function useSnackData(snackIdentifier: string) {
  const [snackHashId, setSnackHashId] = useState<string | null>(null);
  const [snackTitle, setSnackTitle] = useState<string | null>(null);
  const [snackDescription, setSnackDescription] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [snackMetadataError, setSnackMetadataError] = useState<Error | null>(
    null,
  );
  const client = useApolloClient();
  useEffect(() => {
    let isMounted = true;
    const asyncEffect = async () => {
      setLoading(true);
      const hashId = await getSnackHashIDFromIdentifier(snackIdentifier);
      if (isMounted) {
        setSnackHashId(hashId);
      }
      const {data, error} = await client.query<
        SnackMetadataData,
        SnackMetadataVars
      >({
        query: SnackMetadataQuery,
        variables: {hashId},
      });
      if (!isMounted) {
        return;
      }
      if (data != null) {
        const {name, description} = data.snack.byHashId;
        setSnackTitle(name);
        setSnackDescription(description);
      }
      if (error != null) {
        setSnackMetadataError(error);
        console.error(
          `Error when fetching metadata for snack with hashId: ${hashId}`,
          error,
        );
      }
      setLoading(false);
    };
    asyncEffect();
    return () => {
      isMounted = false;
    };
  }, [
    snackIdentifier,
    client,
    setSnackHashId,
    setSnackTitle,
    setSnackDescription,
    setLoading,
    setSnackMetadataError,
  ]);
  return {
    loadingSnackMetadata: loading,
    snackHashId,
    snackTitle,
    snackDescription,
    snackMetadataError,
  };
}
