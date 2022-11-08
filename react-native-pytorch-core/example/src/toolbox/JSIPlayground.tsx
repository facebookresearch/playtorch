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
import {
  StyleSheet,
  View,
  Text,
  Platform,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  Tensor,
  torch,
  torchvision,
  MobileModel,
  Module,
} from 'react-native-pytorch-core';

type ComplexTuple = [string, number, [number, number]];

type TestModule = Module & {
  bump: (start: number, step?: number) => Promise<number>;
  bumpSync: (start: number, step?: number) => number;
  get_pi: () => Promise<number>;
  get_piSync: () => number;
  sum_one_d: (arr: number[]) => Promise<number>;
  sum_one_dSync: (arr: number[]) => number;
  sum_two_d: (arr2d: number[][]) => Promise<number>;
  sum_two_dSync: (arr2d: number[]) => number;
  concate_keys: (dictionary: {[index: string]: number}) => Promise<string>;
  concate_keysSync: (dictionary: {[index: string]: number}) => string;
  sum_values: (dictionary: {[index: string]: number}) => Promise<number>;
  sum_valuesSync: (dictionary: {[index: string]: number}) => number;
  sum_tensors: (dictionary: {[index: string]: Tensor}) => Promise<{
    [index: string]: Tensor;
  }>;
  sum_tensorsSync: (dictionary: {[index: string]: Tensor}) => {
    [index: string]: Tensor;
  };
  merge_tuple: (
    tuple1: ComplexTuple,
    tuple2: ComplexTuple,
  ) => Promise<ComplexTuple>;
  merge_tupleSync: (tuple1: ComplexTuple, tuple2: ComplexTuple) => ComplexTuple;
};

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
  const logArray = [];

  if (options.includes('shape')) {
    logArray.push(`Shape: ${tensor.shape}`);
  }
  if (options.includes('stride')) {
    logArray.push(`Stride: ${tensor.stride()}`);
  }
  if (options.includes('dtype')) {
    logArray.push(`Data Type: ${tensor.dtype}`);
  }

  const tensorDataStr = tensor.toString();
  logArray.push(tensorDataStr);
  const logText = `Tensor: {${logArray.join('\n')}}`;
  console.log(logText);
}

type TestUnitItem = {
  name: string;
  testFunc: () => string | void | Promise<string | void>;
};

const Testunit = ({name, testFunc}: TestUnitItem) => {
  const [outputTextColor, setOutputTextColor] = React.useState('grey');
  const [output, setOutput] = React.useState('N/A');
  return (
    <View style={styles.testunit}>
      <View>
        <TouchableOpacity
          style={styles.button}
          onPress={async () => {
            try {
              let start = performance.now();
              await testFunc();
              let time = performance.now() - start;
              setOutput('PASSED: ' + time.toFixed(2) + ' ms');
              setOutputTextColor('dodgerblue');
            } catch (e) {
              setOutputTextColor('hotpink');
              if (e instanceof Error) {
                setOutput(e.message);
              } else {
                setOutput('unknonw exception thrown');
              }
            }
          }}>
          <Text style={styles.buttonTxt}>{name}</Text>
        </TouchableOpacity>
      </View>
      <View style={{...styles.testOutput}}>
        <Text style={{...styles.testOutputText, color: outputTextColor}}>
          {output}
        </Text>
      </View>
    </View>
  );
};

