/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @oncall playtorch
 */

import {useEffect} from 'react';
import {useRef} from 'react';

/**
 * Throttles the function that is passed in as first argument, and it will be
 * throttled with the time passed in as second argument.
 *
 * @param fn Function that needs throttling
 * @param time Throttle time
 * @returns A function with the same function signature as the function passed
 * in as first argument.
 */
export default function useThrottle<A extends unknown[]>(
  fn: (...args: A) => void,
  time: number = 200,
) {
  const argsRef = useRef<A | null>();
  const stableFnRef = useRef(fn);

  useEffect(() => {
    let mounted = true;
    let timeoutHandle: ReturnType<typeof setTimeout>;
    const startTimeout = () => {
      timeoutHandle = setTimeout(() => {
        // Only schedule another timeout if the component is mounted
        if (mounted) {
          const args = argsRef.current;
          const stableFn = stableFnRef.current;
          if (stableFn != null && args != null) {
            stableFn(...args);
          }
          argsRef.current = null;
          startTimeout();
        }
      }, time);
    };
    startTimeout();

    return () => {
      mounted = false;
      clearTimeout(timeoutHandle);
    };
  }, [stableFnRef, time]);

  return (...args: A): void => {
    argsRef.current = args;
  };
}
