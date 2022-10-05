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
import {View, StyleSheet} from 'react-native';
import {ModelInfo} from 'react-native-pytorch-core';
import RadioPillGroup from '../../components/RadioPillGroup';
import {RadioOption} from '../../types/radio';

type Props = {
  style?: StyleProp<ViewStyle>;
  modelInfos: ModelInfo[];
  defaultModelInfo: ModelInfo;
  onSelectModelInfo: (modelInfo: ModelInfo) => void;
};

export default function ModelSelector({
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

  const options: RadioOption<ModelInfo>[] = modelInfos.map(info => ({
    label: info.name,
    value: info,
  }));

  return (
    <View style={styles.container}>
      <RadioPillGroup<ModelInfo>
        options={options}
        selected={selectedModelInfo}
        onSelect={handleSelectModel}
        keyExtractor={modelInfo => modelInfo.name}
        listHeaderComponentStyle={styles.radioGroupEnds}
        listFooterComponentStyle={styles.radioGroupEnds}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    paddingBottom: 16,
  },
  radioGroupEnds: {
    width: 24,
  },
});
