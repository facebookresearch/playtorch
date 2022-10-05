/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @oncall playtorch
 */

import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import PagerView from 'react-native-pager-view';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNUX} from '../../utils/NUX';
import GradientBackground from '../../components/GradientBackground';
import PillButton from '../../components/PillButton';
import IntroPageContent, {IntroPageContentProps} from './IntroPageContent';
import IntroPageIndicator from './IntroPageIndicator';

const IntroPages: IntroPageContentProps[] = [
  {
    headerText: 'Build your AI powered mobile prototypes in minutes',
    contentImg: require('../../assets/images/examples-nux/examples-nux.png'),
  },
  {
    headerText: 'Import demos from Expo to view and experiment with AI models',
    contentImg: require('../../assets/images/expo-nux/expo-nux.png'),
  },
  {
    headerText: 'Explore state of the art on-device AI models',
    contentImg: require('../../assets/images/obj-det-nux/obj-det-nux.png'),
  },
];

const Pages = IntroPages.map((pageContentProps, index) => (
  <IntroPageContent {...pageContentProps} key={index} />
));

export default function NUXScreen() {
  const navigation = useNavigation();
  const {dismissNUX} = useNUX('intro');
  const handleDismiss = useCallback(() => {
    dismissNUX();
    navigation.goBack();
  }, [navigation, dismissNUX]);
  const [buttonLabel, setButtonLabel] = useState('Skip');
  const [activePageIndex, setActivePageIndex] = useState(0);
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => getStyles(insets), [insets]);
  useEffect(() => {
    if (activePageIndex === IntroPages.length - 1) {
      setButtonLabel('Done');
    }
  }, [activePageIndex, setButtonLabel]);
  return (
    <View style={StyleSheet.absoluteFill}>
      <GradientBackground />
      <View style={styles.container}>
        <PagerView
          style={styles.pager}
          initialPage={0}
          onPageSelected={({nativeEvent: {position}}) => {
            setActivePageIndex(position);
          }}>
          {Pages}
        </PagerView>
        <IntroPageIndicator
          count={Pages.length}
          activeIndex={activePageIndex}
          style={styles.pageIndicator}
        />
        <PillButton
          buttonStyle="primary"
          label={buttonLabel}
          onPress={handleDismiss}
        />
      </View>
    </View>
  );
}

function getStyles(insets: EdgeInsets) {
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      height: '100%',
      width: '100%',
      paddingTop: 34,
      paddingBottom: 53,
      marginTop: insets.top,
      marginBottom: insets.bottom,
    },
    pager: {
      flex: 1,
      width: '100%',
    },
    pageIndicator: {
      marginVertical: 24,
    },
  });
}
