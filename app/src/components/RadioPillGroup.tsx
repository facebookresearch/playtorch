/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @oncall playtorch
 */

import React, {useEffect, useRef} from 'react';
import RadioPill from './RadioPill';
import {FlatList, StyleSheet, View, ViewStyle} from 'react-native';
import {RadioOption} from '../types/radio';
import {useCallback} from 'react';

type Props<T> = {
  options: RadioOption<T>[];
  selected: T | null;
  onSelect: (label: T) => void;
  listFooterComponentStyle?: ViewStyle;
  listHeaderComponentStyle?: ViewStyle;
  style?: ViewStyle;
  keyExtractor?: (value: T) => string;
};

export default function RadioPillGroup<T>(props: Props<T>) {
  const {
    options,
    selected,
    onSelect,
    style,
    listHeaderComponentStyle,
    listFooterComponentStyle,
    keyExtractor,
  } = props;
  const flatListRef = useRef<FlatList>(null);
  const scrollToSelected = useCallback(() => {
    if (options.length <= 1) {
      return;
    }
    flatListRef.current?.scrollToIndex({
      animated: true,
      index: options.findIndex(({value}) => value === selected),
      viewPosition: 1,
    });
  }, [flatListRef, selected, options]);
  useEffect(() => {
    scrollToSelected();
  }, [scrollToSelected]);
  return (
    <FlatList<RadioOption<T>>
      ref={flatListRef}
      style={[styles.container, style]}
      data={options}
      horizontal={true}
      renderItem={({item}) => (
        <RadioPill
          label={item.label}
          selected={selected === item.value}
          onPress={() => onSelect(item.value)}
        />
      )}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListHeaderComponent={View}
      ListHeaderComponentStyle={listHeaderComponentStyle}
      ListFooterComponent={View}
      ListFooterComponentStyle={listFooterComponentStyle}
      keyExtractor={({value}) =>
        keyExtractor == null ? `${value}` : keyExtractor(value)
      }
      showsHorizontalScrollIndicator={false}
      onScrollToIndexFailed={() => {
        setTimeout(scrollToSelected, 20);
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexGrow: 0,
  },
  separator: {
    width: 8,
  },
});
