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
  Button,
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
        <Text style={styles.label}>Text</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={text => setText(text)}
          multiline={true}
          placeholder="Text"
          value={text}
        />
        <Text style={styles.label}>Question</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={question => setQuestion(question)}
          multiline={true}
          placeholder="Question"
          value={question}
        />
        <Text style={styles.label}>Answer</Text>
        <Text style={styles.answer}>
          {isProcessing && <ActivityIndicator size="small" color="tomato" />}
          {answer}
        </Text>
        <Text style={styles.label}>Inference time: {inferenceTime}</Text>
        <View style={styles.answerButton}>
          <Button
            title="Answer Me"
            color="tomato"
            disabled={isProcessing}
            onPress={() => processQA(text, question)}
          />
        </View>
      </ScrollView>
    </ModelPreloader>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  textInput: {
    borderColor: 'gray',
    borderRadius: 5,
    borderWidth: 1,
    color: 'black',
    margin: 5,
    padding: 5,
  },
  answer: {
    borderColor: 'gray',
    borderRadius: 5,
    borderWidth: 1,
    margin: 5,
    padding: 5,
  },
  label: {
    fontWeight: 'bold',
    marginLeft: 5,
  },
  answerButton: {
    padding: 5,
  },
});
