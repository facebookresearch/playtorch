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
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  View,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';

import {
  PTLColors as colors,
  PTLFontSizes as fontsizes,
  PTLTextBoxStyle,
  PTLVisual as visuals,
} from '../../components/UISettings';

import {BasicButton, DoubleLineRow} from '../../components/UIComponents';

/**
 * In this async function, we send the request and wait for the server's response
 * @param prompt the text content in the input field. The server will returned as is.
 * @returns an object with {prompt:string, success:boolean, generated_text:string}
 */
async function fetchData(prompt: string): Promise<string> {
  // This API simply returns anything that is passed to request
  const url = 'https://httpbin.org/anything';

  // compose the formdata object to be sent via POST
  const formdata = new FormData();
  formdata.append('prompt', prompt);
  formdata.append('success', true);
  formdata.append(
    'generated_text',
    'The server-side AI model is not implemented yet. See our tutorials to get started.',
  );

  // fetch with a POST request
  const data = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: formdata,
  });

  // the mock response is a copy of request data stored in "form" property
  const json: any = await data.json();
  const mockResponse = json.form;

  if (mockResponse.success) {
    return `Your prompt is: "${prompt}". Server respnse is: "${mockResponse.generated_text}"`;
  } else {
    return 'Error';
  }
}

export default function MyDemo() {
  // States for API data and loading status
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('');

  // A function to fetch data from server
  const getText = async () => {
    setLoading(true);
    setResult('');

    // start fetching
    const data: string = await fetchData(prompt);
    setResult(data);
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <DoubleLineRow
          label="This example shows how to send and receive text data via POST
            request. You can repurpose this to build an NLP prototype (eg,
            GPT-3) if you implement a server-side AI model.">
          <View style={PTLTextBoxStyle}>
            <TextInput
              style={styles.textArea}
              onChangeText={txt => setPrompt(txt)}
              placeholder="Once upon a time..."
              placeholderTextColor={colors.tintBlack}
              multiline={true}
              numberOfLines={6}
              autoCorrect={false}
              value={prompt}
            />
            <BasicButton disabled={loading} onPress={getText}>
              Send
            </BasicButton>
          </View>
        </DoubleLineRow>

        <DoubleLineRow label="Response">
          <Text style={styles.answer}>
            {loading && <ActivityIndicator size="small" color="tomato" />}
            {result}
          </Text>
        </DoubleLineRow>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    backgroundColor: colors.light,
    padding: 30,
  },
  textArea: {
    flex: 1,
    alignSelf: 'stretch',
    textAlignVertical: 'top',
    marginLeft: 5,
    color: colors.dark,
    fontSize: fontsizes.p,
  },
  answer: {
    fontSize: fontsizes.p,
    color: colors.accent2,
  },
});
