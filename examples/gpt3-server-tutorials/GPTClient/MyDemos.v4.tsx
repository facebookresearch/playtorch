/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import React, {useState} from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  View,
  ScrollView,
  SafeAreaView,
  Keyboard,
  ActivityIndicator,
} from 'react-native';

async function fetchData(prompt: string): Promise<string> {
  // IMPORTANT: You MUST set `ipAddress` to your computer's IP address
  // You also must make sure that your computer and your device are on the same network
  const ipAddress = null;
  if (ipAddress === null) {
    throw Error('You must fill in your own IP address!');
  }
  const url = `http://${ipAddress}:5000/gpt`;

  // compose the formdata object to be sent via POST
  const formdata = new FormData();
  formdata.append('prompt', prompt);

  // fetch with a POST request
  const data = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: formdata,
  });

  if (data.ok) {
    const jsonResponse = await data.json();
    return jsonResponse.generated_text;
  } else {
    return 'Error';
  }
}

export default function MyDemo() {
  const [result, setResult] = useState('');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const generateText = async () => {
    Keyboard.dismiss();
    setLoading(true);
    setResult('');

    const data: string = await fetchData(prompt);

    setResult(data);
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        keyboardShouldPersistTaps="handled">
        <View style={styles.row}>
          <Text style={styles.label}>
            This example shows how to send and receive text data via POST
            request. You can repurpose this to build an NLP prototype (eg,
            GPT-3) if you implement a server-side AI model.
          </Text>
          <View style={styles.promptBox}>
            <TextInput
              style={styles.textArea}
              onChangeText={txt => setPrompt(txt)}
              placeholder="Once upon a time..."
              placeholderTextColor="#00000033"
              multiline={true}
              numberOfLines={6}
              autoCorrect={false}
              value={prompt}
            />
            <TouchableOpacity disabled={loading} onPress={generateText}>
              <View style={styles.sendButton}>
                <Text style={styles.buttonText}>Send</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.row]}>
          <Text style={styles.label}>Response:</Text>
          <Text style={styles.answer}>
            {loading && <ActivityIndicator size="small" color="tomato" />}
            {result}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    backgroundColor: '#ffcac2',
    padding: 30,
  },
  row: {
    flex: 1,
    padding: 15,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  rowHidden: {
    opacity: 0,
  },
  label: {
    fontSize: 14,
    color: '#00000099',
    marginBottom: 5,
  },
  textArea: {
    flex: 1,
    alignSelf: 'stretch',
    textAlignVertical: 'top',
    marginLeft: 5,
    color: '#112233',
    fontSize: 16,
  },
  promptBox: {
    flex: 1,
    flexDirection: 'column',
    borderColor: '#ff4c2c33',
    backgroundColor: '#ffffff',
    fontSize: 16,
    borderRadius: 5,
    borderWidth: 1,
    padding: 10,
    marginRight: 5,
    marginVertical: 20,
    alignItems: 'flex-end',
    alignSelf: 'stretch',
  },
  sendButton: {
    backgroundColor: '#812ce5',
    paddingVertical: 15,
    paddingHorizontal: 40,
    alignSelf: 'auto',
    borderRadius: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  answer: {
    fontSize: 21,
    color: '#000000',
  },
  smallLabel: {
    fontSize: 12,
    color: '#667788',
    fontFamily: 'Courier New',
  },
});
