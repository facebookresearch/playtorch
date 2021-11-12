/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import * as React from 'react';
import {Button, Text, TextInput, View} from 'react-native';

export default function QuestionAnsweringDemo() {
  return (
    <View>
      <TextInput placeholder="Text" />
      <TextInput placeholder="Question" />
      <Button title="Ask" onPress={() => {}} />
      <Text>Question Answering</Text>
    </View>
  );
}
