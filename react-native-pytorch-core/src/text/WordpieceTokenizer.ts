/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {BasicTokenizer} from './BasicTokenizer';

export type WordPieceTokenizerConfig = {
  vocab: string;
  unknownToken?: string;
  neverSplit?: string[];
  lowercase?: boolean;
};

export class WordPieceTokenizer {
  private tokenIdMap = new Map<string, number>();
  private idTokenMap = new Map<number, string>();
  private unknownToken: string;
  private unknownTokenId: number = -1;
  private neverSplit: string[];
  private lowercase: boolean;
  private basicTokenizer: BasicTokenizer;

  /**
   * Construct a tokenizer with a WordPieceTokenizer object.
   *
   * @param config a tokenizer configuration object that specify the vocabulary and special tokens, etc.
   */
  constructor({
    vocab,
    unknownToken = '[UNK]',
    neverSplit = ['[UNK]', '[SEP]', '[PAD]', '[CLS]', '[MASK]'],
    lowercase = true,
  }: WordPieceTokenizerConfig) {
    this.unknownToken = unknownToken;
    this.loadVocabFromString(vocab);
    this.lowercase = lowercase;
    this.neverSplit = [...neverSplit];
    this.basicTokenizer = new BasicTokenizer({
      neverSplit: this.neverSplit,
      lowercase: this.lowercase,
    });
  }

  private loadVocabFromString(vocab: string): void {
    const arr = vocab.split('\n');
    arr.forEach((element: string, index: number) => {
      this.tokenIdMap.set(element, index);
      this.idTokenMap.set(index, element);
    });
    const unknownTokenId = this.tokenIdMap.get(this.unknownToken);

    if (unknownTokenId === undefined) {
      throw new Error('Illegal vocabulary: unknownToken is missing.');
    } else {
      this.unknownTokenId = unknownTokenId;
    }
  }

  /**
   * Tokenizes a piece of text into its word pieces.
   * This uses a greedy longest-match-first algorithm to perform tokenization using the given vocabulary.
   *
   * @param text the raw input of the model
   * @returns an array of tokens in vocabulary representing the input text.
   */
  public tokenize(text: string): string[] {
    const tokens: string[] = [];
    const words = text.split(/\s+/);

    words.forEach((word: string) => {
      if (this.tokenIdMap.has(word)) {
        tokens.push(word);
        return;
      }
      if (this.lowercase) {
        word = word.toLowerCase();
      }
      let isBad: boolean = false;
      const subTokens: string[] = [];
      let start: number = 0;
      while (start < word.length) {
        let end = word.length;
        let curSubstr;
        while (start < end) {
          let substr = word.slice(start, end);
          if (start > 0) {
            substr = '##' + substr;
          }
          if (this.tokenIdMap.has(substr)) {
            curSubstr = substr;
            break;
          }
          end -= 1;
        }
        if (curSubstr === undefined) {
          isBad = true;
          break;
        }
        subTokens.push(curSubstr);
        start = end;
      }
      if (isBad) {
        tokens.push(this.unknownToken);
      } else {
        tokens.push(...subTokens);
      }
    });
    return tokens;
  }

  private tokenToId(token: string): number {
    const index = this.tokenIdMap.get(token);
    return index ?? this.unknownTokenId;
  }

  private idToToken(tokenId: number): string {
    const token = this.idTokenMap.get(tokenId);
    return token ?? this.unknownToken;
  }

  /**
   * Encode the raw input to a NLP model to an array of number, which is tensorizable.
   *
   * @param text The raw input of the model
   * @returns An array of number, which can then be used to create a tensor as model input with the torch.tensor API
   */
  public encode(text: string): number[] {
    text = this.basicTokenizer.tokenize(text).join(' ');
    return this.tokenize(text).map(token => this.tokenToId(token));
  }

  /**
   * Decode an array of tokenIds to a string using the vocabulary
   *
   * @param tokenIds an array of tokenIds derived from the output of model
   * @returns a string decoded from the output of the model
   */
  public decode(tokenIds: number[]): string {
    const texts: string[] = tokenIds.map(tokenId => this.idToToken(tokenId));
    return texts.join(' ').replace(/\s?##/g, '');
  }
}
