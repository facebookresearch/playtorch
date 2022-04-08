/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {WordPieceTokenizer} from '../text/WordpieceTokenizer';

describe('test workpiece tokenizer constructor', () => {
  const vocab = '[UNK]\n[CLS]\n[SEP]\nwant\n##want\n##ed\nwa\nun\nrunn\n##ing';

  it('parses vocabulary', () => {
    let t = new WordPieceTokenizer({vocab});
    // @ts-ignore accessing private property for testing
    expect(t.tokenIdMap.get('[UNK]')).toBe(0);
    // @ts-ignore accessing private property for testing
    expect(t.tokenIdMap.get('##ing')).toBe(9);
    // @ts-ignore accessing private property for testing
    expect(t.idTokenMap.get(0)).toBe('[UNK]');
  });

  it('uses customized unknown token', () => {
    let t = new WordPieceTokenizer({vocab, unknownToken: '[CLS]'});
    // @ts-ignore accessing private property for testing
    expect(t.unknownToken).toBe('[CLS]');
    // @ts-ignore accessing private property for testing
    expect(t.unknownTokenId).toBe(1);
  });

  it('throws on [UNK] not found', () => {
    expect(() => {
      return new WordPieceTokenizer({vocab: '[CLS]'});
    }).toThrow();
  });
});

describe('test tokenize', () => {
  const vocab = '[UNK]\n[CLS]\n[SEP]\nwant\n##want\n##ed\nwa\nun\nrunn\n##ing';
  const t = new WordPieceTokenizer({vocab});
  it('returns empty array for empty string', () => {
    expect(t.tokenize('')).toEqual([]);
    expect(t.tokenize('   ')).toEqual([]);
  });
  it('tokenizes with word-pieces', () => {
    expect(t.tokenize('unwanted running')).toEqual([
      'un',
      '##want',
      '##ed',
      'runn',
      '##ing',
    ]);
  });
  it('converts to lowercase before tokenization', () => {
    expect(t.tokenize('Unwanted running')).toEqual([
      'un',
      '##want',
      '##ed',
      'runn',
      '##ing',
    ]);
  });

  it('tokenizes with unknown symbol', () => {
    expect(t.tokenize('UnwantedX running')).toEqual(['[UNK]', 'runn', '##ing']);
  });

  it('tokenizes with lowercase option disabled', () => {
    let ct = new WordPieceTokenizer({
      vocab: '[UNK]\n[CLS]\n[SEP]\nwant\n##want\n##ed\nwa\nun\nrunn\n##ing',
      lowercase: false,
    });
    expect(ct.tokenize('Unwanted running')).toEqual(['[UNK]', 'runn', '##ing']);
  });
});

describe('test encode and decode', () => {
  const vocab = '[UNK]\n[CLS]\n[SEP]\nwant\n##want\n##ed\nwa\nun\nrunn\n##ing';
  const t = new WordPieceTokenizer({vocab});

  it('encodes tokens to their indice', () => {
    expect(t.encode('unwanted running')).toEqual([7, 4, 5, 8, 9]);
  });
  it('encode with unknown token', () => {
    expect(t.encode('unwantedX running')).toEqual([0, 8, 9]);
  });
  it('decodes tokenIds to string', () => {
    expect(t.decode([7, 4, 5, 8, 9])).toEqual('unwanted running');
  });
  it('decodes with unknown token', () => {
    expect(t.decode([0, 8, 9])).toEqual('[UNK] running');
  });
});
