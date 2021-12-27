/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

export class StringBuilder {
  private str: string;

  constructor(str: string = '') {
    this.str = str;
  }

  append(str: string): StringBuilder {
    this.str += str;
    return this;
  }

  toString(): string {
    return this.str;
  }
}
