/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @oncall playtorch
 */

import React, {useMemo} from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';
import ExternalLinks from '../../constants/ExternalLinks';
import ShareButton from '../../components/top-nav/ShareButton';

type Props = {
  style?: ViewStyle;
  exampleSlug: string;
  tintColor?: string | undefined;
  pressColor?: string | undefined;
  pressOpacity?: number | undefined;
};

export default function ViewExampleNavIcons({
  style,
  exampleSlug,
  ...rest
}: Props) {
  const shareUrl = useMemo(
    () => ExternalLinks.exampleWrapperLink(exampleSlug),
    [exampleSlug],
  );
  return (
    <View style={[styles.container, style]}>
      <ShareButton shareUrl={shareUrl} {...rest} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
});
