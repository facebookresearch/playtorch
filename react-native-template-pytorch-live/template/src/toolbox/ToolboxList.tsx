/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import * as React from 'react';
import {useCallback} from 'react';
import {
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import {Tool, ToolSection} from './Toolbox';
import {useToolboxContext} from './ToolboxContext';

type Props = {
  tools: ToolSection;
  onSelect: (tool: Tool) => void;
};

type ListItem = {
  item: Tool;
};

export default function ToolboxList({tools, onSelect}: Props) {
  const {setActiveTool} = useToolboxContext();

  const renderItem = useCallback(
    ({item, index, section}) => {
      const {title, subtitle, apiTest} = item;
      let cornerStyle = styles.listItemContainer;
      if (index === 0) {
        cornerStyle = styles.listItemContainerTop;
      } else if (index === section.data.length - 1) {
        cornerStyle = styles.listItemContainerBottom;
      }
      return (
        <TouchableOpacity
          key={title}
          style={cornerStyle}
          activeOpacity={0.8}
          onPress={() => {
            setActiveTool(item);
            onSelect(item);
          }}>
          <View style={styles.listItem}>
            <View style={[styles.listItemThumbnail, apiTest && styles.apiTest]}>
              {item.icon}
            </View>
            <View style={styles.listItemText}>
              <Text style={styles.listItemTitle}>{title}</Text>
              <Text style={styles.listItemInfo}>{subtitle}</Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    },
    [setActiveTool, onSelect],
  );

  return (
    <>
      <View style={styles.full}>
        <Image
          style={styles.gradient}
          source={require('../../assets/images/gradient_bg3.png')}></Image>
      </View>
      <SectionList
        style={styles.container}
        sections={tools}
        renderItem={renderItem}
        renderSectionHeader={({section: {title}}) => (
          <Text style={styles.sectionTitle}>{title}</Text>
        )}
        keyExtractor={({title}) => `${title}`}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignSelf: 'stretch',
    paddingLeft: 40,
    paddingRight: 40,
  },
  separator: {
    height: 1,
    backgroundColor: '#CED0CE',
  },
  sectionTitle: {
    fontSize: 13,
    color: '#fff',
    letterSpacing: 5,
    textTransform: 'uppercase',
    marginTop: 40,
    marginBottom: 20,
  },
  listItemContainer: {
    backgroundColor: '#fff',
    overflow: 'hidden',
    borderBottomColor: '#f1f1f3',
    borderBottomWidth: 1,
  },
  listItemContainerTop: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    overflow: 'hidden',
    borderBottomColor: '#f1f1f3',
    borderBottomWidth: 1,
  },
  listItemContainerBottom: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    marginBottom: 20,
    overflow: 'hidden',
    borderBottomColor: '#f1f1f3',
    borderBottomWidth: 0,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    alignContent: 'stretch',
  },
  listItemText: {
    flex: 2,
    padding: 20,
  },
  listItemThumbnail: {
    flex: 1,
    width: 50,
    backgroundColor: '#e32d5b',
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 90,
  },
  apiTest: {
    backgroundColor: '#2b2b2b',
  },
  listItemTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#123',
    marginBottom: 3,
  },
  listItemInfo: {
    fontSize: 12,
    color: '#678',
  },
  full: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#78569e',
  },
  gradient: {
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
  },
});
