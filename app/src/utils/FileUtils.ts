/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @oncall playtorch
 */

export function uriWithoutSchema(uri: string): string {
  return uri.substring('file://'.length, uri.length);
}
