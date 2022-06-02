# PyTorch core library for React Native

The PyTorch core library for React Native is part of the PyTorch Live project. Please follow the instructions provided on the [PyTorch Live website](https://pytorch.org/live) as outlined below!

## 🎉 Building your first PyTorch Live app
Follow the [Getting Started guide](https://pytorch.org/live/docs/tutorials/get-started). PyTorch Live offers a CLI with convenient commands to install development dependencies and initialize new projects. We also have a few tutorials for you to keep going after getting started:

* [Image Classification](https://pytorch.org/live/docs/tutorials/image-classification)
* [Question Answering](https://pytorch.org/live/docs/tutorials/question-answering)
* [Prepare Custom Model](https://pytorch.org/live/docs/tutorials/prepare-custom-model)

## 📖 Documentation

The full documentation for PyTorch Live can be found on our [website](https://pytorch.org/live/).

## Example Usage

```javascript
// Import dependencies
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  Camera,
  Image,
  media,
  MobileModel,
  Module,
  Tensor,
  torch,
  torchvision,
} from 'react-native-pytorch-core';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Alias for torchvision transforms
const T = torchvision.transforms;

// URL to the image classification model that is used int his example
const MODEL_URL =
  'https://github.com/pytorch/live/releases/download/v0.1.0/mobilenet_v3_small.ptl';

// URL to the ImageNetClasses JSON file, which is used below to map the
// processed model result to a class label
const IMAGENET_CLASSES_URL =
  'https://github.com/pytorch/live/releases/download/v0.1.0/ImageNetClasses.json';

// Variable to hold a reference to the loaded ML model
let model: Module | null = null;

// Variable to hold a reference to the ImageNet classes
let imageNetClasses: string[] | null = null;

// App function to render a camera and a text
export default function App() {
  // Safe area insets to compensate for notches and bottom bars
  const insets = useSafeAreaInsets();
  // Create a React state to store the top class returned from the
  // classifyImage function
  const [topClass, setTopClass] = React.useState(
    "Press capture button to classify what's in the camera view!",
  );

  // Function to handle images whenever the user presses the capture button
  async function handleImage(image: Image) {
    // Get image width and height
    const width = image.getWidth();
    const height = image.getHeight();

    // Convert image to blob, which is a byte representation of the image
    // in the format height (H), width (W), and channels (C), or HWC for short
    const blob = media.toBlob(image);

    // Get a tensor from image the blob and also define in what format
    // the image blob is.
    let tensor = torch.fromBlob(blob, [height, width, 3]);

    // Rearrange the tensor shape to be [CHW]
    tensor = tensor.permute([2, 0, 1]);

    // Divide the tensor values by 255 to get values between [0, 1]
    tensor = tensor.div(255);

    // Crop the image in the center to be a squared image
    const centerCrop = T.centerCrop(Math.min(width, height));
    tensor = centerCrop(tensor);

    // Resize the image tensor to 3 x 224 x 224
    const resize = T.resize(224);
    tensor = resize(tensor);

    // Normalize the tensor image with mean and standard deviation
    const normalize = T.normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]);
    tensor = normalize(tensor);

    // Unsqueeze adds 1 leading dimension to the tensor
    tensor = tensor.unsqueeze(0);

    // If the model has not been loaded already, it will be downloaded from
    // the URL and then loaded into memory.
    if (model === null) {
      const filePath = await MobileModel.download(MODEL_URL);
      model = await torch.jit._loadForMobile(filePath);
    }

    // Run the ML inference with the pre-processed image tensor
    const output = await model.forward<Tensor, Tensor>(tensor);

    // Get the index of the value with the highest probability
    const maxIdx = output.argmax().item();

    if (imageNetClasses === null) {
      const response = await fetch(IMAGENET_CLASSES_URL);
      imageNetClasses = (await response.json()) as string[];
    }

    // Resolve the most likely class label and return it
    const result = imageNetClasses[maxIdx];

    // Set result as top class label state
    setTopClass(result);

    // Release the image from memory
    image.release();
  }

  return (
    <View style={StyleSheet.absoluteFill}>
      {/* Render camara and make it parent filling */}
      <Camera
        style={[StyleSheet.absoluteFill, { bottom: insets.bottom }]}
        // Add handle image callback on the camera component
        onCapture={handleImage}
      />
      {/* Label container with custom render style and a text */}
      <View style={styles.labelContainer}>
        {/* Change the text to render the top class label */}
        <Text>{topClass}</Text>
      </View>
    </View>
  );
}

// Custom render style for label container
const styles = StyleSheet.create({
  labelContainer: {
    padding: 20,
    margin: 20,
    marginTop: 40,
    borderRadius: 10,
    backgroundColor: 'white',
  },
});
```

## 👏 How to Contribute
The main purpose of this repository is to continue evolving PyTorch Live. We want to make contributing to this project as easy and transparent as possible, and we are grateful to the community for contributing bug fixes and improvements. Read below to learn how you can take part in improving PyTorch Live.

### [Code of Conduct][code]
Facebook has adopted a Code of Conduct that we expect project participants to adhere to.
Please read the [full text][code] so that you can understand what actions will and will not be tolerated.

[code]: https://code.fb.com/codeofconduct/

### [Contributing Guide][contribute]
Read our [**Contributing Guide**][contribute] to learn about our development process, how to propose bugfixes and improvements, and how to build and test your changes to PyTorch Live.

[contribute]: CONTRIBUTING.md

## License
PyTorch Live is MIT licensed, as found in the [LICENSE][license] file.

[license]: LICENSE.md
