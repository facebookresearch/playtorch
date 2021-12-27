/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import * as React from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {View, Text, StyleSheet, TouchableHighlight} from 'react-native';
import {
  PTLColors as colors,
  PTLFontSizes as fontsizes,
  PTLVisual as visual,
} from './UISettings';
import type {ModelInfo} from 'react-native-pytorch-core';

type Props = {
  style?: StyleProp<ViewStyle>;
  modelInfos: ModelInfo[];
  defaultModelInfo: ModelInfo;
  onSelectModelInfo: (modelInfo: ModelInfo) => void;
};

export default function ModelSelector({
  style,
  modelInfos,
  defaultModelInfo,
  onSelectModelInfo,
}: Props) {
  const [selectedModelInfo, setSelectedModelInfo] =
    React.useState<ModelInfo>(defaultModelInfo);
  function handleSelectModel(model: ModelInfo) {
    setSelectedModelInfo(model);
    onSelectModelInfo(model);
  }
  return (
    <View style={style}>
      {modelInfos.map(modelInfo => {
        const selected = modelInfo.name === selectedModelInfo.name;
        return (
          <TouchableHighlight
            style={[styles.button, selected && styles.buttonSelect]}
            key={modelInfo.name}
            disabled={selected}
            onPress={() => handleSelectModel(modelInfo)}>
            <Text style={[styles.label, selected && styles.labelSelect]}>
              {modelInfo.name}
            </Text>
          </TouchableHighlight>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.semiBlack,
    flexGrow: 1,
  },
  buttonSelect: {
    backgroundColor: colors.accent1,
  },
  label: {
    alignSelf: 'center',
    marginVertical: visual.padding,
    fontSize: fontsizes.small,
    fontWeight: '500',
    color: colors.semiWhite,
  },
  labelSelect: {
    color: colors.white,
    fontWeight: '700',
  },
});
