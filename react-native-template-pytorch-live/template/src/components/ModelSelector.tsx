/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import * as React from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {ModelInfo} from '../Models';

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
  const [selectedModelInfo, setSelectedModelInfo] = React.useState<ModelInfo>(
    defaultModelInfo,
  );
  function handleSelectModel(model: ModelInfo) {
    setSelectedModelInfo(model);
    onSelectModelInfo(model);
  }
  return (
    <View style={[styles.row, style]}>
      {modelInfos.map(modelInfo => {
        const selected = modelInfo.name === selectedModelInfo.name;
        return (
          <TouchableOpacity
            style={[styles.button, selected && styles.buttonSelect]}
            key={modelInfo.name}
            disabled={selected}
            onPress={() => handleSelectModel(modelInfo)}>
            <Text style={[styles.label, selected && styles.labelSelect]}>
              {modelInfo.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    borderBottomWidth: 2,
    borderBottomColor: '#ff4c2c',
  },
  button: {
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  buttonSelect: {
    backgroundColor: '#ff4c2c',
  },
  label: {
    alignSelf: 'center',
    marginVertical: 20,
    fontSize: 13,
    fontWeight: 'bold',
    color: '#678',
  },
  labelSelect: {
    color: '#fff',
  },
});
