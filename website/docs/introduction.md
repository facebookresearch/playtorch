---
sidebar_position: 1
---

# Tutorial Intro

Let's set up the build environment (~20 minutes), and then discover your **first mobile AI app in less than 5 minutes**.

## Set up build environment (~20 minutes)

The torchlive CLI provides a setup routine to install all required build dependencies including the OpenJDK, Android SDK, Android SDK Manager, Android Virtual Device Manager, Android Emulator, Node.js, Yarn, Watchman and it installs a default emulator device ready to be used with PyTorch Live projects.

Setup the build environment using the **setup-dev** command:

```shell
npx torchlive-cli setup-dev
```

:::note

The command requires `sudo` access and can take approximately 20 minutes to complete. This depends on your laptop configuration and what dependencies have been installed previously.

:::

:::info

You only need to run the `npx torchlive-cli setup-dev` command once and it is **not** necessary to run the command every time before you start a new project.

:::

If everything goes well, the terminal will looks similar to the following output.

```shell title="Expected output"
❯ npx torchlive-cli setup-dev
  _                 _     _ _
 | |_ ___  _ __ ___| |__ | (_)_   _____
 | __/ _ \| '__/ __| '_ \| | \ \ / / _ \
 | || (_) | | | (__| | | | | |\ V /  __/
  \__\___/|_|  \___|_| |_|_|_| \_/ \___|

torchlive version 0.0.2-alpha.5
Password:
↓ Homebrew (3.1.7) [SKIPPED]
✔ OpenJDK (1.8.0)
✔ Watchman (4.9.0)
↓ Node (16.1.0) [SKIPPED]
✔ Yarn (1.22.10)
✔ Android SDK
✔ Android SDK Manager
✔ Android Emulator
✔ Android Emulator Skin
```

### Install Python3

Currently, `python3` is required to automatically bootstrap PyTorch Mobile models used in the example app as part of the `npx torchlive-cli init` command. However, `python3` is not part of the PyTorch Live CLI `setup-dev` command. On macOS Catalina and Big Sur, `python3` is pre-installed. Run the following command to check if python3 is installed:

```shell
python3 --version
```

```shell title="Expected output"
❯ python3 --version
Python 3.9.4
```

:::note

The version installed on your machine might be slightly different, but should at least be version `3.7` or above.

:::


If `python3` is not installed, you can install it via Homebrew on macOS:

```shell
brew install python3
```

:::note

Homebrew (i.e., `brew`) will be installed as part of the `npx torchlive-cli setup-dev` if Homebrew wasn't installed already.

:::

## Getting Started

The following steps will guide you through an install of the PyTorch Live build dependencies, how to initialize your first PyTorch Live project, and how to run the initial project in an emulator or on your device.

### Initialize Your First PyTorch Live Project

For PyTorch Live, we provide a basic React Native template with a few examples for PyTorch Mobile vision models such as Resnet18 or MobileNetV3. Use the `npx torchlive-cli init` command to initialize your first PyTorch Live project.

```shell
npx torchlive-cli init MyFirstProject
```

```shell title="Expected output"
❯ npx torchlive-cli init MyFirstProject
  _                 _     _ _
 | |_ ___  _ __ ___| |__ | (_)_   _____
 | __/ _ \| '__/ __| '_ \| | \ \ / / _ \
 | || (_) | | | (__| | | | | |\ V /  __/
  \__\___/|_|  \___|_| |_|_|_| \_/ \___|

torchlive version 0.0.2-alpha.5
✔ project MyFirstProject

```

### Run Your First Project in the Emulator or on Your Device

Navigate to the newly created PyTorch Live project folder.

```shell
cd MyFirstProject
```

Run the PyTorch Live project on an Android emulator.

```shell
npx torchlive-cli run-android
```

If you want to deploy the app on your own device, you have to put it into developer mode.

>On Android 4.1 and lower, the Developer options screen is available by default. On Android 4.2 and higher, you must enable this screen. To enable developer options, tap the Build Number option 7 times.

More details are on the Android [configure on-device developer options](https://developer.android.com/studio/debug/dev-options).

#### Emulator

![](/img/tutorial/pytorch_live_in_emulator.png "The PyTorch Live app running in a virtual device emulator")
