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
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  ActivityIndicator,
} from 'react-native';
import {ModelInfo, NLPModels} from '../Models';
import ModelSelector from '../components/ModelSelector';
import useNLPQAModelInference from '../useNLPQAModelInference';
import ModelPreloader from '../components/ModelPreloader';
import {ScrollView} from 'react-native-gesture-handler';

export default function NLPExample() {
  const [text, setText] = useState(
    'PyTorch Live is an open source playground for everyone to discover, build, test and share on-device AI demos built on PyTorch. The PyTorch Live monorepo includes the PyTorch Live command line interface (i.e., torchlive), a React Native package to interface with PyTorch Mobile, and a React Native template with examples ready to be deployed on mobile devices.',
  );
  const [question, setQuestion] = useState('What is PyTorch Live?');
  const [activeModelInfo, setActiveModelInfo] = useState<ModelInfo>(
    NLPModels[0],
  );
  const {
    answer,
    inferenceTime,
    isProcessing,
    processQA,
  } = useNLPQAModelInference(activeModelInfo);

  return (
    <ModelPreloader modelInfos={NLPModels} loadAsync={true}>
      <ScrollView style={styles.container}>
        <View style={[styles.row]}>
          <Text style={styles.label}>Text</Text>
          <TextInput
            style={styles.textArea}
            onChangeText={text => setText(text)}
            multiline={true}
            placeholder="Text"
            autoCorrect={false}
            value={text}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Question</Text>
          <View style={styles.askBox}>
            <TextInput
              style={styles.askInput}
              onChangeText={question => setQuestion(question)}
              placeholder="Ask a question..."
              autoCorrect={false}
              value={question}
            />

            <TouchableOpacity
              disabled={isProcessing}
              onPress={() => processQA(text, question)}>
              <View style={styles.askButton}>
                <Text style={styles.askButtonText}>Ask</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={[styles.row, answer || isProcessing ? {} : styles.rowHidden]}>
          <Text style={styles.label}>Answer</Text>
          <Text style={styles.answer}>
            {isProcessing && <ActivityIndicator size="small" color="tomato" />}
            {answer}
          </Text>
          <Text style={styles.smallLabel}>
            {answer && !isProcessing
              ? `Inference time: ${inferenceTime}ms`
              : ''}
          </Text>
        </View>
      </ScrollView>
    </ModelPreloader>
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
    color: '#112233',
    borderWidth: 1,
    borderColor: '#ff4c2c33',
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
    fontSize: 16,
    borderRadius: 25,
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