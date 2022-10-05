/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @oncall playtorch
 */

import React from 'react';
import {FlatList, StyleSheet, View, ViewStyle} from 'react-native';
import DemoTile from './DemoTile';

type Props = {
  snackIdentifiers: string[];
  openSnack: (snackIdentifier: string) => void;
  openMenu: (snackIdentifier: string) => void;
};

export default function DemosGrid({
  snackIdentifiers,
  openSnack,
  openMenu,
}: Props) {
  return (
    <FlatList<string>
      style={styles.grid}
      data={snackIdentifiers}
      numColumns={2}
      horizontal={false}
      columnWrapperStyle={styles.columnWrapper}
      renderItem={({item, index}) => (
        <View style={getDemoTileStyles(index % 2 === 0)}>
          <DemoTile
            snackIdentifier={item}
            onPress={() => openSnack(item)}
            onMenuPress={() => openMenu(item)}
          />
        </View>
      )}
      ListFooterComponent={() => <View style={styles.footer} />}
      keyExtractor={snackIdentifier => snackIdentifier}
    />
  );
}

function getDemoTileStyles(isFirstColumn: boolean): ViewStyle {
  return {
    paddingBottom: 16,
    paddingEnd: isFirstColumn ? 8 : 0,
    paddingStart: isFirstColumn ? 0 : 8,
    width: '100%',
  };
}

const styles = StyleSheet.create({
  columnWrapper: {
    width: '50%',
  },
  grid: {
    maxWidth: '100%',
  },
  footer: {
    height: 96,
  },
});
