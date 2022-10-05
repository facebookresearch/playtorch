/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @oncall playtorch
 */

import {MMKV} from 'react-native-mmkv';
import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

const storage = new MMKV();

const SEPARATOR_HASH_ID = ',';

const RECENT_SNACKS_MAX_LENGTH = 10;

const KEY_SAVED_SNACK_HASH_IDS = 'KEY_SAVED_SNACK_HASH_IDS';
const KEY_RECENT_SNACK_HASH_IDS = 'KEY_RECENT_SNACK_HASH_IDS';

type StringListKey =
  | typeof KEY_SAVED_SNACK_HASH_IDS
  | typeof KEY_RECENT_SNACK_HASH_IDS;

function getStringList(key: StringListKey): string[] {
  const stringList = storage.getString(key);
  if (stringList == null || stringList === '') {
    return [];
  }
  return stringList.split(SEPARATOR_HASH_ID);
}

function storeStringList(key: StringListKey, strings: string[]): boolean {
  try {
    storage.set(key, strings.join(SEPARATOR_HASH_ID));
    return true;
  } catch {
    return false;
  }
}

interface SnackIdCache {
  savedSnackIds: Set<string>;
  recentSnackIds: string[];
  saveSnackId: (snackId: string) => void;
  deleteSavedSnackId: (snackId: string) => void;
  markSnackIdRecent: (snackId: string) => void;
  removeSnackIdFromRecent: (snackId: string) => void;
  clearCache: () => void;
}

const SnackIdCacheContext = createContext<SnackIdCache | null>(null);

export function SnackIdCacheProvider({children}: PropsWithChildren<{}>) {
  // Using a set to make it performant for consumers to check if a Snack is saved
  const [savedSnackIds, setSavedSnackIds] = useState<Set<string>>(
    new Set(getStringList(KEY_SAVED_SNACK_HASH_IDS) || []),
  );
  // Using a list to make sure order of snacks is persisted
  const [recentSnackIds, setRecentSnackIds] = useState<string[]>(
    getStringList(KEY_RECENT_SNACK_HASH_IDS) || [],
  );

  useEffect(() => {
    // TODO: (T114041514) Add retry logic
    if (savedSnackIds) {
      storeStringList(KEY_SAVED_SNACK_HASH_IDS, Array.from(savedSnackIds));
    }
  }, [savedSnackIds]);

  useEffect(() => {
    // TODO: (T114041514) Add retry logic
    if (recentSnackIds) {
      storeStringList(KEY_RECENT_SNACK_HASH_IDS, recentSnackIds);
    }
  }, [recentSnackIds]);

  const saveSnackId = useCallback(
    (snackId: string) => {
      if (snackId !== '' && !savedSnackIds.has(snackId)) {
        setSavedSnackIds(prevState => {
          const newState = new Set<string>(prevState);
          newState.add(snackId);
          return newState;
        });
      }
    },
    [savedSnackIds, setSavedSnackIds],
  );

  const deleteSavedSnackId = useCallback(
    (snackId: string) => {
      if (savedSnackIds.has(snackId)) {
        setSavedSnackIds(prevState => {
          const newState = new Set<string>(prevState);
          newState.delete(snackId);
          return newState;
        });
      }
    },
    [savedSnackIds, setSavedSnackIds],
  );

  const markSnackIdRecent = useCallback(
    (snackId: string) => {
      if (snackId === '') {
        return;
      }
      setRecentSnackIds(prevState => {
        const idIndex = prevState.indexOf(snackId);
        let newState: string[] | null = null;
        if (idIndex === 0) {
          // Recently viewed snack is already in the first spot, so just return it
          newState = prevState;
        } else if (idIndex > 0) {
          newState = [
            snackId,
            ...prevState.slice(0, idIndex),
            ...prevState.slice(idIndex + 1),
          ];
        } else {
          newState = [snackId, ...prevState];
        }
        return newState.slice(0, RECENT_SNACKS_MAX_LENGTH);
      });
    },
    [setRecentSnackIds],
  );

  const removeSnackIdFromRecent = useCallback(
    (snackId: string) => {
      if (snackId === '') {
        return;
      }
      setRecentSnackIds(prevState => prevState.filter(id => id !== snackId));
    },
    [setRecentSnackIds],
  );

  const clearCache = useCallback(() => {
    setSavedSnackIds(new Set());
    setRecentSnackIds([]);
  }, [setRecentSnackIds, setSavedSnackIds]);

  const value: SnackIdCache = {
    savedSnackIds,
    recentSnackIds,
    saveSnackId,
    deleteSavedSnackId,
    markSnackIdRecent,
    removeSnackIdFromRecent,
    clearCache,
  };

  return (
    <SnackIdCacheContext.Provider value={value}>
      {children}
    </SnackIdCacheContext.Provider>
  );
}

export default function useSnackIdCache() {
  const context = useContext(SnackIdCacheContext);
  if (context === null) {
    throw new Error(
      'useSnackIdCache must be used within a SnackIdCacheProvider',
    );
  }
  return context;
}
