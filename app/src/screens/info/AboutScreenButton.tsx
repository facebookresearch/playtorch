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
import * as Application from 'expo-application';
import * as React from 'react';
import {StyleProp, StyleSheet, TouchableOpacity, ViewStyle} from 'react-native';
import PTLIcon, {PTLIconNames} from '../../components/icon/PTLIcon';
import Colors from '../../constants/Colors';
import ExternalLinks from '../../constants/ExternalLinks';
import {AllModels} from '../../examples/Models';
import {InfoScreenProps} from '../../types/navigation';
import {InfoRowConfig} from './InfoRow';
import Package from '../../../package.json';
import {getJavaScriptRuntime} from '../../utils/RuntimeUtils';

type Props = {
  style?: StyleProp<ViewStyle>;
};

const ModelDocumentationRowConfigs: InfoRowConfig[] = AllModels.map(
  ({name, model, modelDocumentationLinks, contributorsLinks}) => ({
    label: name,
    infoScreenProps: {
      title: name,
      description: `The ${name} model can be downloaded at: ${model}`,
      rowConfigs: [
        modelDocumentationLinks?.length > 1
          ? {
              label: 'Model Documentation',
              infoScreenProps: {
                title: 'Model Documentation',
                description: `Model documentation for ${name}`,
                rowConfigs: modelDocumentationLinks.map((docLink, idx) => ({
                  label: `Documentation link ${idx + 1}`,
                  url: docLink,
                })),
              },
            }
          : {
              label: 'Model Documentation',
              url: modelDocumentationLinks[0],
            },
        contributorsLinks?.length > 1
          ? {
              label: 'Contributors',
              infoScreenProps: {
                title: 'Contributors',
                description: `Contributors to the ${name} model`,
                rowConfigs: contributorsLinks.map((docLink, idx) => ({
                  label: `Contributors link ${idx + 1}`,
                  url: docLink,
                })),
              },
            }
          : {
              label: 'Contributors',
              url: contributorsLinks[0],
            },
      ],
    },
  }),
);

const SocialRowConfigs: InfoRowConfig[] = [
  {
    label: 'Discord',
    url: ExternalLinks.DISCORD_URL,
  },
  {
    label: 'GitHub',
    url: ExternalLinks.GITHUB_URL,
  },
  {
    label: 'Twitter',
    url: ExternalLinks.TWITTER_URL,
  },
];

const AppInfoRowConfigs: InfoRowConfig[] = [
  {
    label: 'Name',
    text: `${Application.applicationName}`,
  },
  {
    label: 'Application version',
    text: `${Application.nativeApplicationVersion}`,
  },
  {
    label: 'Build version',
    text: `${Application.nativeBuildVersion}`,
  },
  {
    label: 'JavaScript Runtime',
    text: getJavaScriptRuntime(),
  },
  {
    label: 'expo',
    text: `${Package.dependencies.expo}`,
  },
  {
    label: 'react-native-pytorch-core',
    text: `${Package.dependencies['react-native-pytorch-core']}`,
  },
];

const AboutScreenProps: InfoScreenProps['route']['params'] = {
  title: 'About',
  description:
    'PlayTorch is a framework for rapidly creating cross-platform mobile AI experiences.',
  rowConfigs: [
    {
      label: 'PlayTorch Website',
      url: ExternalLinks.BASE_WEBSITE_URL,
    },
    {
      label: 'Community',
      infoScreenProps: {
        title: 'Community',
        description:
          'Join the discussion, give us feedback, and share what you are creating.',
        rowConfigs: SocialRowConfigs,
      },
    },
    {
      label: 'Terms of Service',
      url: ExternalLinks.TERMS_URL,
    },
    {
      label: 'Privacy Policy',
      url: ExternalLinks.PRIVACY_POLICY_URL,
    },
    {
      label: '3rd Party Notices',
      url: ExternalLinks.THIRD_PARTY_URL,
    },
    {
      label: 'ML Models',
      infoScreenProps: {
        title: 'ML Models',
        description:
          'Each PyTorch machine learning model included in the app is accompanied by specific documentation that may describe the creation of such model, permissions, limitations, and other conditions of use. Review the documentation for each model for further details prior to your use of these machine learning models.',
        rowConfigs: ModelDocumentationRowConfigs,
      },
    },
    {
      label: 'App Info',
      infoScreenProps: {
        title: 'App Info',
        description: 'PlayTorch application information.',
        rowConfigs: AppInfoRowConfigs,
      },
    },
  ],
};

export default function AboutScreenButton({style}: Props) {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={style}
      onPress={() => navigation.navigate('Info', AboutScreenProps)}>
      <PTLIcon name={PTLIconNames.INFO} style={styles.icon} size={24} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  icon: {
    color: Colors.WHITE,
  },
});
