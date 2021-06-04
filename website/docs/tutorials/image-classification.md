---
id: image-classification
sidebar_position: 2
---

# Image Classification

## Prerequisites

* [Install PyTorch Live CLI](install-cli)

## Initialize New Project

Let's start by initializing a new project `ImageClassificationTutorial` with the PyTorch Live CLI.

```shell
npx torchlive-cli init ImageClassificationTutorial
```

:::note

The project init can take a few minutes depending on your internet connection and your machine.

:::

After completion, navigate to the `ImageClassificationTutorial` directory created by the `init` command.

```shell
cd ImageClassificationTutorial
```

### Run the project in the emulator

Run the ImageClassificationTutorial project in the Android emulator with the PyTorch Live CLI. The `run-android` command will start the Android emulator, build, deploy, and run the app. The app is named PyTorch Live Example.

```shell
npx torchlive-cli run-android
```

![](/img/tutorial/image_classification_tutorial1.png "The PyTorch Live app running in a virtual device emulator")

## Image Classification Demo

Let's get started with the UI for the image classification. Create a file `ImageClassificationDemo.tsx` in `./src/demos`, copy and paste the code below, and save the file. The initial code creates a component rendering `Image Classification`.

```tsx title="./src/demos/ImageClassificationDemo.tsx"
import * as React from 'react';
import {Text} from 'react-native';

export default function ImageClassifactionDemo() {
  return (
    <Text>Image Classification</Text>
  );
}
```

### Add Image Classification Demo to demos list

For the `ImageClassificationDemo` component to render in the `ImageClassificationTutorial` app, add it to the `MyDemos` component.

```tsx title="./src/demos/MyDemos.tsx"
import * as React from 'react';
import ImageClassifactionDemo from './ImageClassificationDemo';

export default function MyDemos() {
  return (
    <ImageClassifactionDemo />
  );
}
```

![](/img/tutorial/image_classification_tutorial2.png)

### Style the component

Great! Next, add some styling to the image classification component.

```tsx {2,6-8,12-23} title="./src/demos/ImageClassificationDemo.tsx"
import * as React from 'react';
import {Text, StyleSheet, View} from 'react-native';

export default function ImageClassificationDemo() {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Image Classification</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    padding: 20,
    flexGrow: 1,
  },
  label: {
    marginBottom: 10,
  },
});
```

![](/img/tutorial/image_classification_tutorial3.png)

### Add camera component

Add a camera component.

```tsx {3,9,21-27} title="./src/demos/ImageClassificationDemo.tsx"
import * as React from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {Camera} from 'react-native-pytorch-core';

export default function ImageClassificationDemo() {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Image Classification</Text>
      <Camera style={styles.camera} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    flexGrow: 1,
    padding: 20,
  },
  label: {
    marginBottom: 10,
  },
  camera: {
    flexGrow: 1,
    width: '100%',
  },
});
```

![](/img/tutorial/image_classification_tutorial4.png)

### Add capture callback to camera

Add a capture handler that is called when the camera capture button is pressed. The callback logs the image object to the console.

:::caution

Do not omit the `image.release()`.

:::

```tsx {3,7-11,16} title="./src/demos/ImageClassificationDemo.tsx"
import * as React from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {Camera, Image} from 'react-native-pytorch-core';

export default function ImageClassificationDemo() {

  async function handleImage(image: Image) {
    console.log(image);
    // It is important to release the image to avoid memory leaks
    image.release();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Image Classification</Text>
      <Camera style={styles.camera} onCapture={handleImage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    flexGrow: 1,
    padding: 20,
  },
  label: {
    marginBottom: 10,
  },
  camera: {
    flexGrow: 1,
    width: '100%',
  },
});
```

Click on camera capture button and check logged output in terminal.

![](/img/tutorial/image_classification_tutorial5.png)

### Run model inference

Fantastic! Now use the `useImageModelInference` hook to run inference on a captured image. The hook provides a `processImage` function and an `imageClass`. Replace the `console.log` with the `processImage` function and pass in the image object. When the inference finishes, the component re-renders with the top class as label.

```tsx {4-5,7-10,14,17,24} title="./src/demos/ImageClassificationDemo.tsx"
import * as React from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {Camera, Image} from 'react-native-pytorch-core';
import {ModelInfo} from '../Models';
import useImageModelInference from '../useImageModelInference';

const modelInfo: ModelInfo = {
  name: 'MobileNet V3 Small',
  model: require('../../models/mobilenet_v3_small.pt'),
}

export default function ImageClassificationDemo() {

  const {processImage, imageClass} = useImageModelInference(modelInfo);

  async function handleImage(image: Image) {
    await processImage(image);
    // It is important to release the image to avoid memory leaks
    image.release();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{imageClass}</Text>
      <Camera style={styles.camera} onCapture={handleImage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    flexGrow: 1,
    padding: 20,
  },
  label: {
    marginBottom: 10,
  },
  camera: {
    flexGrow: 1,
    width: '100%',
  },
});
```

![](/img/tutorial/image_classification_tutorial6.png)

### Use Frame-by-Frame Images

To process images frame by frame without the need to press the capture button, replace the `onCapture` property on the `Camera` with the `onFrame` property.

```tsx {25-29} title="./src/demos/ImageClassificationDemo.tsx"
import * as React from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {Camera, Image} from 'react-native-pytorch-core';
import {ModelInfo} from '../Models';
import useImageModelInference from '../useImageModelInference';

const modelInfo: ModelInfo = {
  name: 'MobileNet V3 Small',
  model: require('../../models/mobilenet_v3_small.pt'),
}

export default function ImageClassificationDemo() {

  const {processImage, imageClass} = useImageModelInference(modelInfo);

  async function handleImage(image: Image) {
    await processImage(image);
    // It is important to release the image to avoid memory leaks
    image.release();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{imageClass}</Text>
      <Camera
        hideCaptureButton={true}
        style={styles.camera}
        onFrame={handleImage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    flexGrow: 1,
    padding: 20,
  },
  label: {
    marginBottom: 10,
  },
  camera: {
    flexGrow: 1,
    width: '100%',
  },
});
```

Congratulations! You finished your first PyTorch Live tutorial.
