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
      <Button title="Ask" onPress={() => {}} />
      <Text>Question Answering</Text>
    </View>
  );
}
