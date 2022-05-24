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
import {ScrollView, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AstroBirdExample from './apiTest/AstroBirdExample';
import AudioExample from './apiTest/audio/AudioExample';
import AudioSaveLoadExample from './apiTest/audio/AudioSaveLoadExample';
import BlobImageConversion from './apiTest/blob/BlobImageConversion';
import BlobTensorImageConversion from './apiTest/blob/BlobTensorImageConversion';
import CameraFlip from './apiTest/camera/CameraFlip';
import CameraTakePicture from './apiTest/camera/CameraTakePicture';
import CanvasAnimation from './apiTest/CanvasAnimation';
import CanvasArc from './apiTest/CanvasArc';
import CanvasArcMatrix from './apiTest/CanvasArcMatrix';
import CanvasClearRect from './apiTest/CanvasClearRect';
import CanvasClosePath from './apiTest/CanvasClosePath';
import CanvasDrawImage from './apiTest/CanvasDrawImage';
import CanvasFillRect from './apiTest/CanvasFillRect';
import CanvasGetImageData from './apiTest/CanvasGetImageData';
import CanvasImageSprite from './apiTest/CanvasImageSprite';
import CanvasLineCap from './apiTest/CanvasLineCap';
import CanvasLineJoin from './apiTest/CanvasLineJoin';
import CanvasMiterLimit from './apiTest/CanvasMiterLimit';
import CanvasMoveTo from './apiTest/CanvasMoveTo';
import CanvasRect from './apiTest/CanvasRect';
import CanvasRotate from './apiTest/CanvasRotate';
import CanvasSaveRestore from './apiTest/CanvasSaveRestore';
import CanvasScale from './apiTest/CanvasScale';
import CanvasSetTransform from './apiTest/CanvasSetTransform';
import CanvasText from './apiTest/CanvasText';
import CanvasTextAlign from './apiTest/CanvasTextAlign';
import CanvasTranslate from './apiTest/CanvasTranslate';
import ImageScale from './apiTest/ImageScale';
import JSIPlayground from './JSIPlayground';
import AnimeGANv2 from './models/AnimeGANv2';
import DETR from './models/DETR';
import Distilbert from './models/Distilbert';
import FastNeuralStyle from './models/FastNeuralStyle';
import MNIST from './models/MNIST';
import MobileNetV3 from './models/MobileNetV3';
import Wav2Vec2 from './models/Wav2Vec2';
import Playground from './Playground';
import ToolboxContext, {useToolboxContext} from './ToolboxContext';
import ToolboxList from './ToolboxList';

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
        title: 'JSI Playground',
        subtitle: 'A JSI playground to experiment with the PyTorch Core API',
        apiTest: false,
        component: JSIPlayground,
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
        title: 'MobileNet V3',
        subtitle: 'Example image classificaion with MobileNet V3',
        apiTest: false,
        component: MobileNetV3,
      },
      {
        icon: <Icon name="clipboard-text" size={32} color="white" />,
        title: 'MNIST',
        subtitle: 'Handwritten digit classifier',
        apiTest: false,
        component: MNIST,
      },
      {
        icon: <Icon name="clipboard-text" size={32} color="white" />,
        title: 'DETR',
        subtitle: 'Example to test the DETR model',
        apiTest: false,
        component: DETR,
      },
      {
        icon: <Icon name="clipboard-text" size={32} color="white" />,
        title: 'Fast Neural Style',
        subtitle: 'Example for a neural style transfer model',
        apiTest: false,
        component: FastNeuralStyle,
      },
      {
        icon: <Icon name="clipboard-text" size={32} color="white" />,
        title: 'Distilbert',
        subtitle: 'Example for the Distilbert NLP Q&A model',
        apiTest: false,
        component: Distilbert,
      },
      {
        icon: <Icon name="clipboard-text" size={32} color="white" />,
        title: 'Wav2Vec2',
        subtitle: 'Example to test the Wav2Vec2 model',
        apiTest: false,
        component: Wav2Vec2,
      },
      {
        icon: <Icon name="clipboard-text" size={32} color="white" />,
        title: 'AnimeGANv2',
        subtitle: 'Example to test the AnimeGANv2 model',
        apiTest: false,
        component: AnimeGANv2,
      },
    ],
  },
  {
    title: 'Camera API Test',
    data: [
      {
        icon: <Icon name="clipboard-text" size={32} color="white" />,
        title: 'Camera#takePicture',
        subtitle: 'Manually calling takePicture API on camera',
        apiTest: true,
        component: CameraTakePicture,
      },
      {
        icon: <Icon name="clipboard-text" size={32} color="white" />,
        title: 'Camera#flip',
        subtitle: 'Manually calling flip API on camera',
        apiTest: true,
        component: CameraFlip,
      },
    ],
  },
  {
    title: 'Canvas API Test',
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
  {
    title: 'Audio API Test',
    data: [
      {
        icon: <Icon name="clipboard-text" size={32} color="white" />,
        title: 'Audio APIs',
        subtitle: 'Record an audio and test audio APIs on the recorded clip.',
        apiTest: true,
        component: AudioExample,
      },
      {
        icon: <Icon name="clipboard-text" size={32} color="white" />,
        title: 'Audio Load & Save Example',
        subtitle: 'Record an audio and save to a file on device.',
        apiTest: true,
        component: AudioSaveLoadExample,
      },
    ],
  },
  {
    title: 'Blob API Tests',
    data: [
      {
        icon: <Icon name="clipboard-text" size={32} color="white" />,
        title: 'Blob <> Image',
        subtitle: 'Transform between blob and image',
        apiTest: true,
        component: BlobImageConversion,
      },
      {
        icon: <Icon name="clipboard-text" size={32} color="white" />,
        title: 'Blob <> Tensor <> Image',
        subtitle: 'Transform among blob, tensor and image',
        apiTest: true,
        component: BlobTensorImageConversion,
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
