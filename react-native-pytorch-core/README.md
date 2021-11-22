# react-native-pytorch-core

PyTorch core library for React Native

## Installation

```sh
npm install react-native-pytorch-core
```

## Usage

```js
import { MobileModel, Image } from "react-native-pytorch-core";

// ...
const image = Image.from('https://pytorch.org/example.jpg');
const result = await MobileModel.run('resnet18_model.pt', image);
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
