import * as React from 'react';
import {Button, StyleSheet, Text, TextInput, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export default function QuestionAnsweringDemo() {
  // Get safe area insets to account for notches, etc.
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.container,
        {marginTop: insets.top, marginBottom: insets.bottom},
      ]}>
      <TextInput
        style={[styles.item, styles.input]}
        multiline={true}
        placeholder="Text"
        placeholderTextColor="#CCC"
      />
      <TextInput
        style={[styles.item, styles.input]}
        placeholder="Question"
        placeholderTextColor="#CCC"
      />
      <Button title="Ask" onPress={() => {}} />
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
