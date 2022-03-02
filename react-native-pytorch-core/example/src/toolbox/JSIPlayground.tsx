/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

declare var torch: any;
declare var __torchlive_vision__: any;
declare var performance: any;

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
    console.log(__torchlive_vision__);
    console.log(__torchlive_vision__.transforms);

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
    result = torch.argmax(tensor);
    delta = performance.now() - startTime;
    setCxxResult(result);
    setcxxElapse(delta);
    console.log('argmax (c++)', result);
    console.log('elapsed time (c++)', delta, 'ms');
    console.log(tensor);
    console.log(tensor.size());
    console.log(tensor.shape);
    console.log(tensor.dtype);

    let testTensor = torch.empty([1, 2]);
    console.log(testTensor);
    testTensor = torch.empty(1, 2);
    console.log(testTensor);
    testTensor = torch.empty([1, 2], {dtype: 'float64'});
    console.log(testTensor);

    console.log('---Test torch.arange---');
    tensor = torch.arange(5);
    console.log(tensor);
    data = new Float32Array(tensor.data);
    console.log(data);
    tensor = torch.arange(1, 4);
    console.log(tensor);
    data = new Float32Array(tensor.data);
    console.log(data);
    tensor = torch.arange(1, 2.5, 0.5);
    console.log(tensor);
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

    console.log('---Test torch.add---');
    let addTensor1 = torch.rand([1, 2]);
    console.log(addTensor1);
    let addTensor2 = torch.add(addTensor1, 2);
    console.log(addTensor2);
    let addTensor3 = torch.add(addTensor1, addTensor2);
    console.log(addTensor3);

    console.log('---Test torch.sub---');
    let subTensor1 = torch.arange(2);
    console.log(subTensor1);
    let subTensor2 = torch.sub(subTensor1, 2);
    console.log(subTensor2);
    let subTensor3 = torch.sub(subTensor1, subTensor2);
    console.log(subTensor3);

    console.log('---Test torch.mul---');
    let tensor1 = torch.arange(10);
    console.log(tensor1);
    tensor2 = torch.mul(tensor1, 2);
    console.log(tensor2);
    tensor3 = torch.mul(tensor2, tensor1);
    console.log(tensor3);
    console.log('---Test torch.softmax---');
    let softmaxTensor1 = torch.arange(2);
    console.log(softmaxTensor1);
    let softmaxTensor2 = torch.softmax(softmaxTensor1, 0);
    console.log(softmaxTensor2);

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

    console.log('---Test torch.div---');
    let divTensor = torch.arange(1, 10);
    console.log(divTensor);
    tensor2 = torch.div(divTensor, 2);
    console.log(tensor2);
    tensor3 = torch.div(divTensor, 2, {rounding_mode: 'floor'});
    console.log(tensor3);
    tensor4 = torch.div(divTensor, divTensor);
    console.log(tensor4);

    console.log('---Test torch.abs and tensor.abs---');
    let absTensor = torch.tensor([
      [-2, -1],
      [0, 1],
    ]);
    console.log(absTensor.toString());
    let torchAbsOutput = torch.abs(absTensor);
    console.log(torchAbsOutput.toString());
    console.log(absTensor.toString());
    let tensorAbsOutput = absTensor.abs();
    console.log(tensorAbsOutput.toString());
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
