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
import {ScrollView, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import CameraFrameByFrame from './camera/CameraFrameByFrame';
import CameraTakePicture from './camera/CameraTakePicture';

import CanvasShapes from './canvas/CanvasShapes';
import CanvasStarter from './canvas/CanvasStarter';
import CanvasAnimator from './canvas/CanvasAnimator';
import CanvasTransform from './canvas/CanvasTransform';
import CanvasDrawing from './canvas/CanvasDrawing';
import Images from './canvas/Images';

import UIStarter from './ui/UIStarter';
import UICard from './ui/UICard';

import GetRequest from './data/GetRequest';
import PostRequest from './data/PostRequest';

import ToolboxContext, {useToolboxContext} from './ToolboxContext';
import ToolboxList from './ToolboxList';

export type Tool = {
  icon?: JSX.Element;
  title: string;
  subtitle: string;
  apiTest?: boolean;
  component?: React.ComponentType<any>;
};

export type ToolSection = {
  title: string;
  data: Tool[];
}[];

const tools: ToolSection = [
  {
    title: 'UI',
    data: [
      {
        icon: <Icon name="format-float-left" size={32} color="white" />,
        title: 'UI Starter',
        subtitle: 'This template helps you start with building UI quickly',
        component: UIStarter,
      },
      {
        icon: <Icon name="format-float-left" size={32} color="white" />,
        title: 'UI Card',
        subtitle: 'An example gallery of image cards',
        component: UICard,
      },
    ],
  },

  {
    title: 'Canvas',
    data: [
      {
        icon: <Icon name="shape-plus" size={32} color="white" />,
        title: 'Canvas Starter',
        subtitle: 'This template helps you start with canvas drawing quickly',
        component: CanvasStarter,
      },
      {
        icon: <Icon name="shape-plus" size={32} color="white" />,
        title: 'Canvas Shapes',
        subtitle: 'Drawing shapes on a canvas',
        component: CanvasShapes,
      },
      {
        icon: <Icon name="shape-plus" size={32} color="white" />,
        title: 'Canvas Animator',
        subtitle: 'An easy way to create animations',
        component: CanvasAnimator,
      },
      {
        icon: <Icon name="shape-plus" size={32} color="white" />,
        title: 'Canvas Transform',
        subtitle: 'Affine transforms like scale, rotate, and skew',
        component: CanvasTransform,
      },
      {
        icon: <Icon name="shape-plus" size={32} color="white" />,
        title: 'Canvas Drawing',
        subtitle: 'Basic interactive drawing on canvas',
        component: CanvasDrawing,
      },
    ],
  },

  {
    title: 'Camera and Images',
    data: [
      {
        icon: <Icon name="image-size-select-actual" size={32} color="white" />,
        title: 'Images',
        subtitle: 'Different ways to display images',
        component: Images,
      },
      {
        icon: <Icon name="video" size={32} color="white" />,
        title: 'Camera Frame By Frame',
        subtitle: 'Frame by frame processing of camera images',
        component: CameraFrameByFrame,
      },
      {
        icon: <Icon name="camera" size={32} color="white" />,
        title: 'Camera Take Picture',
        subtitle: 'Take picture processing',
        component: CameraTakePicture,
      },
    ],
  },

  {
    title: 'Server and Data',
    data: [
      {
        icon: <Icon name="image-size-select-actual" size={32} color="white" />,
        title: 'GET Request',
        subtitle: 'Request and display images from a public API service',
        component: GetRequest,
      },
      {
        icon: <Icon name="image-size-select-actual" size={32} color="white" />,
        title: 'POST Request',
        subtitle: 'Send a POST request to server and receive a mock response',
        component: PostRequest,
      },
    ],
  },
];

type ToolboxParamList = {
  API: undefined;
  ToolView: {
    title: string;
  };
};

const Stack = createStackNavigator<ToolboxParamList>();

function ToolView() {
  const {activeTool} = useToolboxContext();
  const Component = activeTool?.component;
  return (
    <ScrollView contentContainerStyle={styles.container} bounces={false}>
      {Component && <Component />}
    </ScrollView>
  );
}

export default function Toolbox() {
  return (
    <ToolboxContext>
      <Stack.Navigator
        screenOptions={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontSize: 16,
          },
        }}>
        <Stack.Screen name="API" options={{headerShown: false}}>
          {props => (
            <ToolboxList
              {...props}
              tools={tools}
              onSelect={tool => {
                props.navigation.navigate('ToolView', {
                  title: tool.title,
                });
              }}
            />
          )}
        </Stack.Screen>
        <Stack.Screen
          name="ToolView"
          component={ToolView}
          options={({route}) => {
            if (route != null) {
              return {title: route.params.title};
            }
            return {};
          }}
        />
      </Stack.Navigator>
    </ToolboxContext>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
