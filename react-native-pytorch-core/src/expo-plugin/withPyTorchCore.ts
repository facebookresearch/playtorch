/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {
  ConfigPlugin,
  withAppBuildGradle,
  createRunOncePlugin,
  ExportedConfigWithProps,
  withProjectBuildGradle,
} from '@expo/config-plugins';

// Keeping the name, and version in sync with it's package.
const pkg = require('react-native-pytorch-core/package.json');

type Props = {};

const withPyTorch: ConfigPlugin<Props> = (config, _props = {}) => {
  config = withProjectBuildGradle(config, innerConfig => {
    if (innerConfig.modResults.language === 'groovy') {
      innerConfig.modResults.contents = setProjectRepositories(
        innerConfig,
        innerConfig.modResults.contents,
      );
    }
    return innerConfig;
  });

  config = withAppBuildGradle(config, innerConfig => {
    if (innerConfig.modResults.language === 'groovy') {
      innerConfig.modResults.contents = setClassPath(
        innerConfig,
        innerConfig.modResults.contents,
      );
    }
    return innerConfig;
  });

  return config;
};

export function setProjectRepositories(
  _config: Pick<ExportedConfigWithProps, 'android'>,
  buildGradle: string,
) {
  const finalBuildGradle = buildGradle.replace(
    /allprojects\s*?{\n\s*?repositories\s*?{/,
    `allprojects {
    repositories {
        maven {
          url("https://oss.sonatype.org/content/repositories/snapshots")
        }
        `,
  );

  return finalBuildGradle;
}

/**
 * Adding the Google Services plugin
 * NOTE(brentvatne): string replacement is a fragile approach! we need a
 * better solution than this.
 */
export function setClassPath(
  _config: Pick<ExportedConfigWithProps, 'android'>,
  buildGradle: string,
) {
  buildGradle = buildGradle.replace(
    /android\s?{/,
    `android {
    /**
     * Without the packaging options, it will result in the following build error:
     *
     * * What went wrong:
     * Execution failed for task ':app:mergeDebugNativeLibs'.
     * > A failure occurred while executing com.android.build.gradle.internal.tasks.Workers$ActionFacade
     *    > More than one file was found with OS independent path 'lib/x86/libfbjni.so'
     */
    packagingOptions {
        pickFirst '**/*.so'
    }
`,
  );

  //
  const finalBuildGradle = buildGradle.replace(
    /dependencies\s?{/,
    `dependencies {
    implementation 'org.pytorch:pytorch_android_lite:1.10.0'
    implementation 'org.pytorch:pytorch_android_torchvision_lite:1.10.0'
`,
  );

  return finalBuildGradle;
}

// A helper method that wraps `withRunOnce` and appends items to `pluginHistory`.
export default createRunOncePlugin(
  // The plugin to guard.
  withPyTorch,
  // An identifier used to track if the plugin has already been run.
  pkg.name,
  // Optional version property, if omitted, defaults to UNVERSIONED.
  pkg.version,
);
