/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

declare var performance: any;

import * as React from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Platform} from 'react-native';
import {Tensor, torch, torchvision} from 'react-native-pytorch-core';

const PRINTABLE_LENGTH = 20;

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

function printTensor(tensor: Tensor, options: string[] = []) {
  const tensorData = tensor.data();
  const logArray = [];

  if (options.includes('shape')) {
    logArray.push(`Shape: ${tensor.shape}`);
  }
  if (options.includes('dtype')) {
    logArray.push(`Data Type: ${tensor.dtype}`);
  }

  const tensorDataStr =
    tensorData.length > PRINTABLE_LENGTH ? tensor.toString() : `${tensorData}`;
  logArray.push(tensorDataStr);
  const logText = logArray.join(', ');
  console.log(logText);
}

export default function JSIPlayground() {
  const [jsResult, setJsResult] = React.useState(0);
  const [cxxResult, setCxxResult] = React.useState(0);
  const [jsElapse, setJsElapse] = React.useState(0);
  const [cxxElapse, setcxxElapse] = React.useState(0);
  const testFunc = async () => {
    console.log('---Test torchlive---');
    console.log(torchvision);
    console.log(torchvision.transforms);

    console.log('------------');
    console.log(Platform.OS);
    console.log(torch);
    const size = [3, 3, 3];
    let tensor = torch.rand(size, {dtype: torch.float64});
    let printOptions = ['data'];
    printTensor(tensor, printOptions);

    let startTime = performance.now();
    let data = new Float32Array(tensor.data());
    let result = argmax(Array.from(data));
    let delta = performance.now() - startTime;
    setJsResult(result);
    setJsElapse(delta);
    console.log('argmax (js)', result);
    console.log('elapsed time (js)', delta, 'ms');

    startTime = performance.now();
    result = tensor.argmax().item();
    delta = performance.now() - startTime;
    setCxxResult(result);
    setcxxElapse(delta);
    console.log('argmax (c++)', result);
    console.log('elapsed time (c++)', delta, 'ms');
    printTensor(tensor, ['shape', 'dtype']);

    printTensor(torch.empty([1, 2]));
    printTensor(torch.empty([1, 2], {dtype: torch.float64}));

    console.log('---Test torch.eye---');
    printOptions = ['shape', 'data'];
    printTensor(torch.eye(0), printOptions);
    printTensor(torch.eye(3), printOptions);
    printTensor(torch.eye(0, 3), printOptions);
    printTensor(torch.eye(3, 0), printOptions);
    printTensor(torch.eye(3, 3, {dtype: 'int32'}), printOptions);

    console.log('---Test torch.arange---');
    printOptions = ['data'];
    printTensor(torch.arange(5), printOptions);
    printTensor(torch.arange(1, 4), printOptions);
    printTensor(torch.arange(1, 2.5, 0.5), printOptions);

    console.log('---Test torch.randint---');
    printOptions = ['shape', 'data'];
    printTensor(torch.randint(3, 5, [3]), printOptions);
    printTensor(torch.randint(10, [2, 2]), printOptions);
    printTensor(torch.randint(3, 10, [2, 2]), printOptions);
    printTensor(torch.randint(3, 10, [2, 2, 2]), printOptions);

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
    const addTensor1 = torch.rand([1, 2]);
    printTensor(addTensor1);
    const addTensor2 = addTensor1.add(2);
    printTensor(addTensor2);
    printTensor(addTensor1.add(addTensor2));

    console.log('---Test tensor.sub---');
    const subTensor1 = torch.arange(2);
    printTensor(subTensor1);
    const subTensor2 = subTensor1.sub(2);
    printTensor(subTensor2);
    printTensor(subTensor1.sub(subTensor2));

    console.log('---Test tensor.mul---');
    let tensor1 = torch.arange(10);
    printTensor(tensor1);
    tensor2 = tensor1.mul(2);
    printTensor(tensor2);
    printTensor(tensor2.mul(tensor1));

    console.log('---Test tensor.softmax---');
    let softmaxTensor1 = torch.arange(2);
    printTensor(softmaxTensor1);
    printTensor(softmaxTensor1.softmax(0));

    console.log('---Test torch.tensor---');
    printOptions = ['shape', 'data', 'dtype'];
    tensor1 = torch.tensor([
      [
        [1, 2, 3],
        [4, 5, 6],
      ],
      [
        [7, 8, 9],
        [10, 11, 12],
      ],
    ]);
    printTensor(tensor1, printOptions);
    tensor2 = torch.tensor(
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
    printTensor(tensor2, printOptions);
    printTensor(torch.tensor(1, {dtype: torch.int}), printOptions);

    console.log('---Test tensor.div---');
    let divTensor = torch.arange(1, 10);
    printTensor(divTensor);
    printTensor(divTensor.div(2));
    printTensor(divTensor.div(2, {roundingMode: 'floor'}));
    printTensor(divTensor.div(divTensor));
    printTensor(divTensor.div(divTensor, {roundingMode: 'floor'}));

    console.log('---Test tensor.abs---');
    let absTensor = torch.tensor([
      [-2, -1],
      [0, 1],
    ]);
    printTensor(absTensor);
    let tensorAbsOutput = absTensor.abs();
    printTensor(tensorAbsOutput);

    console.log('---Test torchvision.centercrop---');
    console.log(torchvision);
    let tensor6 = torch.rand([1, 3, 5, 5]);
    let centerCrop = torchvision.transforms.centerCrop(3);
    let tensor7 = centerCrop.forward(tensor6);
    console.log('original shape: ', tensor6.shape);
    console.log('transformed shape: ', tensor7.shape);

    console.log('---Test tensor.topk---');
    let topkTensor = torch.arange(10, 20);
    console.log(topkTensor.data());
    let [values, indices] = topkTensor.topk(3);
    console.log(values.data());
    console.log(indices.data());

    console.log('---Test torchvision.resize---');
    let tensor8 = torch.rand([1, 3, 100, 100]);
    let resize = torchvision.transforms.resize(20);
    console.log('log resize: ', resize.forward);
    let tensor9 = resize.forward(tensor8);
    console.log('original shape: ', tensor8.shape);
    console.log('transformed shape: ', tensor9.shape);

    console.log('---Test torchvision.normalize---');
    const tensor10 = torch.rand([1, 3, 5, 5]);
    const normalize = torchvision.transforms.normalize(
      [0.2, 0.2, 0.2],
      [0.5, 0.5, 0.5],
    );
    console.log('log normalize: ', normalize.forward);
    const normalized = normalize(tensor10);
    const normalizeForwarded = normalize.forward(tensor10);
    printTensor(normalized);
    printTensor(normalizeForwarded);

    console.log('---Test torchvision.grayscale---');
    const tensor11 = torch.rand([1, 3, 5, 5]);
    const grayscale = torchvision.transforms.grayscale();
    console.log('log grayscale: ', grayscale.forward);
    const grayscaled = grayscale(tensor11);
    printTensor(grayscaled);

    console.log('---Test async function that returns HostObject---');
    const asyncResult = await (async () => torch.rand([3]))();
    console.log(asyncResult && asyncResult.data());
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
