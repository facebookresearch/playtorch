/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {useLayoutEffect} from 'react';

export default function useLayoutEffectAsync(
  asyncFunction: () => Promise<void>,
  deps?: any[],
) {
  const allDeps = [asyncFunction];
  if (deps != null) {
    allDeps.push(...deps);
  }

  useLayoutEffect(() => {
    let isMounted = true;
    (async () => {
      // Return early if component is unmounted
      if (!isMounted) {
        return;
      }
      await asyncFunction();
    })();
    return function () {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asyncFunction, ...(deps || [])]);
}
