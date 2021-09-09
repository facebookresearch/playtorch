/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import React from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  View,
  ScrollView,
  SafeAreaView,
} from 'react-native';

export default function MyDemo() {
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
              placeholder="Once upon a time..."
              placeholderTextColor="#00000033"
              multiline={true}
              numberOfLines={6}
              autoCorrect={false}
            />
            <TouchableOpacity>
              <View style={styles.sendButton}>
                <Text style={styles.buttonText}>Send</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.row]}>
          <Text style={styles.label}>Response:</Text>
          <Text style={styles.answer}></Text>
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
    fontFamily: 'monospace',
  },
});
