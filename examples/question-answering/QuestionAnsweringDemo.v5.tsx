/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import * as React from 'react';
import {useState} from 'react';
import {Button, StyleSheet, Text, TextInput, View} from 'react-native';
import {MobileModel} from 'react-native-pytorch-core';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const model = require('../../models/bert_qa.ptl');

type QuestionAnsweringResult = {
  answer: string;
}

export default function QuestionAnsweringDemo() {
  // Get safe area insets to account for notches, etc.
  const insets = useSafeAreaInsets();

  const [text, setText] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  async function handleAsk() {
    setIsProcessing(true);

    const qaText = `[CLS] ${question} [SEP] ${text} [SEP]`;

    const {result} = await MobileModel.execute<QuestionAnsweringResult>(model, {
      text: qaText,
      modelInputLength: 360,
    });

    // No answer found if the answer is null
    if (result.answer == null) {
      setAnswer('No answer found');
    } else {
      setAnswer(result.answer);
    }

    setIsProcessing(false);
  }

  return (
    <View style={[styles.container, {marginTop: insets.top, marginBottom: insets.bottom}]}>
      <TextInput style={[styles.item, styles.input]} placeholder="Text" placeholderTextColor="#CCC" multiline={true} value={text} onChangeText={setText} />
      <TextInput style={[styles.item, styles.input]} placeholder="Question" placeholderTextColor="#CCC" value={question} onChangeText={setQuestion} />
      <Button title="Ask" onPress={handleAsk} />
      <Text style={styles.item}>{isProcessing ? "Looking for the answer" : answer}</Text>
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
  }
});
