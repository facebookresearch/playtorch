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

import ImageScale from './apiTest/ImageScale';
import CanvasArc from './apiTest/CanvasArc';
import CanvasClearRect from './apiTest/CanvasClearRect';
import CanvasFillRect from './apiTest/CanvasFillRect';
import CanvasRect from './apiTest/CanvasRect';
import CanvasAnimation from './apiTest/CanvasAnimation';
import CanvasRotate from './apiTest/CanvasRotate';
import CanvasSaveRestore from './apiTest/CanvasSaveRestore';
import CanvasSetTransform from './apiTest/CanvasSetTransform';
import CanvasScale from './apiTest/CanvasScale';
import CanvasTranslate from './apiTest/CanvasTranslate';
import CanvasLineCap from './apiTest/CanvasLineCap';
import CanvasLineJoin from './apiTest/CanvasLineJoin';
import CanvasClosePath from './apiTest/CanvasClosePath';
import CanvasMiterLimit from './apiTest/CanvasMiterLimit';
import CanvasMoveTo from './apiTest/CanvasMoveTo';
import CanvasDrawImage from './apiTest/CanvasDrawImage';
import CanvasText from './apiTest/CanvasText';
import CanvasTextAlign from './apiTest/CanvasTextAlign';
import CanvasArcMatrix from './apiTest/CanvasArcMatrix';

import ToolboxContext, {useToolboxContext} from './ToolboxContext';
import ToolboxList from './ToolboxList';
import CanvasGetImageData from './apiTest/CanvasGetImageData';
import Playground from './Playground';
import CanvasImageSprite from './apiTest/CanvasImageSprite';
import AstroBirdExample from './apiTest/AstroBirdExample';
import MNIST from './models/MNIST';

