/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import * as React from 'react';
import { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TextClassificationDemo() {
  // Get safe area insets to account for notches, etc.
  const insets = useSafeAreaInsets();

  const [text, setText] = useState('');
  const [question, setQuestion] = useState('');

  async function handleAsk() {
    console.log({
      text,
    });
  }

  return (
    <View
      style={[
        styles.container,
        { marginTop: insets.top, marginBottom: insets.bottom },
      ]}>
      <TextInput
        multiline={true}
        onChangeText={setText}
        placeholder="Text"
        placeholderTextColor="#CCC"
        style={[styles.item, styles.input]}
        value={text}
      />
      <Button onPress={handleAsk} title="Classify" />
      <Text style={styles.item}>Text Classification</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  item: {
    margin: 10,
    padding: 10,
  },
  input: {
    borderWidth: 1,
    color: '#000',
  },
});
