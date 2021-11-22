/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import * as React from 'react';
import {ReactNode, useEffect, useState} from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {MobileModel} from 'react-native-pytorch-core';
import type {ModelInfo} from 'react-native-pytorch-core';

type Props = {
  modelInfos: ModelInfo[];
  loadAsync?: boolean;
  children?: ReactNode | ReactNode[];
};

export default function ModelPreloader({
  modelInfos,
  loadAsync = false,
  children,
}: Props): React.ReactElement {
  const [isReady, setIsReady] = useState(false);

  // Preload all models defined in `modelInfos` prop.
  useEffect(() => {
    // The useEffect doesn't work with async functions out of the box. If the
    // ModelPreloader component unmounts before the models preloaded, it will
    // eventually call set setIsReady state on an unmounted component after the
    // async models preload returns. The isMounted flag keeps track of the
    // mounted state and only calls setIsReady if the component is still
    // mounted.
    let isMounted = true;

    async function preloadModel() {
      for (let i = 0; i < modelInfos.length; i++) {
        await MobileModel.preload(modelInfos[i].model);
      }
      isMounted && setIsReady(true);
    }
    preloadModel();

    // Unload any preloaded models when the component unmounts. This will free
    // memory used by the model.
    return function () {
      isMounted = false;
      MobileModel.unload();
    };
  }, [setIsReady, modelInfos]);

  // If models aren't loaded async, this component will render a full screen
  // overlay while loading models.
  if (!isReady && !loadAsync) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="tomato" />
        <Text style={styles.label}>Loading Models</Text>
      </View>
    );
  }

  return (
    <>
      {children}
      {!isReady && (
        <View style={styles.asyncContainer}>
          <ActivityIndicator size="small" color="tomato" />
          <Text style={styles.asyncLabel}>Loading Models</Text>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
  },
  label: {
    marginTop: 10,
  },
  asyncContainer: {
    backgroundColor: 'rgba(255, 255, 255, .75)',
    borderRadius: 6,
    bottom: 70,
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    position: 'absolute',
    right: 10,
  },
  asyncLabel: {
    marginStart: 10,
  },
});
