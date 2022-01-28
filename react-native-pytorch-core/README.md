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
import * as React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';

import {MobileModel, ImageUtil} from 'react-native-pytorch-core';

// Have a look at how to prepare a model for PyTorch Live
// https://pytorch.org/live/docs/tutorials/prepare-custom-model/
const model = require('./mobilenet_v3_small.ptl');

// JSON array of classes that map the max idx to a class label
const IMAGE_CLASSES = require('./image_classes.json');

type ImageClassificationResult = {
  maxIdx: number;
  confidence: number;
};

export default function ImageClassificaion() {
  const [topClass, setTopClass] = React.useState<string>('');
  async function classifyImage() {
    const image = await ImageUtil.fromURL('https://pytorch.org/example.jpg');
    const {metrics, result} =
      await MobileModel.execute<ImageClassificationResult>(model, {
        image,
      });

    console.log(metrics);
    if (result.confidence > 0.7) {
      setTopClass(IMAGE_CLASSES[result.maxIdx]);
    } else {
      setTopClass('low confidence');
    }
  }

  return (
    <View style={StyleSheet.absoluteFill}>
      <Button title="Classify Image" onPress={classifyImage} />
      <Text>{topClass}</Text>
    </View>
  );
}
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