const testUnitList = [
  // api tests for model.* functions
  {
    name: 'generic model.* functions',
    testFunc: async () => {
      console.log('------Test generic function-------');
      let model_url = await MobileModel.download(
        require('../../assets/models/dummy_test_model.ptl'),
      );

      const model = await torch.jit._loadForMobile<TestModule>(model_url);
      let lastTime = performance.now();

      for (let i = 0; i < 1000; i++) {
        await model.bump(1);
      }
      let totalTime = performance.now() - lastTime;
      console.log('average time for bump: ', totalTime / 1000);
      console.log(model);

      let pi = await model.get_pi();
      console.log('pi: ', pi);

      let piSync = model.get_piSync();
      console.log('piSync: ', piSync);
    },
  },
  {
    name: 'model.* with empty input (with exceptions)',
    testFunc: async () => {
      console.log('------Catch error on  empty model input-------');
      let model_url = await MobileModel.download(
        'https://github.com/liuyinglao/TestData/raw/main/input_test_module.ptl',
      );
      let model = await torch.jit._loadForMobile(model_url);
      try {
        await model.forward();
      } catch (e) {
        console.log('verified error can be caught with empty input');
      }
    },
  },
  {
    name: 'model.* with dict input',
    testFunc: async () => {
      console.log('------Test generic dict input-------');
      let model_url = await MobileModel.download(
        require('../../assets/models/dummy_test_model.ptl'),
      );
      let model = await torch.jit._loadForMobile<TestModule>(model_url);
      let obj1 = {this: 1, is: 2, object: 3};
      let output1 = await model.concate_keys(obj1);
      let output2 = await model.sum_values(obj1);
      console.log(output1, output2);

      let obj2 = {apple: torch.tensor([1, 2]), pear: torch.tensor([3, 4])};
      let output3 = await model.sum_tensors(obj2);
      for (let key in output3) {
        console.log(key, output3[key].item());
      }
      let output4 = model.sum_tensorsSync(obj2);
      for (let key in output4) {
        console.log(key, output4[key].item());
      }
    },
  },
  {
    name: 'model.* with list input',
    testFunc: async () => {
      console.log('------Test generic list input-------');
      let model_url = await MobileModel.download(
        require('../../assets/models/dummy_test_model.ptl'),
      );
      let model = await torch.jit._loadForMobile<TestModule>(model_url);
      let outputOneD = await model.sum_one_d([1, 2, 3]);
      let outputTwoD = await model.sum_two_d([
        [1, 2, 3],
        [4, 5],
      ]);
      console.log(outputOneD);
      console.log(outputTwoD);
      try {
        await model.sum_two_d([[1, 2, 3.5]]);
      } catch (e) {
        if (e instanceof Error) {
          console.log(e.message);
        } else {
          throw 'unknown exception thrown.';
        }
      }
    },
  },
  {
    name: 'model.* with string input',
    testFunc: async () => {
      console.log('------Test non-Tensor model input-------');
      let model_url = await MobileModel.download(
        require('../../assets/models/dummy_test_model.ptl'),
      );
      let model = await torch.jit._loadForMobile(model_url);
      let inputStrings = ['tensor', 'bool', 'integer', 'double', 'other'];
      for (const inputString of inputStrings) {
        let output = model.forwardSync<
          [string, Tensor, boolean, number, number],
          string
        >(inputString, torch.tensor([1, 2, 3]), true, 3, 4.5);
        console.log(output);
      }
      for (const inputString of inputStrings) {
        let output = await model.forward<
          [string, Tensor, boolean, number, number],
          string
        >(inputString, torch.tensor([1, 2, 3]), true, 3, 4.5);
        console.log(output);
      }
    },
  },
  {
    name: 'model.* with tuple input',
    testFunc: async () => {
      console.log('------Test generic tuple input-------');
      let model_url = await MobileModel.download(
        require('../../assets/models/dummy_test_model.ptl'),
      );
      let model = await torch.jit._loadForMobile<TestModule>(model_url);
      let t1: ComplexTuple = ['light', 3.14, [1, 2]];
      let t2: ComplexTuple = ['light', 3.14, [1, 2]];
      let output1 = await model.merge_tuple(t1, t2);
      let output2 = model.merge_tupleSync(t1, t2);
      console.log(output1);
      console.log(output2);

      try {
        await model.merge_tuple(
          ['light', 3.14, [1, 1.5]],
          ['light', 3.14, [1, 2]],
        );
      } catch (e) {
        if (e instanceof Error) {
          console.log('Exception caught correctly: ', e.message);
        } else {
          throw 'unknown exception thrown.';
        }
      }
    },
  },
  {
    name: 'model extra files',
    testFunc: async () => {
      console.log('------Test generic function-------');
      let modelUrl = await MobileModel.download(
        require('../../assets/models/dummy_test_model.ptl'),
      );

      const lastTime = performance.now();

      const extraFiles = {
        foo: null,
        'model/classes.json': null,
        'classes.json': null,
      };

      const model = await torch.jit._loadForMobile<TestModule>(
        modelUrl,
        'cpu',
        extraFiles,
      );

      let totalTime = performance.now() - lastTime;
      console.log('total time load model with extra files: ', totalTime);
      console.log(model);
      console.log('extraFiles', extraFiles);
    },
  },
  {
    name: 'model extra files (sync)',
    testFunc: async () => {
      console.log('------Test generic function-------');
      let modelUrl = await MobileModel.download(
        require('../../assets/models/dummy_test_model.ptl'),
      );

      const lastTime = performance.now();

      const extraFiles = {
        foo: null,
        'model/classes.json': null,
        'classes.json': null,
      };

      const model = torch.jit._loadForMobileSync<TestModule>(
        modelUrl,
        'cpu',
        extraFiles,
      );

      let totalTime = performance.now() - lastTime;
      console.log('total time load model with extra files: ', totalTime);
      console.log(model);
      console.log('extraFiles', extraFiles);
    },
  },

  // api tests for tensor.* functions
  {
    name: 'tensor.abs',
    testFunc: () => {
      console.log('---Test tensor.abs---');
      let absTensor = torch.tensor([
        [-2, -1],
        [0, 1],
      ]);
      printTensor(absTensor);
      let tensorAbsOutput = absTensor.abs();
      printTensor(tensorAbsOutput);
    },
  },
  {
    name: 'tensor.add',
    testFunc: () => {
      console.log('---Test tensor.add---');
      const addTensor1 = torch.rand([1, 2]);
      printTensor(addTensor1);
      const addTensor2 = addTensor1.add(2);
      printTensor(addTensor2);
      printTensor(addTensor1.add(addTensor2));
    },
  },
  {
    name: 'tensor.argmin',
    testFunc: async () => {
      console.log('------Test tensor.argmin-------');
      const t1 = torch.randn([2, 3]);
      printTensor(t1, ['shape', 'dtype', 'stride']);
      const minIndex = t1.argmin();
      printTensor(minIndex, ['shape', 'dtype', 'stride']);
      const minIndexRow = t1.argmin({dim: 0, keepdim: true});
      printTensor(minIndexRow, ['shape', 'dtype', 'stride']);
    },
  },
  {
    name: 'tensor.div',
    testFunc: () => {
      console.log('---Test tensor.div---');
      let divTensor = torch.arange(1, 10);
      printTensor(divTensor);
      printTensor(divTensor.div(2));
      printTensor(divTensor.div(2, {roundingMode: 'floor'}));
      printTensor(divTensor.div(divTensor));
      printTensor(divTensor.div(divTensor, {roundingMode: 'floor'}));
    },
  },
  {
    name: 'tensor.expand',
    testFunc: async () => {
      console.log('------Test tensor.expand-------');
      const t1 = torch.randint(0, 5, [3, 1, 5]);
      printTensor(t1, ['shape', 'dtype', 'stride']);
      const t2 = t1.expand([3, 4, 5]);
      printTensor(t2, ['shape', 'dtype', 'stride']);
      const t3 = t1.expand([2, 3, 4, 5]);
      printTensor(t3, ['shape', 'dtype', 'stride']);
      try {
        t1.expand([6, 2, 5]);
      } catch (e) {
        if (e instanceof Error) {
          console.log(
            `caught exception when expanding at non-singular dimernsion: ${e.message.slice(
              0,
              200,
            )}...`,
          );
        } else {
          throw e;
        }
      }
    },
  },
  {
    name: 'tensor.flip',
    testFunc: async () => {
      console.log('------Test tensor.flip-------');
      const t1 = torch.arange(1, 10).reshape([3, 3]);
      printTensor(t1, ['shape', 'dtype', 'stride']);
      const t2 = t1.flip([0, 1]);
      printTensor(t2, ['shape', 'dtype', 'stride']);
    },
  },
  {
    name: 'tensor.full',
    testFunc: async () => {
      console.log('------Test tensor.full-------');
      const t1 = torch.full([2, 3], 1);
      printTensor(t1, ['shape', 'dtype', 'stride']);
      const t2 = torch.full([2, 3], 1.5, {dtype: torch.float64});
      printTensor(t2, ['shape', 'dtype', 'stride']);
    },
  },
  {
    name: 'tensor.mul',
    testFunc: () => {
      console.log('---Test tensor.mul---');
      let tensor1 = torch.arange(10);
      printTensor(tensor1);
      let tensor2 = tensor1.mul(2);
      printTensor(tensor2);
      printTensor(tensor2.mul(tensor1));
    },
  },
  {
    name: 'tensor.softmax',
    testFunc: () => {
      console.log('---Test tensor.softmax---');
      let softmaxTensor1 = torch.arange(2);
      printTensor(softmaxTensor1);
      printTensor(softmaxTensor1.softmax(0));
    },
  },
  {
    name: 'tensor.sub',
    testFunc: () => {
      console.log('---Test tensor.sub---');
      const subTensor1 = torch.arange(2);
      printTensor(subTensor1);
      const subTensor2 = subTensor1.sub(2);
      printTensor(subTensor2);
      printTensor(subTensor1.sub(subTensor2));
    },
  },

  {
    name: 'tensor.topk',
    testFunc: () => {
      console.log('---Test tensor.topk---');
      let topkTensor = torch.arange(10, 20);
      console.log(topkTensor.data());
      let [values, indices] = topkTensor.topk(3);
      console.log(values.data());
      console.log(indices.data());
    },
  },

  // api tests for torch.* functiond
  {
    name: 'torch.arange',
    testFunc: () => {
      console.log('---Test torch.arange---');
      let printOptions = ['data'];
      printTensor(torch.arange(5), printOptions);
      printTensor(torch.arange(1, 4), printOptions);
      printTensor(torch.arange(1, 2.5, 0.5), printOptions);
    },
  },
  {
    name: 'torch.cat',
    testFunc: async () => {
      console.log('------Test torch.cat-------');
      const t1 = torch.zeros([1, 24, 24]);
      const t2 = torch.ones([1, 24, 24]).mul(255);
      const mask = torch.cat([t1, t1, t1, t2]);
      console.log(
        mask.shape,
        mask[0][0][0].item(),
        mask[1][0][0].item(),
        mask[2][0][0].item(),
        mask[3][0][0].item(),
      );
    },
  },
  {
    name: 'torch.empty',
    testFunc: () => {
      console.log('---Test torch.empty---');
      printTensor(torch.empty([1, 2]));
      printTensor(torch.empty([1, 2], {dtype: torch.float64}));
    },
  },
  {
    name: 'torch.eye',
    testFunc: () => {
      console.log('---Test torch.eye---');
      let printOptions = ['data'];
      printOptions = ['shape', 'stride', 'data'];
      printTensor(torch.eye(0), printOptions);
      printTensor(torch.eye(3), printOptions);
      printTensor(torch.eye(0, 3), printOptions);
      printTensor(torch.eye(3, 0), printOptions);
      printTensor(torch.eye(3, 3, {dtype: 'int32'}), printOptions);
    },
  },
  {
    name: 'torch.linspace',
    testFunc: async () => {
      console.log('------Test torch.linspace-------');
      const t1 = torch.linspace(-5, 5, 4);
      printTensor(t1);
      const t2 = torch.linspace(-5, 5, 4, {dtype: torch.float32});
      printTensor(t2);
    },
  },
  {
    name: 'torch.logspace',
    testFunc: async () => {
      console.log('------Test torch.logspace-------');
      const tensor1 = torch.logspace(-2, 2, 3, {base: 2});
      const tensor2 = torch.logspace(-2, 2, 5, {base: 10, dtype: torch.int});
      printTensor(tensor1);
      printTensor(tensor2);
    },
  },
  {
    name: 'torch.randint',
    testFunc: () => {
      console.log('---Test torch.randint---');
      let printOptions = ['shape', 'data'];
      printTensor(torch.randint(3, 5, [3]), printOptions);
      printTensor(torch.randint(10, [2, 2]), printOptions);
      printTensor(torch.randint(3, 10, [2, 2]), printOptions);
      printTensor(torch.randint(3, 10, [2, 2, 2]), printOptions);
    },
  },
  {
    name: 'torch.randn',
    testFunc: async () => {
      console.log('------Test torch.randn-------');
      const tensor1 = torch.randn([4]);
      const tensor2 = torch.randn([2, 3]);
      const tensor3 = torch.randn([2, 3], {dtype: torch.float32});
      printTensor(tensor1);
      printTensor(tensor2);
      printTensor(tensor3);
    },
  },
  {
    name: 'torch.randperm',
    testFunc: async () => {
      console.log('------Test torch.randperm-------');
      const t1 = torch.randperm(10, {dtype: torch.int32});
      printTensor(t1);
      const t2 = torch.randperm(10, {dtype: torch.float});
      console.log(t2.dtype);
    },
  },
  {
    name: 'torch.squeeze/torch.unsqueeze',
    testFunc: () => {
      console.log('---Test squeeze and unsqueeze---');
      let tensor = torch.rand([4]);
      console.log(tensor.shape); // [4]
      let tensor2 = tensor.unsqueeze(0);
      console.log(tensor.shape); // [4]
      console.log(tensor2.shape); //  [4,1]
      let tensor3 = tensor.unsqueeze(1);
      console.log(tensor3.shape); //  [1,4]
      let tensor4 = tensor3.squeeze();
      console.log(tensor4.shape); //  [4]
    },
  },
  {
    name: 'torch.tensor',
    testFunc: () => {
      console.log('---Test torch.tensor---');
      let printOptions = ['shape', 'data', 'dtype'];
      let tensor1 = torch.tensor([
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
      let tensor2 = torch.tensor(
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
    },
  },

  // api tests for torchvision.* functions
  {
    name: 'torchvision.centercrop',
    testFunc: () => {
      console.log('---Test torchvision.centercrop---');
      console.log(torchvision);
      let tensor6 = torch.rand([1, 3, 5, 5]);
      let centerCrop = torchvision.transforms.centerCrop(3);
      let tensor7 = centerCrop.forward(tensor6);
      console.log('original shape: ', tensor6.shape);
      console.log('transformed shape: ', tensor7.shape);
    },
  },
  {
    name: 'torchvision.grayscale',
    testFunc: () => {
      console.log('---Test torchvision.grayscale---');
      const tensor11 = torch.rand([1, 3, 5, 5]);
      const grayscale = torchvision.transforms.grayscale();
      console.log('log grayscale: ', grayscale.forward);
      const grayscaled = grayscale(tensor11);
      printTensor(grayscaled);
    },
  },
  {
    name: 'torchvision.normalize',
    testFunc: () => {
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
    },
  },
  {
    name: 'torchvision.resize',
    testFunc: () => {
      console.log('---Test torchvision.resize---');
      let tensor8 = torch.rand([1, 3, 100, 100]);
      let resize = torchvision.transforms.resize(20);
      console.log('log resize: ', resize.forward);
      let tensor9 = resize.forward(tensor8);
      console.log('original shape: ', tensor8.shape);
      console.log('transformed shape: ', tensor9.shape);
    },
  },

  // api tests for other functionalities
  {
    name: 'async function',
    testFunc: async () => {
      console.log('---Test async function that returns HostObject---');
      const asyncResult = await (async () => torch.rand([3]))();
      console.log(asyncResult && asyncResult.data());
    },
  },
  {
    name: 'jsi setup',
    testFunc: () => {
      console.log('-----Test jsi setup-------');
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
      console.log('argmax (js)', result);
      console.log('elapsed time (js)', delta, 'ms');

      startTime = performance.now();
      result = tensor.argmax().item();
      delta = performance.now() - startTime;
      console.log('argmax (c++)', result);
      console.log('elapsed time (c++)', delta, 'ms');
      printTensor(tensor, ['shape', 'stride', 'dtype']);
    },
  },
];

export default function JSIPlayground() {
  return (
    <ScrollView>
      <View style={styles.testAll}>
        <Testunit
          name={'Test All'}
          testFunc={() => {
            testUnitList.forEach(
              async (item: TestUnitItem) => await item.testFunc(),
            );
          }}
        />
      </View>
      {testUnitList.map((item, index) => {
        return (
          <Testunit name={item.name} testFunc={item.testFunc} key={index} />
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  testAll: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    borderBottomWidth: 1,
    borderColor: 'dodgerblue',
  },
  button: {
    padding: 10,
  },
  buttonTxt: {
    color: 'dodgerblue',
  },
  testunit: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 2,
  },
  testOutput: {
    borderColor: 'dodgerblue',
    borderRadius: 0,
    flex: 2,
    padding: 10,
    alignContent: 'flex-end',
  },
  testOutputText: {
    textAlign: 'right',
  },
});
