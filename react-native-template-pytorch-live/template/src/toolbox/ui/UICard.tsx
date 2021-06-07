/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import React, {useState} from 'react';
import {
  StyleSheet,
  ScrollView,
  SafeAreaView,
  View,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native';

const photo1 = require('../../../assets/images/wnn_photo1_fpo.jpg');
const photo2 = require('../../../assets/images/wnn_photo2_fpo.jpg');
const photo3 = require('../../../assets/images/swan.jpg');

type CardProps = {
  item: {name: string; info: string; img: any};
  onSelect?: (name: string) => {};
};

function Card({item, onSelect}: CardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => {
        if (onSelect) onSelect(item.name);
      }}>
      <View style={styles.card}>
        <View style={styles.thumbnail}>
          <Image source={item.img} style={styles.thumb_image} />
        </View>

        <View style={styles.label}>
          <Text style={styles.titleText}>{item.name}</Text>
          <Text style={styles.infoText}>{item.info}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function UICard() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.wrapper}>
          <Card item={{name: 'hello', info: 'world', img: photo1}} />
          <Card item={{name: 'hello', info: 'world', img: photo2}} />
          <Card item={{name: 'hello', info: 'world', img: photo3}} />
          <Card item={{name: 'hello', info: 'world', img: photo1}} />
          <Card item={{name: 'hello', info: 'world', img: photo2}} />
          <Card item={{name: 'hello', info: 'world', img: photo3}} />
          <Card item={{name: 'hello', info: 'world', img: photo1}} />
          <Card item={{name: 'hello', info: 'world', img: photo2}} />
          <Card item={{name: 'hello', info: 'world', img: photo3}} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// You can customize your UI elements using CSS-like properties.
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    backgroundColor: '#ffe2e7',
  },
  wrapper: {
    paddingVertical: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    alignContent: 'flex-start',
  },
  card: {
    overflow: 'hidden',
    width: 160,
    height: 200,
    margin: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 4,
    flexDirection: 'column',
    alignSelf: 'flex-start',
  },
  thumbnail: {
    flex: 0.7,
    backgroundColor: '#9ab',
  },
  thumb_image: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  label: {
    flex: 0.3,
    marginBottom: 5,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#123',
  },
  infoText: {
    fontSize: 11,
    color: '#345',
  },
});
