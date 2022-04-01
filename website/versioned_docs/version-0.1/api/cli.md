---
id: cli
---

# CLI

<div className="tutorial-page">

The PyTorch Live CLI (i.e., `torchlive-cli`) provides a set of commands to help you install build dependencies, initialize new PyTorch Live projects, build and deploy them to emulator or physical devices.

## Prerequisites

- **Node.js**: If you don't have it already, you can download Node.js LTS [from its website](https://nodejs.org/) or install via [Homebrew](https://formulae.brew.sh/formula/node) (ie, `brew install node`).

## Index {#index}

import TOCInline from "@theme/TOCInline"

<TOCInline toc={toc[1].children}/>

## PyTorch Live CLI commands {#torchlive-cli-commands}

Below is a list of PyTorch Live CLI commands and their usages:

#### Options {#options}

| Name          | Description            |
| ------------- | ---------------------- |
| `--version`   | Prints the CLI version |
| `--help`      | Shows the CLI help     |

### `npx torchlive-cli setup-dev` {#torchlive-cli-setup-dev}

The PyTorch Live CLI provides a setup routine to install all required build dependencies including tooling like Yarn, Watchman, and CocoaPods, SDKs like OpenJDK, Android SDK, Android SDK Manager, Android Virtual Device Manager, and an Android Emulator, and it installs a default emulator device ready to be used with PyTorch Live projects.

```shell
npx torchlive-cli setup-dev
```

:::note

The command may require `sudo` access for installing the different dependencies and can take approximately 20 minutes to complete. This depends on your laptop configuration, internet speed, and what dependencies have been installed previously.

:::

:::note

You only need to run the `npx torchlive-cli setup-dev` command once and it is not necessary to run the command every time before you start a new project. However, it is recommended to re-run this command once in a while to update development dependencies over time.

:::

If everything goes well, the terminal will looks similar to the following output.

```
➜  npx torchlive-cli setup-dev
  _                 _     _ _
 | |_ ___  _ __ ___| |__ | (_)_   _____
 | __/ _ \| '__/ __| '_ \| | \ \ / / _ \
 | || (_) | | | (__| | | | | |\ V /  __/
  \__\___/|_|  \___|_| |_|_|_| \_/ \___|

torchlive version 0.0.2-alpha.19
✔ Homebrew (3.3.3)
✔ OpenJDK (1.8.0)
✔ Watchman (null)
↓ Node (16.13.0) [SKIPPED]
✔ Yarn (1.22.15)
✔ Android SDK
✔ Android SDK Manager
✔ Android Emulator
✔ CocoaPods (1.11.2)
```

### `npx-torchlive-cli init [options] [name]` {#torchlive-cli-init}

Initialize a new PyTorch Live project.

```shell
npx torchlive-cli init MyFirstProject
```

#### Options {#torchlive-cli-init-options}

| Name             | Default                              | Description                                           |
| ---------------- | ------------------------------------ | ----------------------------------------------------- |
| `--template`     | `react-native-template-pytorch-live` | Specifies the template used to generate a new project |
| `--skip-install` |                                      | Skips dependencies installation step                  |

### `npx torchlive-cli run-android [options]` {#torchlive-cli-run-android}

Runs the PyTorch Live project on an Android emulator. It will run the project on a physical device if it is connected.

```shell
npx torchlive-cli run-android
```

:::info

If you want to deploy the app on your own device, you have to put it into developer mode.

>On Android 4.1 and lower, the Developer options screen is available by default. On Android 4.2 and higher, you must enable this screen. To enable developer options, tap the Build Number option 7 times.

More details are on the Android [configure on-device developer options](https://developer.android.com/studio/debug/dev-options).

:::

#### Options {#torchlive-cli-run-android-options}

| Name             | Default                              | Description                                                         |
| ---------------- | ------------------------------------ | ------------------------------------------------------------------- |
| `--name`, `-n`   | `"pytorch_live"`                     | Run PyTorch Live project on a specific Android Virtual Device (AVD) |

### `npx torchlive-cli run-ios` {#torchlive-cli-run-ios}

Runs the PyTorch Live project on an iOS simulator.

:::info

In order to run a PyTorch Live project on an iOS simulator or a physical iOS device, you need to install Xcode from the Apple App Store on your macOS device. PyTorch Live currently supports Xcode version 12.5 or later.

:::

```shell
npx torchlive-cli run-ios
```

### `npx torchlive-cli emulator [options]` {#torchlive-cli-emulator}

Starts the "pytorch_live" Android Virtual Device emulator.

### `npx torchlive-cli clean` {#torchlive-cli-clean}

Cleans the build files and directories.

```shell
npx torchlive-cli clean
```

### `npx torchlive-cli emulator` {#torchlive-cli-emulator}

Starts the emulator without building, deploying, and running the PyTorch Live project.

```shell
npx torchlive-cli emulator
```

### `npx torchlive-cli doctor` {#torchlive-cli-doctor}

Runs health checks to verify if all necessary dependencies are installed.

```shell
npx torchlive-cli doctor
```

:::note

Run the `npx torchlive-cli setup-dev` command if any of the health checks fail.

:::

### `npx torchlive-cli log` {#torchlive-cli-log}

Prints the PyTorch Live CLI logs to the terminal.

```shell
npx torchlive-cli log
```

### `npx torchlive-cli help [command]` {#torchlive-cli-help}

Shows additional help for a command.

```shell
npx torchlive-cli help init
```

</div>
