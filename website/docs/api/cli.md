---
id: cli
---

# CLI

The PyTorch Live CLI (i.e., `torchlive-cli`) provides a set of commands to help you install build dependencies, initialize new PyTorch Live projects, build and deploy them to emulator or physical devices.

```shell npm2yarn
npm install torchlive-cli -g
```

## Index {#index}

import TOCInline from "@theme/TOCInline"

<TOCInline toc={toc[1].children}/>

## PyTorch Live CLI commands {#torchlive-cli-commands}

Below is a list of Docusaurus CLI commands and their usages:

#### Options {#options}

| Name          | Description            |
| ------------- | ---------------------- |
| `--version`   | Prints the CLI version |
| `--help`      | Shows the CLI help     |

### `torchlive setup-dev` {#torchlive-cli-setup-dev}

The torchlive CLI provides a setup routine to install all required build dependencies including the OpenJDK, Android SDK, Android SDK Manager, Android Virtual Device Manager, Android Emulator, Node.js, Yarn, Watchman and it installs a default emulator device ready to be used with PyTorch Live projects.

```shell
torchlive setup-dev
```

:::note

The command requires `sudo` access and can take approximately 20 minutes to complete. This depends on your laptop configuration and what dependencies have been installed previously.

:::

:::note

You only need to run the `torchlive setup-dev` command once and it is not necessary to run the command every time before you start a new project.
If everything goes well, the terminal will looks similar to the following output.

:::

### `torchlive init [options] [name]` {#torchlive-cli-init}

Initialize a new PyTorch Live project.

```shell
torchlive init MyFirstProject
```

#### Options {#torchlive-cli-init-options}

| Name         | Default                              | Description                                            |
| ------------ | ------------------------------------ | ------------------------------------------------------ |
| `--template` | `react-native-template-pytorch-live` | Specifies the template used to generate a new project. |

### `torchlive run-android [options]` {#torchlive-cli-run-android}

Runs the PyTorch Live project on an Android emulator. It will run the project on a physical device if it is connected.

```shell
torchlive run-android
```

:::info

If you want to deploy the app on your own device, you have to put it into developer mode.

>On Android 4.1 and lower, the Developer options screen is available by default. On Android 4.2 and higher, you must enable this screen. To enable developer options, tap the Build Number option 7 times.

More details are on the Android [configure on-device developer options](https://developer.android.com/studio/debug/dev-options).

:::

### `torchlive clean` {#torchlive-cli-clean}

Cleans the build files and directories.

```shell
torchlive clean
```

### `torchlive emulator` {#torchlive-cli-emulator}

Starts the emulator without building, deploying, and running the PyTorch Live project.

```shell
torchlive emulator
```

### `torchlive doctor` {#torchlive-cli-doctor}

Runs health checks to verify if all necessary dependencies are installed.

```shell
torchlive doctor
```

:::note

Run the `torchlive setup-dev` command if any of the health checks fail.

:::

### `torchlive log` {#torchlive-cli-log}

Prints the PyTorch Live CLI logs to the terminal.

```shell
torchlive log
```

### `torchlive help [command]` {#torchlive-cli-help}

Shows additional help for a command.

```shell
torchlive help init
```
