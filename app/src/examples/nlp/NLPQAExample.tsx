/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {useIsFocused} from '@react-navigation/native';
import * as React from 'react';
import {useState} from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import Colors from '../../constants/Colors';
import Header from '../../components/Header';
import {NLPModels} from '../Models';
import {useLoadModels} from '../utils/ModelProvider';
import useNLPQAModelInference from './utils/useNLPQAModelInference';
import PillButton from '../../components/PillButton';
import {useCallback} from 'react';
import ModelMetricsDisplay from '../cv/utils/ModelMetricsDisplay';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import GradientBackground from '../../components/GradientBackground';
import {useHeaderHeight} from '@react-navigation/elements';

const defaultSourceText = `Humpty Dumpty sat on a wall.
Humpty Dumpty had a great fall.
All the king's horses and all the king's men couldn't put Humpty together again.`;
const defaultQuestion = 'What did Humpty sit on?';

export default function NLPExample() {
  const isLoading = useLoadModels(NLPModels);
  const isFocused = useIsFocused();
  const headerHeight = useHeaderHeight();
  const [sourceText, setSourceText] = useState(defaultSourceText);
  const [question, setQuestion] = useState(defaultQuestion);
  const {answer, metrics, isProcessing, processQA} = useNLPQAModelInference(
    NLPModels[0],
  );
  const [hasAsked, setHasAsked] = useState(false);
  const askQuestion = useCallback(() => {
    if (!hasAsked) {
      setHasAsked(true);
    }
    processQA(sourceText, question);
  }, [processQA, sourceText, question, hasAsked, setHasAsked]);
  const insets = useSafeAreaInsets();

  if (!isFocused || isLoading) {
    return null;
  }

  const canAskQuestion =
    question.trim().length > 0 && sourceText.trim().length > 0;

  const showAnswer = answer != null && !isProcessing && metrics != null;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={headerHeight}
      style={styles.keyboardAvoidingView}>
      <GradientBackground gradient="bottom" />
      <ScrollView
        contentContainerStyle={{
          paddingBottom: insets.bottom + 24,
        }}
        style={styles.container}>
        <Header level="h2" style={styles.header}>
          Input source text to ask a question
        </Header>
        {/* Wrapping the TextInput in a View is a workaround because top padding isn't respected for TextArea on iOS */}
        <View style={styles.askBox}>
          <TextInput
            style={styles.textArea}
            onChangeText={setSourceText}
            multiline={true}
            placeholder="Text"
            autoCorrect={false}
            value={sourceText}
          />
        </View>
        <Header level="h2" style={styles.header}>
          Question
        </Header>
        <View style={styles.askBox}>
          <TextInput
            style={styles.textArea}
            onChangeText={setQuestion}
            placeholder="Ask a question..."
            placeholderTextColor={Colors.ALMOST_WHITE_60}
            autoCorrect={false}
            value={question}
          />
          {canAskQuestion && (
            <PillButton
              buttonStyle="secondary"
              onPress={askQuestion}
              label="Ask"
              style={styles.askButton}
            />
          )}
        </View>
        {hasAsked && (
          <>
            <View style={[styles.header, styles.row]}>
              <Header level="h2">Answer</Header>
              {isProcessing && (
                <ActivityIndicator
                  size="small"
                  color={Colors.PURPLE}
                  style={styles.spinner}
                />
              )}
            </View>
            {showAnswer && (
              <View style={styles.card}>
                <Text style={styles.answer}>{answer}</Text>
                <View style={styles.divider} />
                <ModelMetricsDisplay
                  metrics={metrics!}
                  style={styles.metrics}
                />
              </View>
            )}
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    flex: 1,
  },
  textArea: {
    color: Colors.WHITE,
    flex: 1,
    fontSize: 13,
    lineHeight: 16,
    maxHeight: 300,
  },
  askBox: {
    alignItems: 'center',
    backgroundColor: Colors.DARK_GRAY,
    borderRadius: 16,
    flexDirection: 'row',
    fontSize: 13,
    lineHeight: 16,
    paddingHorizontal: 24,
    paddingVertical: 19,
  },
  answer: {
    fontSize: 13,
    lineHeight: 16,
    color: Colors.WHITE,
    margin: 24,
  },
  askButton: {
    height: 32,
    paddingVertical: 0,
  },
  header: {
    marginBottom: 16,
    marginTop: 31,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spinner: {
    marginStart: 8,
    alignSelf: 'center',
  },
  card: {
    backgroundColor: Colors.DARK_GRAY,
    fontSize: 13,
    lineHeight: 16,
    borderRadius: 16,
  },
  divider: {
    backgroundColor: Colors.ALMOST_BLACK,
    height: 1,
    width: '100%',
  },
  metrics: {
    margin: 24,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
});
