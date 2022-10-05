/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @oncall playtorch
 */

import * as React from 'react';
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';
import {PTLIconName} from '../components/icon/PTLIcon';
import PTLSnackbar, {
  PTLSnackbarConfig,
} from '../components/snackbar/PTLSnackbar';

interface SnackbarManager {
  showSnackbar: (message: string, icon?: PTLIconName) => void;
}

const SnackbarContext = createContext<SnackbarManager | null>(null);

type SnackbarConfigWithId = {
  config: PTLSnackbarConfig;
  id: number;
};

type Props = PropsWithChildren<{}>;

export function SnackbarProvider({children}: Props) {
  const idRef = useRef(0);
  const [snackbarConfigs, setSnackbarConfigs] = useState<
    SnackbarConfigWithId[]
  >([]);
  const showSnackbar = useCallback(
    (message: string, icon?: PTLIconName) => {
      const id = idRef.current++;
      setSnackbarConfigs(prevState => [
        ...prevState,
        {config: {message, icon}, id},
      ]);
    },
    [idRef, setSnackbarConfigs],
  );

  const handleDismiss = useCallback(
    (idToDismiss: number) => {
      setSnackbarConfigs(prevState =>
        prevState.filter(({id}) => id !== idToDismiss),
      );
    },
    [setSnackbarConfigs],
  );

  return (
    <SnackbarContext.Provider value={{showSnackbar}}>
      {children}
      {snackbarConfigs.map(({config, id}) => (
        <PTLSnackbar
          {...config}
          key={id}
          onDismiss={() => {
            handleDismiss(id);
          }}
        />
      ))}
    </SnackbarContext.Provider>
  );
}

export function useSnackbar() {
  const context = useContext(SnackbarContext);
  if (context === null) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
}
