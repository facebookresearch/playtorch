/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

export const PTLColors: {[key: string]: string} = {
  black: '#000000',
  white: '#ffffff',
  light: '#ffdad2',
  dark: '#262626',
  semiBlack: '#000000cc',
  semiWhite: '#ffffffcc',
  neutralBlack: '#00000099',
  neutralWhite: '#ffffff99',
  tintBlack: '#00000022',
  tintWhite: '#ffffff22',
  accent1: '#4F25C6',
  accent2: '#ee4c2c',
  accent3: '#cc2faa',
  accent4: '#812ce5',
};

export const PTLFontSizes: {[key: string]: number} = {
  h1: 32,
  h2: 24,
  h3: 20,
  p: 16,
  smaller: 14,
  small: 12,
};

export const PTLVisual: {[key: string]: number} = {
  borderRadius: 5,
  padding: 20,
  smallPadding: 10,
};

export const PTLTextBoxStyle = {
  color: PTLColors.dark,
  borderWidth: 1,
  borderColor: PTLColors.tintBlack,
  flex: 1,
  padding: PTLVisual.smallPadding,
  backgroundColor: PTLColors.white,
  fontSize: PTLFontSizes.p,
  borderRadius: PTLVisual.borderRadius,
};
