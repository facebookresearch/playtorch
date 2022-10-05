/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @oncall playtorch
 */

import {ReactElement, useMemo} from 'react';
import * as React from 'react';
import {SectionList, StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MyDemosSection from './MyDemosSection';
import ScanQRCodeTile from '../../components/ScanQRCodeTile';

import Header, {HeaderLevel} from '../../components/Header';
import useSnackIdCache from '../../cache/useSnackIDCache';
import AboutScreenButton from '../info/AboutScreenButton';

type SectionListItem = {
  type: string;
  component: () => ReactElement | null;
};

type SectionListGroup = {
  title: string;
  headerLevel: HeaderLevel;
  data: readonly SectionListItem[];
};

const ViewDemoSectionListGroup: SectionListGroup = {
  title: 'View demo',
  headerLevel: 'h1',
  data: [
    {
      type: 'scanner',
      component: ScanQRCodeTile,
    },
  ],
};

const MyDemosSectionListGroup: SectionListGroup = {
  title: 'My demos',
  headerLevel: 'h1',
  data: [
    {
      type: 'demo-tile',
      component: MyDemosSection,
    },
  ],
};

const Item = ({data}: {data: SectionListItem}) => {
  const Component = data.component;
  return (
    <View style={styles.item}>
      <Component />
    </View>
  );
};

export default function MyDemosScreen() {
  const insets = useSafeAreaInsets();
  const {recentSnackIds, savedSnackIds} = useSnackIdCache();
  const sectionsData = useMemo(() => {
    const showMyDemos = recentSnackIds.length > 0 || savedSnackIds.size > 0;
    let myDemosSectionTitle: string = 'My demos';
    let myDemosSectionHeaderLevel: HeaderLevel = 'h1';
    if (recentSnackIds.length > 0 && savedSnackIds.size <= 0) {
      myDemosSectionTitle = 'Recently viewed';
      myDemosSectionHeaderLevel = 'h2';
    } else if (recentSnackIds.length <= 0 && savedSnackIds.size > 0) {
      myDemosSectionTitle = 'Saved';
      myDemosSectionHeaderLevel = 'h2';
    }
    MyDemosSectionListGroup.title = myDemosSectionTitle;
    MyDemosSectionListGroup.headerLevel = myDemosSectionHeaderLevel;
    return [
      ViewDemoSectionListGroup,
      ...(showMyDemos ? [MyDemosSectionListGroup] : []),
    ];
  }, [recentSnackIds, savedSnackIds]);
  return (
    <View style={StyleSheet.absoluteFill}>
      <SectionList<SectionListItem>
        style={insets}
        sections={sectionsData}
        keyExtractor={(item, index) => item.type + index}
        renderItem={({item}) => <Item data={item} />}
        renderSectionHeader={({section: {title, headerLevel}}) => (
          <View style={styles.header}>
            <Header level={headerLevel}>{title}</Header>
            {title === 'View demo' && <AboutScreenButton />}
          </View>
        )}
        stickySectionHeadersEnabled={false}
        SectionSeparatorComponent={({leadingItem}) => {
          return leadingItem ? <View style={styles.sectionSeparator} /> : null;
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 24,
    marginTop: 28,
    marginBottom: 22,
  },
  item: {
    paddingHorizontal: 24,
  },
  sectionSeparator: {
    height: 19,
  },
});
