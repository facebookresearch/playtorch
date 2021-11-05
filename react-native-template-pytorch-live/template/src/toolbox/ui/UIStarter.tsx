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
  Text,
  TextInput,
  Switch,
  ScrollView,
  SafeAreaView,
  View,
  Alert,
} from 'react-native';

import {
  PTLColors as colors,
  PTLTextBoxStyle,
} from '../../components/UISettings';
import {
  SingleLineRow,
  DoubleLineRow,
  BasicButton,
  IconButton,
  HintText,
} from '../../components/UIComponents';

const burgerData = [
  {
    id: 'a',
    title: '100% organic',
  },
  {
    id: 'b',
    title: '100% freshly made',
  },
  {
    id: 'c',
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
        <View style={styles.head}>
          <HintText text="🔥 UI examples for ordering a burger 🍔" />
        </View>

        {/* Text input example */}
        <SingleLineRow label="Name" divider={true}>
          <TextInput
            style={PTLTextBoxStyle}
            placeholder="Your name"
            placeholderTextColor={colors.tintBlack}
            onSubmitEditing={evt => setName(evt.nativeEvent.text)}
          />
        </SingleLineRow>

        {/* Text input with IconButton example */}
        <SingleLineRow label="Condiments" divider={true}>
          <View style={[PTLTextBoxStyle, styles.textActionOuter]}>
            <TextInput
              style={[PTLTextBoxStyle, {borderWidth: 0}]}
              onChangeText={text => {}}
              placeholder="Ketchup?"
              placeholderTextColor={colors.tintBlack}
              autoCorrect={false}
            />
            <IconButton size="small" background={colors.accent2} icon="plus" />
          </View>
        </SingleLineRow>

        {/* Switch toggle example */}
        <SingleLineRow label="Vegan" divider={true}>
          <Switch
            thumbColor={colors.accent1}
            trackColor={{false: colors.tintBlack, true: colors.accent3}}
            value={vegan}
            onValueChange={setVegan}
          />
        </SingleLineRow>

        {/* A minimal example of creating a list using map. You can also using FlatList component (though not inside a ScrollView) */}
        <DoubleLineRow label="Our Burgers Are" divider={true}>
          {burgerData.map(({id, title}) => (
            <Text key={id} style={styles.listItem}>
              {title}
            </Text>
          ))}
        </DoubleLineRow>

        {/* Multi-line text area example */}
        <DoubleLineRow label="Special Instructions">
          <TextInput
            style={PTLTextBoxStyle}
            placeholder="Add special request"
            placeholderTextColor="#00000033"
            multiline={true}
            numberOfLines={4}
            onChangeText={t => setNote(t)}
            value={note}
          />
        </DoubleLineRow>

        {/* Button example that opens the native Alert UI */}
        <BasicButton
          style={{margin: 20}}
          onPress={() =>
            Alert.alert('Thanks!', 'Your burger will be ready soon!')
          }>
          Order Now
        </BasicButton>
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
    backgroundColor: colors.light,
  },
  head: {
    height: 150,
    backgroundColor: colors.tintBlack,
  },
  textActionOuter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingRight: 10,
  },
  listItem: {
    color: colors.accent2,
    fontWeight: 'bold',
  },
});
