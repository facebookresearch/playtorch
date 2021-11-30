import * as React from 'react';
import {useState} from 'react';
import {Button, StyleSheet, Text, TextInput, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export default function QuestionAnsweringDemo() {
  // Get safe area insets to account for notches, etc.
  const insets = useSafeAreaInsets();

  const [text, setText] = useState('');
  const [question, setQuestion] = useState('');

  async function handleAsk() {
    console.log({
      text,
      question,
    });
  }

  return (
    <View
      style={[
        styles.container,
        {marginTop: insets.top, marginBottom: insets.bottom},
      ]}>
      <TextInput
        style={[styles.item, styles.input]}
        placeholder="Text"
        placeholderTextColor="#CCC"
        multiline={true}
        value={text}
        onChangeText={setText}
      />
      <TextInput
        style={[styles.item, styles.input]}
        placeholder="Question"
        placeholderTextColor="#CCC"
        value={question}
        onChangeText={setQuestion}
      />
      <Button title="Ask" onPress={handleAsk} />
      <Text style={styles.item}>Question Answering</Text>
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
