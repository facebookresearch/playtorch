/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import * as React from 'react';
import {
  Image,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AstroBirdExample from './AstroBirdExample';
import CameraExample from './CameraExample';
import CanvasExample from './CanvasExample';
import NLPExample from './NLPQAExample';
import PhotosExample from './PhotosExample';

const contents = [
  {
    title: 'Image Classification',
    data: [
      {
        name: 'Photo example',
        info: 'Identify the contents in a photo',
        component: 'PhotosExample',
        img: require('../../assets/images/plane.jpg'),
      },
      {
        name: 'Camera example',
        info: 'Identify objects in the camera',
        component: 'CameraExample',
        img: require('../../assets/images/flamingo.jpg'),
      },
    ],
  },
  {
    title: 'NLP',
    data: [
      {
        name: 'QA example',
        info: 'Question answering using Bert',
        component: 'NLPExample',
        img: require('../../assets/images/nlp_screenshot.jpg'),
      },
    ],
  },
  {
    title: 'Visualization',
    data: [
      {
        name: 'Canvas example',
        info: 'An interactive composition that demonstrates canvas features',
        component: 'CanvasExample',
        img: require('../../assets/images/canvas_example.jpg'),
      },
    ],
  },
  {
    title: 'Game',
    data: [
      {
        name: 'Astro Bird',
        info: 'A little game to test performance',
        component: 'AstroBirdExample',
        img: require('../../assets/images/astro_bird.jpg'),
      },
    ],
  },
];

type ExampleProp = {
  item: {name: string; info: string; component: string; img: any};
  onSelect: (name: string) => {};
};

const ExampleCard = ({item, onSelect}: ExampleProp) => {
  return (
    <View style={styles.card}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onSelect(item.component)}>
        <View style={styles.label}>
          <Text style={styles.titleText}>{item.name}</Text>
          <Text style={styles.infoText}>{item.info}</Text>
        </View>
        <View style={styles.thumbnail}>
          <Image source={item.img} style={styles.thumb_image} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const ExampleSection = ({title}: {title: string}) => {
  return (
    <View style={styles.category}>
      <Text style={styles.categoryLabel}>{title}</Text>
    </View>
  );
};

function ExampleScreen({navigation}: any) {
  return (
    <SectionList
      style={styles.bg}
      sections={contents}
      keyExtractor={(item, index) => item.name + index}
      renderItem={({item}) => (
        <ExampleCard item={item} onSelect={navigation.navigate} />
      )}
      renderSectionHeader={({section: {title}}) => (
        <ExampleSection title={title} />
      )}
    />
  );
}

const Stack = createStackNavigator();

export default function Examples() {
  return (
    <Stack.Navigator
      initialRouteName="Examples"
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}>
      <Stack.Screen
        name="Examples"
        options={{headerShown: false}}
        component={ExampleScreen}
      />
      <Stack.Screen name="PhotosExample" component={PhotosExample} />
      <Stack.Screen name="CameraExample" component={CameraExample} />
      <Stack.Screen name="NLPExample" component={NLPExample} />
      <Stack.Screen name="CanvasExample" component={CanvasExample} />
      <Stack.Screen name="AstroBirdExample" component={AstroBirdExample} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  bg: {
    paddingLeft: 40,
    paddingRight: 40,
    backgroundColor: '#60f',
    alignSelf: 'stretch',
    height: '100%',
  },
  category: {
    marginTop: 40,
    marginBottom: 20,
  },
  categoryLabel: {
    fontSize: 13,
    color: '#fff',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  card: {
    overflow: 'hidden',
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9,
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1,
    marginBottom: 40,
  },
  thumbnail: {
    height: 250,
    backgroundColor: '#9ab',
  },
  thumb_image: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  label: {
    padding: 20,
    marginBottom: 5,
    flexDirection: 'column',
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#123',
    marginBottom: 2,
  },
  infoText: {
    fontSize: 13,
    color: '#345',
  },
});
