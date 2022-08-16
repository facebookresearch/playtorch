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
} from '@expo/config-plugins';

// Keeping the name, and version in sync with it's package.
const pkg = require('react-native-pytorch-core/package.json');

type Props = {};

const withPyTorch: ConfigPlugin<Props> = (config, _props = {}) => {
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

/**
 * Adding the Google Services plugin
 * NOTE(brentvatne): string replacement is a fragile approach! we need a
 * better solution than this.
 */
export function setClassPath(
  _config: Pick<ExportedConfigWithProps, 'android'>,
  buildGradle: string,
) {
  let mutatedBuildGradle = buildGradle.replace(
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
    sourceSets {
        main {
            jniLibs.srcDirs += ["$buildDir/extra-jniLibs/jni"]
        }
    }
    configurations {
        extraJNILibs
    }
`,
  );

  mutatedBuildGradle = mutatedBuildGradle.replace(
    /dependencies\s?{/,
    `
// Extract JNI shared libraries as project libraries. This assumes the target directory, $buildDir/extra-jniLibs, is added to the jniLibs.srcDirs configuration.
task extraJNILibs {
  doLast {
    configurations.extraJNILibs.files.each {
      def file = it.absoluteFile

      copy {
        from zipTree(file)
        into "$buildDir/extra-jniLibs" // temp location instead of "src/main/jniLibs"
        include "jni/**/*"
      }
    }
  }
}

tasks.whenTaskAdded { task ->
  if (task.name == 'mergeDebugJniLibFolders' || task.name == 'mergeReleaseJniLibFolders') {
    task.dependsOn(extraJNILibs)
  }
}

dependencies {
    // Used to control the version of libfbjni.so packaged into the APK
    extraJNILibs("com.facebook.fbjni:fbjni:0.2.2")
`,
  );

  return mutatedBuildGradle;
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
