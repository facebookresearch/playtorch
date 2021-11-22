# PyTorch Live
PyTorch Live is an open source playground for everyone to discover, build, test and share on-device AI demos built on PyTorch.

This monorepo includes the PyTorch Live command line interface (i.e., `torchlive`), a React Native package to interface with PyTorch Mobile, and a React Native template with examples ready to be deployed on mobile devices.

## Contents
- [Requirements](#-requirements)
- [Building your first PyTorch Live app](#-building-your-first-pytorch-live-app)
- [How to Contribute](#-how-to-contribute)
- [Code of Conduct](#code-of-conduct)
- [License](#-license)

## Requirements
PyTorch Live apps may target Android 5.0 (API 29) or newer. You may use Windows, macOS, or Linux as your development operating system, though building and running the PyTorch Live CLI is limited to macOS.

## Building your first PyTorch Live app
The following steps will guide you through an install of the PyTorch Live dependencies, how to initialize your first PyTorch Live project, and how to run the initial project in an emulator or on your device.

### 1. Install PyTorch Live CLI
Install the PyTorch Live CLI from npmjs.

Node:
```sh
npm install -g torchlive-cli
```

Yarn:
```sh
yarn global add torchlive-cli
```

### 2. Install Build Dependencies
The PyTorch Live CLI provides a setup routine to install all required build dependencies including the OpenJDK, Android SDK, Android SDK Manager, Android Virtual Device Manager, Android Emulator, Node.js, Yarn, Watchman and it installs a default emulator device ready to be used with PyTorch Live projects.

```sh
torchlive setup-dev
```

NOTE: The command requires `sudo` access and can take approximately 20 minutes to complete. This depends on your laptop configuration and what dependencies have been installed previously.

If everything goes well, the terminal will looks similar to the following output.

**Expected output**
```sh
$ torchlive setup-dev
  _                 _     _ _
 | |_ ___  _ __ ___| |__ | (_)_   _____
 | __/ _ \| '__/ __| '_ \| | \ \ / / _ \
 | || (_) | | | (__| | | | | |\ V /  __/
  \__\___/|_|  \___|_| |_|_|_| \_/ \___|

torchlive version 0.0.1-ac3c51619
Password:
↓ Homebrew (null) [SKIPPED]
✔ OpenJDK (1.8.0)
✔ Watchman (4.9.0)
✔ Node (16.1.0)
✔ Yarn (1.22.10)
✔ Android SDK
✔ Android SDK Manager
✔ Android Emulator
✔ Android Emulator Skin
```

### 3. Initialize Your First PyTorch Live Project
For PyTorch Live, we provide a basic React Native template with a few examples for PyTorch Mobile vision models such as Resnet18 or MobileNetV3. Use the `torchlive init` command to initialize your first PyTorch Live project.

```sh
torchlive init MyFirstProject
```

**Expected output**
```sh
$ torchlive init MyFirstProject
  _                 _     _ _
 | |_ ___  _ __ ___| |__ | (_)_   _____
 | __/ _ \| '__/ __| '_ \| | \ \ / / _ \
 | || (_) | | | (__| | | | | |\ V /  __/
  \__\___/|_|  \___|_| |_|_|_| \_/ \___|

torchlive version 0.0.1-ac3c51619
✔ project MyFirstProject
```

### 4. Run Your First Project in the Emulator or on Your Device
```sh
cd MyFirstProject
torchlive run-android
```

If you want to deploy the app on your own device, you have to put it into developer mode.

>On Android 4.1 and lower, the Developer options screen is available by default. On Android 4.2 and higher, you must enable this screen. To enable developer options, tap the Build Number option 7 times.

More details are on the Android [configure on-device developer options](https://developer.android.com/studio/debug/dev-options).

## How to Contribute
The main purpose of this repository is to continue evolving PyTorch Live. We want to make contributing to this project as easy and transparent as possible, and we are grateful to the community for contributing bug fixes and improvements. Read below to learn how you can take part in improving PyTorch Live.

### [Code of Conduct][code]
Facebook has adopted a Code of Conduct that we expect project participants to adhere to.
Please read the [full text][code] so that you can understand what actions will and will not be tolerated.

[code]: https://code.fb.com/codeofconduct/

### [Contributing Guide][contribute]
Read our [**Contributing Guide**][contribute] to learn about our development process, how to propose bugfixes and improvements, and how to build and test your changes to PyTorch Live.

[contribute]: CONTRIBUTING.md

## License
PyTorch Live is MIT licensed, as found in the [LICENSE][license] file.

[license]: LICENSE.md