export type Tool = {
  icon?: React.ReactNode;
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
    title: 'Playground',
    data: [
      {
        icon: <Icon name="clipboard-text" size={32} color="white" />,
        title: 'Playground',
        subtitle: 'A playground to experiment with the PyTorch Core API',
        apiTest: false,
        component: Playground,
      },
      {
        icon: <Icon name="clipboard-text" size={32} color="white" />,
        title: 'Astro Bird',
        subtitle: 'A little game to test performance',
        apiTest: false,
        component: AstroBirdExample,
      },
    ],
  },
  {
    title: 'Models',
    data: [
      {
        icon: <Icon name="clipboard-text" size={32} color="white" />,
        title: 'MNIST',
        subtitle: 'Handwritten digit classifier',
        apiTest: false,
        component: MNIST,
      },
    ],
  },
  {
    title: 'API Test',
    data: [
      {
        icon: <Icon name="clipboard-text" size={32} color="white" />,
        title: 'Canvas#rect',
        subtitle: 'Drawing rect on a canvas',
        apiTest: true,
        component: CanvasRect,
      },
      {
        icon: <Icon name="clipboard-text" size={32} color="white" />,
        title: 'Canvas#fillRect',
        subtitle: 'Drawing filled rect on a canvas',
        apiTest: true,
        component: CanvasFillRect,
      },
      {
        icon: <Icon name="clipboard-text" size={32} color="white" />,
        title: 'Canvas#clearRect',
        subtitle: 'Clear rect on a canvas',
        apiTest: true,
        component: CanvasClearRect,
      },
      {
        icon: <Icon name="clipboard-text" size={32} color="white" />,
        title: 'Canvas#arc',
        subtitle: 'Drawing arc/circles on a canvas',
        apiTest: true,
        component: CanvasArc,
      },
      {
        icon: <Icon name="clipboard-text" size={32} color="white" />,
        title: 'Canvas Arc Matrix',
        subtitle: 'Drawing an arcs matrix on a canvas',
        apiTest: true,
        component: CanvasArcMatrix,
      },
      {
        icon: <Icon name="clipboard-text" size={32} color="white" />,
        title: 'Canvas Animation',
        subtitle: 'Animate drawings on canvas',
        apiTest: true,
        component: CanvasAnimation,
      },
      {
        icon: <Icon name="clipboard-text" size={32} color="white" />,
        title: 'Canvas Save and Restore',
        subtitle: 'Save, draw, and restore context',
        component: CanvasSaveRestore,
        apiTest: true,
      },
      {
        icon: <Icon name="clipboard-text" size={32} color="white" />,
        title: 'Canvas Set Transform',
        subtitle: 'Draw with transform',
        apiTest: true,
        component: CanvasSetTransform,
      },
      {
        icon: <Icon name="clipboard-text" size={32} color="white" />,
        title: 'Canvas Scale',
        subtitle: 'Drawing with scale on canvas',
        apiTest: true,
        component: CanvasScale,
      },
      {
        icon: <Icon name="clipboard-text" size={32} color="white" />,
        title: 'Canvas Rotate',
        subtitle: 'Drawing with rotate on canvas',
        apiTest: true,
        component: CanvasRotate,
      },
      {
        icon: <Icon name="clipboard-text" size={32} color="white" />,
        title: 'Canvas Translate',
        subtitle: 'Drawing with translate on canvas',
        apiTest: true,
        component: CanvasTranslate,
      },
      {
        icon: <Icon name="clipboard-text" size={32} color="white" />,
        title: 'Canvas#moveTo',
        subtitle: 'Drawing lines on a canvas',
        apiTest: true,
        component: CanvasMoveTo,
      },
      {
        icon: <Icon name="clipboard-text" size={32} color="white" />,
        title: 'Canvas#lineCap',
        subtitle: 'Drawing lines with line cap on a canvas',
        apiTest: true,
        component: CanvasLineCap,
      },
      {
        icon: <Icon name="clipboard-text" size={32} color="white" />,
        title: 'Canvas#lineJoin',
        subtitle: 'Drawing lines with line join on a canvas',
        apiTest: true,
        component: CanvasLineJoin,
      },
      {
        icon: <Icon name="clipboard-text" size={32} color="white" />,
        title: 'Canvas#miterLimit',
        subtitle: 'Drawing lines with miter limit on a canvas',
        apiTest: true,
        component: CanvasMiterLimit,
      },
      {
        icon: <Icon name="clipboard-text" size={32} color="white" />,
        title: 'Canvas#closePath',
        subtitle: 'Close path on a canvas',
        apiTest: true,
        component: CanvasClosePath,
      },
      {
        icon: <Icon name="clipboard-text" size={32} color="white" />,
        title: 'Image Scale',
        subtitle: 'Scaling images',
        apiTest: true,
        component: ImageScale,
      },
      {
        icon: <Icon name="clipboard-text" size={32} color="white" />,
        title: 'Canvas#getImageData',
        subtitle: 'Retrieve ImageData and draw as image on a canvas',
        apiTest: true,
        component: CanvasGetImageData,
      },
      {
        icon: <Icon name="clipboard-text" size={32} color="white" />,
        title: 'Canvas#drawImage',
        subtitle: 'Drawing images on a canvas',
        apiTest: true,
        component: CanvasDrawImage,
      },
      {
        icon: <Icon name="clipboard-text" size={32} color="white" />,
        title: 'Canvas Text',
        subtitle: 'Drawing text on canvas',
        apiTest: true,
        component: CanvasText,
      },
      {
        icon: <Icon name="clipboard-text" size={32} color="white" />,
        title: 'Canvas#textAlign',
        subtitle: 'Drawing aligned text on canvas',
        apiTest: true,
        component: CanvasTextAlign,
      },
      {
        icon: <Icon name="clipboard-text" size={32} color="white" />,
        title: 'Canvas Image Sprite',
        subtitle: 'Draw and transform images from an image sprite',
        apiTest: true,
        component: CanvasImageSprite,
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
