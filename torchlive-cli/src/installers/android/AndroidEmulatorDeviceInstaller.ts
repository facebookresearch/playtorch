/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {execCommand, execCommandSync, isMacOS} from '../../utils/SystemUtils';
import AbstractAndroidCommandLineTools from './AbstractAndroidCommandLineTools';
import os from 'os';
import path from 'path';
import fs from 'fs';
import * as ini from 'ini';
import {AndroidVirtualDeviceName} from '../../utils/ToolingUtils';
import {TaskContext} from '../../task/Task';
import {
  IInstallerTask,
  getInstallerErrorMitigationMessage,
} from '../IInstaller';
import cliPkgInfo from '../../../package.json';

export default class AndroidEmulatorDeviceInstaller
  extends AbstractAndroidCommandLineTools
  implements IInstallerTask
{
  constructor() {
    super('tools/bin/avdmanager');
  }

  isValid(): boolean {
    return isMacOS();
  }

  getDescription(): string {
    return 'Android Emulator';
  }

  isInstalled(): boolean {
    const cltPath = this.getCommandLineToolPath();
    const result = execCommandSync(
      `${cltPath} list avd -c | grep ${AndroidVirtualDeviceName} &> /dev/null && echo 1 || echo 0`,
    );
    return result === '1' && this.isEmulatorUpToDate();
  }

  mitigateOnError(): string {
    return getInstallerErrorMitigationMessage(
      this,
      'https://developer.android.com/studio/run/managing-avds',
    );
  }

  async run(context: TaskContext): Promise<void> {
    if (
      !this.isEmulatorUpToDate() &&
      !(await this.getUserConsentUpdate(context))
    ) {
      context.update(
        '[Warning] Skipping the installation/update of emulator may lead to unexpected exception when running PyTorchLive on android emulator.',
      );
      // wait for 2 second for user to read the warning message.
      await new Promise(f => setTimeout(f, 2000));
      return;
    }
    const cltPath = this.getCommandLineToolPath();
    const abi = this.getAbi();
    context.update(`Setting up ${this.getDescription()}`);
    const cmd = `echo "no" | ${cltPath} create avd --name "${AndroidVirtualDeviceName}" --device "pixel" --force --abi google_apis/${abi} --package "system-images;android-29;google_apis;${abi}"`;
    await execCommand(context, cmd);

    const configPath = this._getConfigPath();

    let config = ini.parse(fs.readFileSync(configPath, 'utf-8'));
    config = Object.assign(config, {
      'torchlive.cli.version': cliPkgInfo.version,
      'PlayStore.enabled': false,
      'abi.type': abi,
      'avd.ini.encoding': 'UTF-8',
      'disk.dataPartition.size': '16G',
      'fastboot.chosenSnapshotFile': '',
      'fastboot.forceChosenSnapshotBoot': 'no',
      'fastboot.forceColdBoot': 'no',
      'fastboot.forceFastBoot': 'yes',
      'hw.accelerometer': 'yes',
      'hw.arc': false,
      'hw.audioInput': 'yes',
      'hw.battery': 'yes',
      'hw.camera.back': 'webcam0',
      'hw.camera.front': 'webcam0',
      'hw.cpu.arch': abi === 'arm64-v8a' ? 'arm64' : 'x86_64',
      'hw.dPad': 'no',
      'hw.device.hash2': 'MD5:6b5943207fe196d842659d2e43022e20',
      'hw.device.manufacturer': 'Google',
      'hw.gps': 'yes',
      'hw.gpu.enabled': 'yes',
      'hw.gpu.mode': 'host',
      'hw.initialOrientation': 'Portrait',
      'hw.keyboard': 'no',
      'hw.lcd.density': 440,
      'hw.lcd.height': 2280,
      'hw.lcd.width': 1080,
      'hw.mainKeys': 'no',
      'hw.ramSize': 1536,
      'hw.sdCard': 'yes',
      'hw.sensors.orientation': 'yes',
      'hw.sensors.proximity': 'yes',
      'hw.trackBall': 'no',
      'runtime.network.latency': 'none',
      'runtime.network.speed': 'full',
      showDeviceFrame: 'yes',
      'tag.display': 'Google APIs',
      'tag.id': 'google_apis',
      'vm.heapSize': 256,
    });

    const configStr = ini.stringify(config);
    fs.writeFileSync(configPath, configStr, {encoding: 'utf-8'});
  }

  _getConfigPath(): string {
    return path.join(
      os.homedir(),
      `.android/avd/${AndroidVirtualDeviceName}.avd/config.ini`,
    );
  }

  private isEmulatorUpToDate(): boolean {
    const configPath = this._getConfigPath();
    if (fs.existsSync(configPath)) {
      const config = ini.parse(fs.readFileSync(configPath, 'utf-8'));
      return config['torchlive.cli.version'] === cliPkgInfo.version;
    }
    return false;
  }

  async getUserConsentUpdate(context: TaskContext): Promise<boolean> {
    // Ask for user consent if accept all option is false or unset.
    if (!context.ctx.yes) {
      const userConfirm = await context.task.prompt<boolean>({
        type: 'confirm',
        message: `The PyTorch Live Android emulator is either missing or out-of-date.

Would you like to create or update the PyTorch Live Android emulator?`,
      });
      return userConfirm;
    }
    return true;
  }
}
