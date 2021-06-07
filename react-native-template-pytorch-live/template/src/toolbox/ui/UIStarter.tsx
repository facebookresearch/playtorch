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
  StyleSheet,
  Button,
  Text,
  TextInput,
  Switch,
  ScrollView,
  SafeAreaView,
  View,
  Alert,
} from 'react-native';

const burgerData = [
  {
    id: 'a',
    title: '100% pasture-raised or vegan',
  },
  {
    id: 'b',
    title: '100% organic',
  },
  {
    id: 'c',
    title: '100% local',
  },
  {
    id: 'd',
    title: '100% hand crafted',
  },
  {
    id: 'e',
    title: '100% freshly made',
  },
  {
    id: 'f',
    title: '100% open sourced',
  },
];

export default function UIStarter() {
  const [vegan, setVegan] = useState(false);
  const [name, setName] = useState('you');
  const [note, setNote] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        {/* The header's text will change based on state changes triggered by the UI elements */}
        <View style={[styles.row, styles.head]}>
          <Text style={[styles.label, {fontWeight: 'bold'}]}>
            🔥 Burger Live 🍔
          </Text>
          <Text style={styles.small}>{`A perfect ${vegan ? 'vegan ' : ''}${
            name ? 'burger for ' + name : ''
          }`}</Text>
        </View>

        {/* Text input example */}
        <View style={styles.row}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Your name"
            placeholderTextColor="#00000033"
            onSubmitEditing={evt => setName(evt.nativeEvent.text)}
          />
        </View>

        {/* Switch toggle example */}
        <View style={styles.row}>
          <Text style={styles.label}>Vegan</Text>
          <Switch
            thumbColor="#000000"
            trackColor={{false: '#aabbcc', true: '#00cc99'}}
            value={vegan}
            onValueChange={setVegan}
          />
        </View>

        {/* A minimal example of creating a list using map. You can also using FlatList component (though not inside a ScrollView) */}
        <View style={[styles.info]}>
          <Text style={[styles.label, {marginBottom: 20}]}>
            Our Burgers Are:{' '}
          </Text>
          {burgerData.map(({id, title}) => (
            <Text key={id} style={styles.listItem}>
              {title}
            </Text>
          ))}
        </View>

        {/* Multi-line text area example */}
        <View style={styles.row}>
          <TextInput
            style={styles.textArea}
            placeholder="Add special request"
            placeholderTextColor="#00000033"
            multiline={true}
            numberOfLines={4}
            onChangeText={t => setNote(t)}
            value={note}
          />
        </View>

        {/* Button example that opens the native Alert UIvc */}
        <View style={styles.row}>
          <Button
            title="Order Now"
            onPress={() =>
              Alert.alert('Thanks!', 'Your burger will be ready soon!')
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// You can customize your UI elements using CSS-like properties.
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    backgroundColor: '#f3f5f9',
  },
  row: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#00000009',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  head: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    borderTopColor: '#00CC99',
    borderTopWidth: 2,
  },
  info: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#00000009',
    flexDirection: 'column',
  },
  small: {
    fontSize: 14,
    color: '#00000066',
    marginVertical: 5,
  },
  label: {
    color: '#112233',
    fontSize: 16,
  },
  textInput: {
    color: '#112233',
    borderWidth: 1,
    borderColor: '#00000022',
    flex: 0.5,
    height: 50,
    padding: 10,
    backgroundColor: '#ffffff',
    fontSize: 16,
  },
  textArea: {
    color: '#112233',
    borderWidth: 1,
    borderColor: '#00000022',
    flex: 1,
    padding: 10,
    backgroundColor: '#ffffff',
    fontSize: 14,
  },
  list: {
    marginTop: 20,
  },
  listItem: {
    backgroundColor: '#00000011',
    color: '#112233',
    padding: 10,
    marginBottom: 1,
  },
});
