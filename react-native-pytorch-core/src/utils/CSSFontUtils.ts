/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @hidden
 */

type CSSFont = {
  fontFamily: string[];
  fontStyle?: string;
  fontSize?: string;
  fontVariant?: string;
  fontWeight?: string;
  fontStretch?: string;
  lineHeight?: string;
};

/**
 * CSS font parser states
 */
enum ParserStates {
  VARIATION,
  LINE_HEIGHT,
  FONT_FAMILY,
  BEFORE_FONT_FAMILY,
  AFTER_OBLIQUE,
}

/**
 * Attempt to parse a string as an identifier. Return
 * a normalized identifier, or null when the string
 * contains an invalid identifier.
 *
 * @param str
 * @return
 */
function parseIdentifier(str: string): string | null {
  const identifiers: string[] = str
    .replace(/^\s+|\s+$/, '')
    .replace(/\s+/g, ' ')
    .split(' ');

  for (let i = 0; i < identifiers.length; i += 1) {
    if (
      /^(?:-?\d|--)/.test(identifiers[i]) ||
      !/^(?:[_a-zA-Z0-9-]|[^\0-\237]|(?:\\[0-9a-f]{1,6}(?:\r\n|[ \n\r\t\f])?|\\[^\n\r\f0-9a-f]))+$/.test(
        identifiers[i],
      )
    ) {
      return null;
    }
  }
  return identifiers.join(' ');
}

/**
 * Parses a string into a [[CSSFont]] or returns null if it fails.
 *
 * @param input CSS string as input.
 * @return The parsed [[CSSFont]] or null.
 */
export function parse(input: string): CSSFont | null {
  let state = ParserStates.VARIATION;
  let buffer = '';
  let result: CSSFont = {
    fontFamily: [],
  };

  for (let c, i = 0; (c = input.charAt(i)); i += 1) {
    if (state === ParserStates.BEFORE_FONT_FAMILY && (c === '"' || c === "'")) {
      let index = i + 1;

      // consume the entire string
      do {
        index = input.indexOf(c, index) + 1;
        if (!index) {
          // If a string is not closed by a ' or " return null.
          return null;
        }
      } while (input.charAt(index - 2) === '\\');

      result.fontFamily.push(input.slice(i, index));

      i = index - 1;
      state = ParserStates.FONT_FAMILY;
      buffer = '';
    } else if (state === ParserStates.FONT_FAMILY && c === ',') {
      state = ParserStates.BEFORE_FONT_FAMILY;
      buffer = '';
    } else if (state === ParserStates.BEFORE_FONT_FAMILY && c === ',') {
      const identifier = parseIdentifier(buffer);

      if (identifier) {
        result.fontFamily.push(identifier);
      }
      buffer = '';
    } else if (state === ParserStates.AFTER_OBLIQUE && c === ' ') {
      if (/^(?:\+|-)?(?:[0-9]*\.)?[0-9]+(?:deg|grad|rad|turn)$/.test(buffer)) {
        result.fontStyle += ' ' + buffer;
        buffer = '';
      } else {
        // The 'oblique' token was not followed by an angle.
        // Backtrack to allow the token to be parsed as VARIATION
        i -= 1;
      }
      state = ParserStates.VARIATION;
    } else if (state === ParserStates.VARIATION && (c === ' ' || c === '/')) {
      if (
        /^(?:(?:xx|x)-large|(?:xx|s)-small|small|large|medium)$/.test(buffer) ||
        /^(?:larg|small)er$/.test(buffer) ||
        /^(?:\+|-)?(?:[0-9]*\.)?[0-9]+(?:em|ex|ch|rem|vh|vw|vmin|vmax|px|mm|cm|in|pt|pc|%)$/.test(
          buffer,
        )
      ) {
        state =
          c === '/'
            ? ParserStates.LINE_HEIGHT
            : ParserStates.BEFORE_FONT_FAMILY;
        result.fontSize = buffer;
      } else if (/^italic$/.test(buffer)) {
        result.fontStyle = buffer;
      } else if (/^oblique$/.test(buffer)) {
        result.fontStyle = buffer;
        state = ParserStates.AFTER_OBLIQUE;
      } else if (/^small-caps$/.test(buffer)) {
        result.fontVariant = buffer;
      } else if (/^(?:bold(?:er)?|lighter)$/.test(buffer)) {
        result.fontWeight = buffer;
      } else if (
        /^[+-]?(?:[0-9]*\.)?[0-9]+(?:e[+-]?(?:0|[1-9][0-9]*))?$/.test(buffer)
      ) {
        const num = parseFloat(buffer);
        if (num >= 1 && num <= 1000) {
          result.fontWeight = buffer;
        }
      } else if (
        /^(?:(?:ultra|extra|semi)-)?(?:condensed|expanded)$/.test(buffer)
      ) {
        result.fontStretch = buffer;
      }
      buffer = '';
    } else if (state === ParserStates.LINE_HEIGHT && c === ' ') {
      if (
        /^(?:\+|-)?([0-9]*\.)?[0-9]+(?:em|ex|ch|rem|vh|vw|vmin|vmax|px|mm|cm|in|pt|pc|%)?$/.test(
          buffer,
        )
      ) {
        result.lineHeight = buffer;
      }
      state = ParserStates.BEFORE_FONT_FAMILY;
      buffer = '';
    } else {
      buffer += c;
    }
  }

  // This is for the case where a string was specified followed by
  // an identifier, but without a separating comma.
  if (state === ParserStates.FONT_FAMILY && !/^\s*$/.test(buffer)) {
    return null;
  }

  if (state === ParserStates.BEFORE_FONT_FAMILY) {
    const identifier = parseIdentifier(buffer);

    if (identifier) {
      result.fontFamily.push(identifier);
    }
  }

  if (result.fontSize && result.fontFamily.length) {
    return result;
  } else {
    return null;
  }
}
