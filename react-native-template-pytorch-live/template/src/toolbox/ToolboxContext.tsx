/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import * as React from 'react';
import {useState} from 'react';
import {useContext} from 'react';
import emptyFunction from '../utils/emptyFunction';
import {Tool} from './Toolbox';

type ToolboxContextProps = {
  activeTool: Tool | undefined;
  setActiveTool: (tool: Tool) => void;
};

export const ToolboxContext = React.createContext<ToolboxContextProps>({
  activeTool: undefined,
  setActiveTool: emptyFunction,
});

export function useToolboxContext() {
  return useContext(ToolboxContext);
}

type Props = {
  children: React.ReactChild;
};

export default function ({children}: Props) {
  const [activeTool, setActiveTool] = useState<Tool>();
  return (
    <ToolboxContext.Provider value={{activeTool, setActiveTool}}>
      {children}
    </ToolboxContext.Provider>
  );
}
