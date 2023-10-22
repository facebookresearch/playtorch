# PlayTorch App

This folder contains the code to build the PlayTorch app.

## Development

Build the PlayTorch requires the React Native development environment to be set up. If you haven't done this before, follow the steps on the [React Native Environment Setup](https://reactnative.dev/docs/environment-setup) steps on the React Native website.

### Navigate to PlayTorch app directory

Navigate to the PlayTorch app directory.

```
cd app
```

Note: It's the same directory as this `README.md`. You can skip this step if you are already in this directory.

### Install app dependencies

The PlayTorch app is a Expo prebuild app. It uses `yarn` to manage app dependencies. Use the following command to install all dependencies:

```
yarn
```

### Run app on Android

#### Change gradle.properties

Update the Gradle `distributionUrl` from

```
distributionUrl=../../../../../ci/gradle-7.5.1-all.zip
```

to

```
distributionUrl=https\://services.gradle.org/distributions/gradle-7.5.1-all.zip
```

Or alternatively, apply the following patch:

```diff 
diff --git a/app/android/gradle/wrapper/gradle-wrapper.properties b/app/android/gradle/wrapper/gradle-wrapper.properties
--- a/app/android/gradle/wrapper/gradle-wrapper.properties
+++ b/app/android/gradle/wrapper/gradle-wrapper.properties
@@ -1,5 +1,5 @@
 distributionBase=GRADLE_USER_HOME
 distributionPath=wrapper/dists
-distributionUrl=../../../../../ci/gradle-7.5.1-all.zip
+distributionUrl=https\://services.gradle.org/distributions/gradle-7.5.1-all.zip
 zipStoreBase=GRADLE_USER_HOME
 zipStorePath=wrapper/dists
```

Build the app for Android

```
yarn android
```

### Run app on iOS

Install CocoaPod dependencies

```
(cd ios && pod install)
```

Build the app for iOS

```
yarn ios
```

## Attribution

The following pages contain the attribution notices for third party software that may be contained in portions of this product:

* [iOS Third Party Notices](https://playtorch.dev/app/third-party-notices-ios/)
* [Android Third Party Notices](https://playtorch.dev/app/third-party-notices-android/)
