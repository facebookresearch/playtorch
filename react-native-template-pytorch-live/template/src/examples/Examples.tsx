/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
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
  ImageSourcePropType,
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
import ObjectDetectionExample from './ObjectDetectionExample';
import MNISTExample from './MNISTExample';

type Example = {
  name: string;
  info: string;
  key: string;
  component: () => JSX.Element | null;
  img: ImageSourcePropType;
};

type ExampleSection = {
  title: string;
  data: Example[];
};

const EXAMPLE_SECTIONS: ExampleSection[] = [
  {
    title: 'VISION',
    data: [
      {
        name: 'Photo example',
        info: 'Identify the contents in a photo',
        key: 'PhotosExample',
        component: PhotosExample,
        img: require('../../assets/images/thumbnail_Photo.jpg'),
      },
      {
        name: 'Camera example',
        info: 'Identify objects in the camera',
        key: 'CameraExample',
        component: CameraExample,
        img: require('../../assets/images/thumbnail_Camera.jpg'),
      },
      {
        name: 'Object detection example',
        info: 'Identify objects with the camera',
        key: 'ObjectDetectionExample',
        component: ObjectDetectionExample,
        img: require('../../assets/images/thumbnail_ObjectDetection.jpg'),
      },
      {
        name: 'MNIST example',
        info: 'An end-to-end example of implementing a custom model in a fun demo',
        key: 'MNISTExample',
        component: MNISTExample,
        img: require('../../assets/images/thumbnail_MNIST.jpg'),
      },
    ],
  },
  {
    title: 'NLP',
    data: [
      {
        name: 'QA example',
        info: 'Question answering using Bert',
        key: 'NLPExample',
        component: NLPExample,
        img: require('../../assets/images/thumbnail_QA.jpg'),
      },
    ],
  },
  {
    title: 'Visualization',
    data: [
      {
        name: 'Canvas example',
        info: 'An interactive composition that demonstrates canvas features',
        key: 'CanvasExample',
        component: CanvasExample,
        img: require('../../assets/images/thumbnail_Canvas.jpg'),
      },
    ],
  },
  {
    title: 'Game',
    data: [
      {
        name: 'Astro Bird',
        info: 'A little game to test performance',
        key: 'AstroBirdExample',
        component: AstroBirdExample,
        img: require('../../assets/images/thumbnail_AstroBird.jpg'),
      },
    ],
  },
];

type ExampleProp = {
  example: Example;
  onSelect: (name: string) => {};
};

const ExampleCard = ({example, onSelect}: ExampleProp) => {
  return (
    <View style={styles.card}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onSelect(example.key)}>
        <View style={styles.label}>
          <Text style={styles.titleText}>{example.name}</Text>
          <Text style={styles.infoText}>{example.info}</Text>
        </View>
        <View style={styles.thumbnail}>
          <Image source={example.img} style={styles.thumb_image} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const ExampleSection = ({title}: Pick<ExampleSection, 'title'>) => {
  return (
    <View style={styles.category}>
      <Text style={styles.categoryLabel}>{title}</Text>
    </View>
  );
};

function ExampleScreen({navigation}: any) {
  return (
    <>
      <View style={styles.full}>
        <Image
          style={styles.gradient}
          source={require('../../assets/images/gradient_bg1.png')}></Image>
      </View>
      <SectionList
        style={styles.container}
        sections={EXAMPLE_SECTIONS}
        keyExtractor={(item, index) => item.name + index}
        renderItem={({item}) => (
          <ExampleCard example={item} onSelect={navigation.navigate} />
        )}
        renderSectionHeader={({section: {title}}) => (
          <ExampleSection title={title} />
        )}
      />
    </>
  );
}

const Stack = createStackNavigator();

export default function Examples() {
  const examples = React.useMemo(() => {
    return EXAMPLE_SECTIONS.map(section => {
      return section.data;
    }).reduce((prev, curr) => [...prev, ...curr]);
  }, [EXAMPLE_SECTIONS]);

  return (
    <Stack.Navigator
      initialRouteName="Examples"
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontSize: 16,
        },
      }}>
      <Stack.Screen
        name="Examples"
        options={{headerShown: false}}
        component={ExampleScreen}
      />
      {examples.map(example => {
        return (
          <Stack.Screen
            key={example.key}
            name={example.key}
            component={example.component}
            options={{
              title: example.name,
            }}
          />
        );
      })}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignSelf: 'stretch',
    paddingLeft: 40,
    paddingRight: 40,
  },
  category: {
    marginTop: 40,
    marginBottom: 20,
  },
  categoryLabel: {
    fontSize: 13,
    letterSpacing: 5,
    color: '#fff',
    textTransform: 'uppercase',
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
  full: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#c34166',
  },
  gradient: {
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
  },
});
