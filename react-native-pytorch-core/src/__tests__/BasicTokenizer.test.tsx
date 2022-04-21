/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {BasicTokenizer} from '../text/BasicTokenizer';

describe('test basic tokenize', () => {
  it('handles neverSplit correctly', () => {
    const context =
      'I ordered a big burger, French fries, and soda at the fast food restaurant with order number 261 and sit at table 20. I made that order at 3 p.m.';
    const question = 'What did I order?';
    const input = `[CLS] ${question} [SEP] ${context} [SEP]`;
    const expected = [
      '[CLS]',
      'what',
      'did',
      'i',
      'order',
      '?',
      '[SEP]',
      'i',
      'ordered',
      'a',
      'big',
      'burger',
      ',',
      'french',
      'fries',
      ',',
      'and',
      'soda',
      'at',
      'the',
      'fast',
      'food',
      'restaurant',
      'with',
      'order',
      'number',
      '261',
      'and',
      'sit',
      'at',
      'table',
      '20',
      '.',
      'i',
      'made',
      'that',
      'order',
      'at',
      '3',
      'p',
      '.',
      'm',
      '.',
      '[SEP]',
    ];
    const tokenizer = new BasicTokenizer({
      neverSplit: ['[CLS]', '[SEP]'],
      lowercase: true,
    });
    const output = tokenizer.tokenize(input);
    expect(output).toEqual(expect.arrayContaining(expected));
  });

  it('handles lowercase correctly', () => {
    const context = 'I ordered a big burger...';
    const question = 'What did I order?';
    const input = `[CLS] ${question} [SEP] ${context} [SEP]`;
    const expected = [
      '[CLS]',
      'What',
      'did',
      'I',
      'order',
      '?',
      '[SEP]',
      'I',
      'ordered',
      'a',
      'big',
      'burger',
      '.',
      '.',
      '.',
      '[SEP]',
    ];
    const tokenizer = new BasicTokenizer({
      neverSplit: ['[CLS]', '[SEP]'],
      lowercase: false,
    });
    const output = tokenizer.tokenize(input);
    expect(output).toEqual(expect.arrayContaining(expected));
  });
});
