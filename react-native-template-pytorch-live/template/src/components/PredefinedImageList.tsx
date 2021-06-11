/**
 * Copyright (c) Facebook, Inc. and its affiliates.
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
  StyleSheet,
  TouchableHighlight,
  View,
  Text,
} from 'react-native';

const images = [
  'https://ids.si.edu/ids/deliveryService?max_w=800&id=NZP-20090127-0422MM-000002',
  'https://ids.si.edu/ids/deliveryService?max_w=800&id=NZP-20060712-061JC',
  'https://ids.si.edu/ids/deliveryService?max_w=800&id=SG-2016-0174A-101',
  'https://ids.si.edu/ids/deliveryService?max_w=800&id=NASM-A19670093000-NASM2018-10363-000001',
  'https://www.nps.gov/npgallery/GetAsset/3d0a37ab-9b32-4644-931c-7d145c90b995/',
  'https://ids.si.edu/ids/deliveryService?max_w=800&id=CHSDM-7B301B2FFD322_03',
  'https://ids.si.edu/ids/deliveryService?max_w=800&id=ACM-acmobj-200400070001-r9',
  '',
];

type Props = {
  onSelectImage: (uri: string) => void;
};

export default function PredefinedImageList({onSelectImage}: Props) {
  const renderItem = ({item: imageUri}: any) =>
    imageUri ? (
      <TouchableHighlight onPress={() => onSelectImage(imageUri)}>
        <Image style={styles.image} source={{uri: imageUri}} />
      </TouchableHighlight>
    ) : (
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>
          <Text style={{fontWeight: 'bold'}}>Tip:</Text> You can edit
          PredefinedImageList.tsx to add or change the images in the `images`
          array.
        </Text>
      </View>
    );

  return (
    <FlatList
      scrollEnabled={true}
      style={styles.container}
      data={images}
      renderItem={renderItem}
      keyExtractor={(_, index) => `${index}`}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  placeholder: {
    height: 300,
    backgroundColor: '#e1e3e9',
    padding: 20,
  },
  placeholderText: {
    color: '#667788',
    fontSize: 16,
    lineHeight: 21,
  },
});
