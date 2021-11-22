/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import * as React from 'react';
import {FlatList, Image, StyleSheet, TouchableHighlight} from 'react-native';

const images = [
  'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/golden-retriever-royalty-free-image-506756303-1560962726.jpg?crop=0.672xw:1.00xh;0.166xw,0&resize=640:*',
  'https://cdn.mos.cms.futurecdn.net/mEuBJTDhXuTfSKdLefzSKg.jpg',
  'https://www.hppr.org/sites/hppr/files/201904/ls_hedgehog.jpg',
  'https://wehco.media.clients.ellingtoncms.com/img/photos/2019/06/17/resized_250499-1b-deer-0618_85-26607_t800.JPG?90232451fbcadccc64a17de7521d859a8f88077d',
  'https://ymcagbw.org/sites/default/files/styles/node_blog/public/2020-03/short-tailed_weasel.jpg?h=974e650f&itok=mPFDLcOm',
  'https://www.mymove.com/wp-content/uploads/2020/08/GettyImages-980510606-1-scaled.jpg',
];

type Props = {
  onSelectImage: (uri: string) => void;
};

export default function PredefinedImageList({onSelectImage}: Props) {
  const renderItem = ({item: imageUri}: any) => (
    <TouchableHighlight onPress={() => onSelectImage(imageUri)}>
      <Image style={styles.image} source={{uri: imageUri}} />
    </TouchableHighlight>
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
    flex: 1,
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
});
