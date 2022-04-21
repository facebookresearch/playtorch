/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

export type BasicTokenizerConfig = {
  lowercase?: boolean;
  neverSplit?: string[];
};

export class BasicTokenizer {
  private lowercase: boolean;
  private neverSplit: Set<string>;
  private punctuations: Set<string>;

  /**
   * Construct a BasicTokenizer Object.
   *
   * @param config A basic tokenizer configuration object that specifies the non-splitable symbol, lowercase, customized punctuations, etc.
   */
  constructor({lowercase = true, neverSplit = []}: BasicTokenizerConfig) {
    this.neverSplit = new Set(neverSplit);
    this.lowercase = lowercase;
    this.punctuations = new Set([
      '!',
      '"',
      '#',
      '$',
      '%',
      '&',
      "'",
      '(',
      ')',
      '*',
      '+',
      ',',
      '-',
      '.',
      '/',
      ':',
      ';',
      '<',
      '=',
      '>',
      '?',
      '@',
      '[',
      '\\',
      ']',
      '^',
      '_',
      '`',
      '{',
      '|',
      '}',
      '~',
    ]);
  }

  /**
   * Tokenize any text with basic operations like lowercase transform, blackspace trimming and punctuation splitting.
   * Normally used to clean text before passing to other tokenizers (e.g. wordpiece).
   *
   * @param text The text to be processed
   */
  public tokenize(text: string): string[] {
    const tokens: string[] = [];
    const words = text.split(/\s+/);
    words.forEach(word => {
      if (this.neverSplit.has(word)) {
        tokens.push(word);
        return;
      }
      if (this.lowercase) {
        word = word.toLowerCase();
      }
      let i = 0;
      while (i < word.length) {
        if (this.punctuations.has(word[i])) {
          tokens.push(word[i]);
          i += 1;
        } else {
          let j = i + 1;
          while (j < word.length && !this.punctuations.has(word[j])) {
            j += 1;
          }
          tokens.push(word.slice(i, j));
          i = j;
        }
      }
    });
    return tokens;
  }
}
