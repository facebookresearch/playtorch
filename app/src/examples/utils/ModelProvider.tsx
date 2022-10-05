/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @oncall playtorch
 */

import {useHeaderHeight} from '@react-navigation/elements';
import {useNavigation} from '@react-navigation/native';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {CircularProgressBase} from 'react-native-circular-progress-indicator';
import FastImage from 'react-native-fast-image';
import {ModelInfo, Module, torch} from 'react-native-pytorch-core';
import Colors from '../../constants/Colors';
import {AttributedModelInfo} from '../Models';
import {downloadModel, isModelAvailable, ModelDownload} from './ModelManager';

const bgImg = require('../../assets/images/model-loader/model-loader-background.png');
const downloadImg = require('../../assets/images/model-loader/model-download.png');
const stopImg = require('../../assets/images/model-loader/model-download-stop.png');

const k = 1024;

function calcByteFactor(bytes: number): number {
  return Math.floor(Math.log(bytes) / Math.log(k));
}

function formatBytes(
  bytes: number,
  hasFinalSize: boolean = true,
  byteFactor: number = -1,
  decimals: number = 0,
): string {
  if (bytes === 0) {
    return ' ';
  }

  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  let i = calcByteFactor(bytes);
  if (byteFactor > -1) {
    i = byteFactor;
  }

  let finalSize = '';
  if (hasFinalSize) {
    finalSize = ' ' + sizes[i];
  }

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + finalSize;
}

function formatDownloadProgress(
  bytesWritten: number,
  bytesExpectedToWrite: number,
): string {
  if (bytesWritten === 0) {
    return '';
  }

  const byteFactor = calcByteFactor(bytesExpectedToWrite);

  return `${formatBytes(bytesWritten, false, byteFactor)} / ${formatBytes(
    bytesExpectedToWrite,
  )}`;
}

type ModelCache = {[key: string]: Module};

type Context = {
  cache: ModelCache;
  isLoading: boolean;
  loadModels(modelInfos: ModelInfo[]): void;
};

export const ModelContext = React.createContext<Context>({
  cache: {},
  isLoading: false,
  loadModels: (_modelInfos: ModelInfo[]) => {},
});
ModelContext.displayName = 'ModelContext';

export function useLoadModels(modelInfos: AttributedModelInfo[]): boolean {
  const navigation = useNavigation();
  const {isLoading, loadModels} = useContext(ModelContext);
  // The loadModels call needs to be within a React useEffect hook or otherwise
  // it will error: "Cannot update a component (`ModelProvider`) while
  // rendering a different component (`MNISTExample`).
  // Full error in this Paste: P495380069
  useEffect(() => {
    async function process() {
      // Check what models need to be downloaded and what models already exist on
      // the file system.
      const modelsToDownload = [];
      for (let i = 0; i < modelInfos.length; i++) {
        const modelInfo = modelInfos[i];
        const isAvailable = await isModelAvailable(modelInfo);
        if (!isAvailable) {
          modelsToDownload.push(modelInfo);
        }
      }

      if (modelsToDownload.length === 0) {
        loadModels(modelInfos);
        return;
      }

      // Get the total bytes to download all models requested in the
      // useLoadModels hook
      const totalBytes = modelsToDownload
        .map(modelInfo => {
          return modelInfo.contentLength;
        })
        .reduce((previousValue, currentValue) => previousValue + currentValue);

      // Convert total bytes to human friendly format
      const totalSize = formatBytes(totalBytes);

      Alert.alert(
        '“PlayTorch” Would Like To Download Models',
        `Total download size is ${totalSize}.`,
        [
          {
            text: 'Cancel',
            onPress: () => {
              navigation.goBack();
            },
            style: 'cancel',
          },
          {
            text: 'Download',
            onPress: () => {
              // Keep using modelInfos instead of modelsToDownload because the
              // loadModels also loads the model in memory for inference. Only
              // reducing it to modelsToDownload may crash the app because it
              // cannot find previously downloaded models in the model cache.
              loadModels(modelInfos);
            },
          },
        ],
      );
    }
    process();
  }, [loadModels, modelInfos, navigation]);
  return isLoading;
}

export function useModel(modelInfo: ModelInfo): Module | null {
  const {cache} = useContext(ModelContext);
  return cache[modelInfo.name];
}

