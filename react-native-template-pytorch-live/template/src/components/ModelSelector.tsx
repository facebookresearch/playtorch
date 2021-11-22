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
import {View, Button, StyleSheet} from 'react-native';
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
    <View style={style}>
      {modelInfos.map(modelInfo => {
        return (
          <View style={styles.button} key={modelInfo.name}>
            <Button
              title={modelInfo.name}
              color="tomato"
              disabled={modelInfo.name === selectedModelInfo.name}
              onPress={() => handleSelectModel(modelInfo)}
            />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    marginBottom: 5,
  },
});
