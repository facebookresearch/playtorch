/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import * as React from 'react';
import {Button, Text, TextInput, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export default function QuestionAnsweringDemo() {
  // Get safe area insets to account for notches, etc.
  const insets = useSafeAreaInsets();
  return (
    <View style={{marginTop: insets.top, marginBottom: insets.bottom}}>
      <TextInput placeholder="Text" />
      <TextInput placeholder="Question" />
      <Button onPress={() => {}} title="Ask" />
      <Text>Question Answering</Text>
    </View>
  );
}