/**
 * The gradient background is a workaround solution and will most likely be
 * replaced by a gradient drawn on a canvas component.
 *
 * @returns A component with a gradient image as background.
 */
function GradientBackground() {
  return (
    <FastImage style={backgroundStyles.gradientBackground} source={bgImg} />
  );
}

const backgroundStyles = StyleSheet.create({
  gradientBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
    backgroundColor: Colors.ALMOST_BLACK,
  },
});

type Props = React.PropsWithChildren<{}>;

export default function ModelProvider({children}: Props) {
  const navigation = useNavigation();
  const headerHeight = useHeaderHeight();
  const [isLoading, setIsLoading] = useState(false);
  const [models, setModels] = useState<ModelCache>({});
  const isCancelledRef = useRef<boolean>(false);
  const downloadResumableRef = useRef<ModelDownload | null>(null);
  const [bytesWritten, setBytesWritten] = useState(0);
  const [bytesExpectedToWrite, setBytesExpectedToWrite] = useState(0);
  const [modelProgress, setModelProgress] = useState({i: 0, n: 0});

  const loadModels = useCallback(
    async (modelInfos: ModelInfo[]) => {
      isCancelledRef.current = false;
      setIsLoading(true);
      for (let i = 0; i < modelInfos.length; i++) {
        setModelProgress({
          i: i + 1,
          n: modelInfos.length,
        });
        // Break early if download was cancelled by the user
        if (isCancelledRef.current) {
          break;
        }

        const modelInfo = modelInfos[i];
        const downloadResumable = await downloadModel(
          modelInfo,
          ({totalBytesWritten, totalBytesExpectedToWrite}) => {
            setBytesWritten(totalBytesWritten);
            setBytesExpectedToWrite(totalBytesExpectedToWrite);
          },
        );

        downloadResumableRef.current = downloadResumable;

        const filePath = await downloadResumable?.waitToComplete();

        if (filePath != null) {
          const key = modelInfo.name;
          try {
            const model = await torch.jit._loadForMobile(filePath);
            setModels(m => {
              return {
                ...m,
                [key]: model,
              };
            });
          } catch (error) {
            // TODO(T117530082) Report error when model load failed
          }
        } else {
          // TODO(T117530082) Report error to the user when download didn't yield a file
        }
      }
      setIsLoading(false);
    },
    [
      isCancelledRef,
      setIsLoading,
      setBytesWritten,
      setBytesExpectedToWrite,
      setModelProgress,
    ],
  );

  const value = useMemo(() => {
    return {
      cache: models,
      isLoading,
      loadModels,
    };
  }, [isLoading, models, loadModels]);

  const progressLabel = useMemo(() => {
    if (bytesExpectedToWrite === 0) {
      return ' ';
    }
    const downloadProgress = formatDownloadProgress(
      bytesWritten,
      bytesExpectedToWrite,
    );
    const assetProgress = `${modelProgress.i}/${modelProgress.n}`;
    return `${downloadProgress} (${assetProgress})`;
  }, [bytesExpectedToWrite, bytesWritten, modelProgress.i, modelProgress.n]);

  async function handleCancel() {
    isCancelledRef.current = true;
    await downloadResumableRef.current?.cancel();
    navigation.goBack();
  }

  return (
    <ModelContext.Provider value={value}>
      {isLoading && (
        <View style={[styles.container, {marginTop: -headerHeight}]}>
          <GradientBackground />
          <CircularProgressBase
            value={bytesWritten}
            maxValue={bytesExpectedToWrite}
            activeStrokeColor="#9A3AAB"
            activeStrokeSecondaryColor="#7C4DFF"
            delay={0}
            duration={0}
            radius={92}
            inActiveStrokeOpacity={0.05}
            inActiveStrokeWidth={8}
            inActiveStrokeColor="#ffffff"
            activeStrokeWidth={8}>
            <TouchableOpacity onPress={handleCancel} activeOpacity={0.7}>
              <FastImage
                style={styles.statusImage}
                source={isLoading ? stopImg : downloadImg}
              />
            </TouchableOpacity>
          </CircularProgressBase>
          <Text style={styles.label}>{progressLabel}</Text>
        </View>
      )}
      {children}
    </ModelContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  label: {
    color: Colors.WHITE,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.5,
    lineHeight: 16,
    marginTop: 19,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  statusImage: {
    height: 48,
    width: 48,
  },
});
