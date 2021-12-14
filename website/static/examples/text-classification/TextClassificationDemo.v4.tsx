import * as React from 'react';
import { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { MobileModel } from 'react-native-pytorch-core';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const model = require('../../models/bert_qa.ptl');

type TextClassificationResult = {
  sentiment: number;
};

export default function TextClassificationDemo() {
  // Get safe area insets to account for notches, etc.
  const insets = useSafeAreaInsets();

  const [text, setText] = useState('');
  const [sentiment, setSentiment] = useState('');

  async function handleClassify() {
    const _text = `[CLS] ${text} [SEP]`;

    const { result } = await MobileModel.execute<TextClassificationResult>(model, {
      text: _text,
      modelInputLength: 360,
    });

    // No answer found if the answer is null
    if (result.sentiment == null) {
      setSentiment('Could not find sentiment.');
    } else {
      setSentiment(result.answer);
    }
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
      <Button onPress={handleClassify} title="Classify" />
      <Text style={styles.item}>{sentiment}</Text>
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
