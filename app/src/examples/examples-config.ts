/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @oncall playtorch
 */

import {Example, ExampleCategory} from '../types/example';
import AnimeGANExample from './cv/AnimeGANExample';
import CameraExample from './cv/CameraExample';
import ImageSegmentationExample from './cv/ImageSegmentationExample';
import MNISTExample from './cv/MNISTExample';
import ObjectDetectionExample from './cv/ObjectDetectionExample';
import PhotosExample from './cv/PhotosExample';
import AstroBirdExample from './game/AstroBirdExample';
import NLPQAExample from './nlp/NLPQAExample';
import CanvasExample from './visualization/CanvasExample';

const AnimeGANExampleConfig: Example = {
  title: 'AnimeGAN',
  slug: 'anime-gan',
  description: 'Transform photos into anime style images',
  component: AnimeGANExample,
  img: require('../assets/examples/cv/AnimeGan.png'),
};

const ImageSegmentationExampleConfig: Example = {
  title: 'Image Segmentation',
  slug: 'image-segmentation',
  description: 'Pixel by pixel image segmentation',
  component: ImageSegmentationExample,
  img: require('../assets/examples/cv/ImageSegmentation.png'),
};

const PhotosExampleConfig: Example = {
  title: 'Photo',
  slug: 'photo',
  description: 'Identify the contents in a photo',
  component: PhotosExample,
  img: require('../assets/examples/Photo.png'),
};

const CameraExampleConfig: Example = {
  title: 'Camera',
  slug: 'camera',
  description: 'Identify objects in the camera',
  component: CameraExample,
  img: require('../assets/examples/Camera.png'),
  needsCameraPermissions: true,
};

const ObjectDetectionExampleConfig: Example = {
  title: 'Object detection',
  slug: 'object-detection',
  description: 'Identify objects with the camera',
  component: ObjectDetectionExample,
  img: require('../assets/examples/Object_Detection.png'),
  needsCameraPermissions: true,
};

const MNISTExampleConfig: Example = {
  title: 'MNIST',
  slug: 'mnist',
  description:
    'An end-to-end example of implementing a custom model in a fun demo',
  component: MNISTExample,
  img: require('../assets/examples/MNIST.png'),
};

const QAExampleConfig: Example = {
  title: 'QA',
  slug: 'qa',
  description: 'Question answering using Distilbert',
  component: NLPQAExample,
  img: require('../assets/examples/QA.png'),
};

const CanvasExampleConfig: Example = {
  title: 'Canvas',
  slug: 'canvas',
  description: 'An interactive composition that demonstrates canvas features',
  component: CanvasExample,
  img: require('../../assets/images/thumbnail_Canvas.jpg'),
};

const AstroBirdExampleConfig: Example = {
  title: 'Astro Bird',
  slug: 'astro-bird',
  description: 'A little game to test performance',
  component: AstroBirdExample,
  img: require('../../assets/images/thumbnail_AstroBird.jpg'),
};

export const EXAMPLES_BY_CATEGORY: {[key in ExampleCategory]: Example[]} = {
  Vision: [
    AnimeGANExampleConfig,
    ImageSegmentationExampleConfig,
    PhotosExampleConfig,
    CameraExampleConfig,
    ObjectDetectionExampleConfig,
    MNISTExampleConfig,
  ],
  NLP: [QAExampleConfig],
  Visualization: [CanvasExampleConfig],
  Game: [AstroBirdExampleConfig],
};

export const ALL_EXAMPLES: Example[] = Object.values(
  EXAMPLES_BY_CATEGORY,
).reduce((prev, curr) => prev.concat(curr), []);

export const EXAMPLES_BY_SLUG: {[key: string]: Example} = ALL_EXAMPLES.reduce(
  (prev, curr) => ({...prev, [curr.slug]: curr}),
  {},
);
