/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

declare var torch: any;
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
    const tensor2 = tensor.unsqueeze(0);
    console.log(tensor.shape); // [4]
    console.log(tensor2.shape); //  [4,1]
    const tensor3 = tensor.unsqueeze(1);
    console.log(tensor3.shape); //  [1,4]
    const tensor4 = tensor3.squeeze();
    console.log(tensor4.shape); //  [4]
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
