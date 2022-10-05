/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @oncall playtorch
 */

import * as React from 'react';
import {useCallback, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import Header from '../../components/Header';
import {Example, ExampleCategories, ExampleCategory} from '../../types/example';
import ExampleCard from './ExampleCard';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import RadioPillGroup from '../../components/RadioPillGroup';
import {RadioOption} from '../../types/radio';
import {ExamplesScreenProps} from '../../types/navigation';
import {EXAMPLES_BY_CATEGORY} from '../../examples/examples-config';
import {Camera} from 'expo-camera';
import AboutScreenButton from '../info/AboutScreenButton';

const exampleCategoryRadioOptions: RadioOption<ExampleCategory>[] =
  ExampleCategories.map(cat => ({
    label: cat,
    value: cat,
  }));

export default function ExamplesScreen({navigation}: ExamplesScreenProps) {
  const insets = useSafeAreaInsets();
  const [selectedExampleCategory, setSelectedExampleCategory] =
    useState<ExampleCategory>(ExampleCategories[0]);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const handleCardPress = useCallback(
    async (exampleSlug: string, needsCameraPermissions: boolean) => {
      if (!needsCameraPermissions || permission?.granted) {
        navigation.navigate('ViewExample', {exampleSlug});
      } else {
        const result = await requestPermission();
        if (result.granted) {
          navigation.navigate('ViewExample', {exampleSlug});
        }
      }
    },
    [navigation, permission, requestPermission],
  );
  return (
    <View style={StyleSheet.absoluteFill}>
      <FlatList<Example>
        style={[insets, styles.container]}
        data={EXAMPLES_BY_CATEGORY[selectedExampleCategory]}
        keyExtractor={({title}) => title}
        renderItem={({item}) => (
          <View style={styles.cardWrapper}>
            <ExampleCard
              example={item}
              onPress={() =>
                handleCardPress(item.slug, item.needsCameraPermissions === true)
              }
            />
          </View>
        )}
        ListHeaderComponent={() => (
          <>
            <View style={styles.headerRow}>
              <Header level="h1">Examples</Header>
              <AboutScreenButton />
            </View>
            <RadioPillGroup<ExampleCategory>
              style={styles.categoryRadioGroup}
              selected={selectedExampleCategory}
              options={exampleCategoryRadioOptions}
              onSelect={setSelectedExampleCategory}
              listHeaderComponentStyle={styles.categoryRadioGroupEnds}
              listFooterComponentStyle={styles.categoryRadioGroupEnds}
            />
          </>
        )}
        ListFooterComponent={() => <View style={styles.footer} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 24,
    marginBottom: 22,
    marginTop: 28,
  },
  categoryRadioGroup: {
    marginBottom: 32,
  },
  categoryRadioGroupEnds: {
    width: 24,
  },
  cardWrapper: {
    paddingHorizontal: 24,
  },
  separator: {
    height: 24,
  },
  footer: {
    height: 96,
  },
});
