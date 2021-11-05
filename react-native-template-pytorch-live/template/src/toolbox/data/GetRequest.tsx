/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import * as React from 'react';
import {useState, useEffect, useCallback} from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  Image,
  ScrollView,
} from 'react-native';
import {
  PTLColors as colors,
  PTLFontSizes as fontsizes,
} from '../../components/UISettings';
import {BasicButton} from '../../components/UIComponents';

// This is an example of getting data from a public API and displaying them.

/**
 * A helper function to get the API path for dog breeds
 * @param index an index to get a dog breed from a predefined list
 * @returns the API path
 */
function getDogURL(index = 0) {
  const breeds = ['shiba', 'pug', 'chow', 'lhasa', 'beagle', 'boxer', 'cairn'];
  const name = breeds[index % breeds.length];
  return `https://dog.ceo/api/breed/${name}/images`;
}

/**
 * This is a function to return a View that displays an image of a dog, given an image url from the data
 * @param json a json object with an 'url' string in it. Here we use the shorthand `{url}` to extract the string directly.
 * @returns a View component
 */
const DogPic = ({url}: {url: string}) => {
  return (
    <View style={styles.item}>
      <View style={styles.thumbnail}>
        <Image style={styles.pic} source={{uri: url}} />
      </View>
    </View>
  );
};

/**
 * In this async function, we send the request and wait for the server's response
 * @param counter an index to get the next breed url from a list
 * @returns an array of image urls
 */
async function fetchData(counter: number): Promise<string[]> {
  const url = getDogURL(counter);
  const data = await fetch(url);
  const json: any = await data.json();

  if (json.message) {
    const start = Math.floor(
      Math.random() * Math.max(0, json.message.length - 10),
    );
    return json.message?.slice(start, start + 10) || [];
  }

  return [];
}

export default function GetRequest() {
  // States for API data and loading status
  const [result, setResult] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // a counter to step through the predefined dog breed list
  const [counter, setCounter] = useState(0);

  // A function to fetch data and store result
  const getImages = async () => {
    setLoading(true);

    // start fetching
    const message: string[] = await fetchData(counter);

    // When we get the json data, we take a subset of it and store in via `setResult`
    setResult(message);
    setLoading(false);
    setCounter(counter + 1);
  };

  // Fetch data on initial load
  useEffect(() => {
    getImages();
  }, []);

  return (
    <View style={styles.bg}>
      <Text style={styles.info}>
        Here we call the public API provided by dog.ceo and display some dog
        photos. Enjoy!
      </Text>
      <BasicButton onPress={getImages} style={{marginBottom: 40}}>
        {loading ? 'Loading...' : 'Reload'}
      </BasicButton>

      <View style={styles.list}>
        <ScrollView style={styles.scrollView}>
          {result &&
            result.map((item, index) => (
              <DogPic url={item} key={`dog${index}`} />
            ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    padding: 0,
    backgroundColor: colors.light,
    alignSelf: 'stretch',
    alignItems: 'center',
    height: '100%',
  },
  list: {
    flex: 1,
  },
  scrollView: {
    alignSelf: 'center',
  },
  item: {
    width: 250,
    height: 250,
    marginBottom: 20,
    overflow: 'hidden',
  },
  thumbnail: {
    flex: 1,
    padding: 5,
    backgroundColor: colors.white,
    borderRadius: 5,
  },
  pic: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  info: {
    fontSize: fontsizes.p,
    color: colors.neutralBlack,
    padding: 30,
    textAlign: 'center',
  },
});
