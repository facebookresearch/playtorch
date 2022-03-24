/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

declare var performance: any;
declare var __torchlive__: any;
const torch = __torchlive__.torch;
const torchvision = __torchlive__.torchvision;
const vision = __torchlive__.vision;

import * as React from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Platform} from 'react-native';

function argmax(array: number[]): number {
  let max = -Number.MAX_VALUE;
  let ret = -1;
  for (let i = 0; i < array.length; ++i) {
    if (array[i] > max) {
      ret = i;
      max = array[i];
    }
  }
  return ret;
}

export default function JSIPlayground() {
  const [jsResult, setJsResult] = React.useState(0);
  const [cxxResult, setCxxResult] = React.useState(0);
  const [jsElapse, setJsElapse] = React.useState(0);
  const [cxxElapse, setcxxElapse] = React.useState(0);
  const testFunc = async () => {
    console.log('---Test torchlive---');
    console.log(vision);
    console.log(vision.transforms);

    console.log('------------');
    console.log(Platform.OS);
    console.log(torch);
    const size = [3, 3, 3];
    let tensor = torch.rand(size, {dtype: torch.float64});
    const tensorStr = tensor.toString();
    console.log(tensorStr);
    let data = new Float32Array(tensor.data);
    console.log(data);

    if (data.length < 20) {
      console.log('tensor data', tensor.data);
    }

    let startTime = performance.now();
    let result = argmax(Array.from(data));
    let delta = performance.now() - startTime;
    setJsResult(result);
    setJsElapse(delta);
    console.log('argmax (js)', result);
    console.log('elapsed time (js)', delta, 'ms');

    startTime = performance.now();
    result = tensor.argmax();
    delta = performance.now() - startTime;
    setCxxResult(result);
    setcxxElapse(delta);
    console.log('argmax (c++)', result);
    console.log('elapsed time (c++)', delta, 'ms');
    console.log(tensor.toString());
    console.log(tensor.size());
    console.log(tensor.shape);
    console.log(tensor.dtype);

    let testTensor = torch.empty([1, 2]);
    console.log(testTensor.toString());
    testTensor = torch.empty(1, 2);
    console.log(testTensor.toString());
    testTensor = torch.empty([1, 2], {dtype: 'float64'});
    console.log(testTensor.toString());

    console.log('---Test torch.arange---');
    tensor = torch.arange(5);
    console.log(tensor.toString());
    data = new Float32Array(tensor.data);
    console.log(data);
    tensor = torch.arange(1, 4);
    console.log(tensor.toString());
    data = new Float32Array(tensor.data);
    console.log(data);
    tensor = torch.arange(1, 2.5, 0.5);
    console.log(tensor.toString());
    data = new Float32Array(tensor.data);
    console.log(data);

    console.log('---Test torch.randint---');
    tensor = torch.randint(3, 5, [3]);
    console.log(tensor.toString());
    console.log(tensor.shape);
    console.log(tensor.data);
    tensor = torch.randint(10, [2, 2]);
    console.log(tensor.toString());
    console.log(tensor.shape);
    console.log(tensor.data);
    tensor = torch.randint(3, 10, [2, 2]);
    console.log(tensor.toString());
    console.log(tensor.shape);
    console.log(tensor.data);
    tensor = torch.randint(3, 10, [2, 2, 2]);
    console.log(tensor.toString());
    console.log(tensor.shape);
    console.log(tensor.data);

    console.log('---Test squeeze and unsqueeze---');
    tensor = torch.rand([4]);
    console.log(tensor.shape); // [4]
    let tensor2 = tensor.unsqueeze(0);
    console.log(tensor.shape); // [4]
    console.log(tensor2.shape); //  [4,1]
    let tensor3 = tensor.unsqueeze(1);
    console.log(tensor3.shape); //  [1,4]
    let tensor4 = tensor3.squeeze();
    console.log(tensor4.shape); //  [4]

    console.log('---Test tensor.add---');
    let addTensor1 = torch.rand([1, 2]);
    console.log(addTensor1.toString());
    let addTensor2 = addTensor1.add(2);
    console.log(addTensor2.toString());
    let addTensor3 = addTensor1.add(addTensor2);
    console.log(addTensor3.toString());

    console.log('---Test tensor.sub---');
    let subTensor1 = torch.arange(2);
    console.log(subTensor1.toString());
    let subTensor2 = subTensor1.sub(2);
    console.log(subTensor2.toString());
    let subTensor3 = subTensor1.sub(subTensor2);
    console.log(subTensor3.toString());

    console.log('---Test tensor.mul---');
    let tensor1 = torch.arange(10);
    console.log(tensor1.toString());
    tensor2 = tensor1.mul(2);
    console.log(tensor2.toString());
    tensor3 = tensor2.mul(tensor1);
    console.log(tensor3.toString());
    console.log('---Test tensor.softmax---');
    let softmaxTensor1 = torch.arange(2);
    console.log(softmaxTensor1.toString());
    let softmaxTensor2 = softmaxTensor1.softmax(0);
    console.log(softmaxTensor2.toString());

    console.log('---Test torch.tensor---');
    let tensor5 = torch.tensor([
      [
        [1, 2, 3],
        [4, 5, 6],
      ],
      [
        [7, 8, 9],
        [10, 11, 12],
      ],
    ]);
    console.log(tensor5.shape);
    console.log(tensor5.data);
    console.log(tensor5.toString());
    console.log(tensor.dtype);
    tensor5 = torch.tensor(
      [
        [
          [1.1, 2.1, 3],
          [4, 5, 6],
        ],
        [
          [7, 8, 9],
          [10, 11, 12],
        ],
      ],
      {dtype: torch.int},
    );
    console.log(tensor5.shape);
    console.log(tensor5.data);
    console.log(tensor5.toString());
    console.log(tensor5.dtype);

    console.log('---Test tensor.div---');
    let divTensor = torch.arange(1, 10);
    console.log(divTensor.toString());
    tensor2 = divTensor.div(2);
    console.log(tensor2.toString());
    tensor3 = divTensor.div(2, {rounding_mode: 'floor'});
    console.log(tensor3.toString());
    tensor4 = divTensor.div(divTensor);
    console.log(tensor4.toString());
    console.log(tensor2.toString());
    tensor3 = divTensor.div(divTensor, {rounding_mode: 'floor'});
    console.log(tensor3.toString());

    console.log('---Test tensor.abs---');
    let absTensor = torch.tensor([
      [-2, -1],
      [0, 1],
    ]);
    console.log(absTensor.toString());
    let tensorAbsOutput = absTensor.abs();
    console.log(tensorAbsOutput.toString());

    console.log('---test torchvision.centercrop---');
    console.log(torchvision);
    let tensor6 = torch.rand([1, 3, 5, 5]);
    let centerCrop = torchvision.transforms.centerCrop(3);
    let tensor7 = centerCrop.forward(tensor6);
    console.log('original shape: ', tensor6.shape);
    console.log('transfomred shape: ', tensor7.shape);

    console.log('---Test torch.topk---');
    let topkTensor = torch.arange(10, 20);
    console.log(topkTensor.data);
    let [values, indices] = torch.topk(topkTensor, 3);
    console.log(values.data);
    console.log(indices.data);
    console.log('---test torchvision.resize---');
    let tensor8 = torch.rand([1, 3, 100, 100]);
    let resize = torchvision.transforms.resize(20);
    console.log('log resize: ', resize.forward);
    let tenosr9 = resize.forward(tensor8);
    console.log('original shape: ', tensor8.shape);
    console.log('transfomred shape: ', tenosr9.shape);

    console.log('---test torchvision.normalize---');
    const tensor10 = torch.rand([1, 3, 5, 5]);
    const normalize = torchvision.transforms.normalize(
      [0.2, 0.2, 0.2],
      [0.5, 0.5, 0.5],
    );
    console.log('log normalize: ', normalize.forward);
    const normalized = normalize(tensor10);
    const normalizeForwarded = normalize.forward(tensor10);
    console.log(normalized.toString());
    console.log(normalizeForwarded.toString());

    console.log('---test torchvision.grayscale---');
    const tensor11 = torch.rand([1, 3, 5, 5]);
    const grayscale = torchvision.transforms.grayscale();
    console.log('log grayscale: ', grayscale.forward);
    const grayscaled = grayscale(tensor11);
    console.log(grayscaled.toString());
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={testFunc}
        style={styles.button}
        testID="testButton">
        <Text style={styles.buttonTxt}>Test Func</Text>
      </TouchableOpacity>
      <Text>Platform: {Platform.OS}</Text>
      <Text>
        JS returns {jsResult} in {jsElapse} ms.
      </Text>
      <Text>
        C++ returns {cxxResult} in {cxxElapse} ms.
      </Text>
      <Text>
        {jsResult === 0 && jsElapse === 0
          ? 'click to test!'
          : jsResult === cxxResult
          ? 'JSI configured'
          : 'Something wrong'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
  button: {
    width: '95%',
    alignSelf: 'center',
    height: 40,
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonTxt: {
    color: 'white',
  },
});
