/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {useLayoutEffect} from 'react';

function useLayoutEffectAsync(
  asyncFunction: () => Promise<void>,
  deps?: any[],
) {
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
  }, deps);
}

export default useLayoutEffectAsync;
