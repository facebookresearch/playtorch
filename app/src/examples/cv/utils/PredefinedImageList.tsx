/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import * as React from 'react';
import {
  FlatList,
  Image,
  ImageRequireSource,
  StyleSheet,
  TouchableHighlight,
  View,
} from 'react-native';
import Header from '../../../components/Header';

const images = [
  require('../../../assets/examples/cv/photos/Lady_Bug.png'),
  require('../../../assets/examples/cv/photos/Light_House.png'),
  require('../../../assets/examples/cv/photos/Cheetah.png'),
  require('../../../assets/examples/cv/photos/Boat.png'),
  require('../../../assets/examples/cv/photos/Space_Shuttle.png'),
  require('../../../assets/examples/cv/photos/Espresso.png'),
  require('../../../assets/examples/cv/photos/Typewriter.png'),
];

type Props = {
  onSelectImage: (uri: ImageRequireSource) => void;
  showHint: boolean;
  listFooterHeight: number;
};

export default function PredefinedImageList({
  onSelectImage,
  listFooterHeight,
}: Props) {
  const renderItem = ({item: bundledImage}: any) => (
    <TouchableHighlight onPress={() => onSelectImage(bundledImage)}>
      <Image style={styles.image} source={bundledImage} />
    </TouchableHighlight>
  );

  return (
    <FlatList
      scrollEnabled={true}
      style={styles.container}
      data={images}
      renderItem={renderItem}
      keyExtractor={(_, index) => `${index}`}
      ListHeaderComponent={() => (
        <Header style={styles.header} level="h2">
          Tap an image to test the model
        </Header>
      )}
      ListFooterComponent={View}
      ListFooterComponentStyle={{height: listFooterHeight}}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  header: {
    marginHorizontal: 24,
    marginTop: 23,
    marginBottom: 32,
  },
});
