/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {NLPModels} from '../../Models';
import * as React from 'react';
import {useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  ActivityIndicator,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import useNLPQAModelInference from '../../useNLPQAModelInference';

export default function NLPExample() {
  const [text, setText] = useState(
    'PyTorch Live is an open source playground for everyone to discover, build, test and share on-device AI demos built on PyTorch. The PyTorch Live monorepo includes the PyTorch Live command line interface (i.e., torchlive), a React Native package to interface with PyTorch Mobile, and a React Native template with examples ready to be deployed on mobile devices.',
  );
  const [question, setQuestion] = useState('What is PyTorch Live?');
  const {answer, metrics, isProcessing, isReady, processQA} =
    useNLPQAModelInference(NLPModels[0]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>Text</Text>
        <TextInput
          style={styles.textArea}
          onChangeText={setText}
          multiline={true}
          placeholder="Text"
          autoCorrect={false}
          value={text}
        />
      </View>
      {isReady ? (
        <View style={styles.row}>
          <Text style={styles.label}>Question</Text>
          <View style={styles.askBox}>
            <TextInput
              style={styles.askInput}
              onChangeText={setQuestion}
              placeholder="Ask a question..."
              autoCorrect={false}
              value={question}
            />

            <TouchableOpacity
              disabled={isProcessing}
              onPress={() => processQA(text, question)}>
              <View
                style={
                  isProcessing ? styles.askButtonDisabled : styles.askButton
                }>
                <Text style={styles.askButtonText}>Ask</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.row}>
          <Text style={styles.label}>Loading Model... </Text>
        </View>
      )}
      <View style={[styles.row, !answer && !isProcessing && styles.rowHidden]}>
        <Text style={styles.label}>Answer</Text>
        <Text style={styles.answer}>
          {isProcessing && <ActivityIndicator size="small" color="tomato" />}
          {answer}
        </Text>
        {answer != null && !isProcessing && (
          <Text style={styles.smallLabel}>
            Time taken: {metrics?.totalTime}ms (p={metrics?.packTime}/i=
            {metrics?.inferenceTime}/u={metrics?.unpackTime})
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#ffe9e6',
  },
  row: {
    padding: 15,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  rowHidden: {
    opacity: 0,
  },
  label: {
    color: '#334455',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 5,
  },
  textArea: {
    backgroundColor: '#ffffff',
    borderColor: '#ff4c2c33',
    borderRadius: 25,
    borderWidth: 1,
    color: '#112233',
    flex: 1,
    fontSize: 16,
    padding: 20,
    width: '100%',
  },
  askInput: {
    color: '#112233',
    borderWidth: 0,
    flex: 1,
    height: 40,
    marginLeft: 10,
    fontSize: 16,
  },
  askBox: {
    flex: 1,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ff4c2c33',
    height: 50,
    padding: 5,
    backgroundColor: '#ffffff',
    fontSize: 16,
    marginRight: 5,
    borderRadius: 25,
    alignItems: 'center',
  },
  askButton: {
    width: 60,
    height: 40,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff4c2c',
  },
  askButtonDisabled: {
    width: 60,
    height: 40,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eeeeee',
  },
  askButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  answer: {
    fontSize: 16,
    color: '#ff4c2c',
  },
  smallLabel: {
    fontSize: 12,
    color: '#667788',
  },
});
