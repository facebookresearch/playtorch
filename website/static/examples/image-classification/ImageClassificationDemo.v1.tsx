import * as React from 'react';
import {Text, StyleSheet, View} from 'react-native';

export default function ImageClassificationDemo() {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Image Classification</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    padding: 20,
    flexGrow: 1,
  },
  label: {
    marginBottom: 10,
  },
});
