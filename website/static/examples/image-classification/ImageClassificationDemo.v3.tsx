import * as React from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {Camera, Image} from 'react-native-pytorch-core';

export default function ImageClassificationDemo() {
  async function handleImage(image: Image) {
    console.log(image);
    // It is important to release the image to avoid memory leaks
    image.release();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Image Classification</Text>
      <Camera style={styles.camera} onCapture={handleImage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    flexGrow: 1,
    padding: 20,
  },
  label: {
    marginBottom: 10,
  },
  camera: {
    flexGrow: 1,
    width: '100%',
  },
});
