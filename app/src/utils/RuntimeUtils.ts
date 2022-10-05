/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @oncall playtorch
 */

export function getJavaScriptRuntime(): string {
  return isHermes() ? 'Hermes' : 'JSC';
}

export function isHermes(): boolean {
  // @ts-expect-error HermesInternal is not yet included in the RN types
  return !!global?.HermesInternal;
}

export function isFabric(): boolean {
  // @ts-expect-error nativeFabricUIManager is not yet included in the RN types
  return !!global?.nativeFabricUIManager;
}
