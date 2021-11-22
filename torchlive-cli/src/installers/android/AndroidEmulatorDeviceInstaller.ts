/**
 * Copyright (c) Facebook, Inc. and its affiliates.
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
import {getSDKPath} from '../../android/AndroidSDK';
import {AndroidVirtualDeviceName} from '../../utils/ToolingUtils';
import {TaskContext} from '../../task/Task';
import {IInstallerTask} from '../IInstaller';

export default class AndroidEmulatorDeviceInstaller
  extends AbstractAndroidCommandLineTools
  implements IInstallerTask {
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
    return result === '1';
  }

  mitigateOnError(): string {
    // TODO(T90094183) Add mitigation message
    return '';
  }

  async run(context: TaskContext): Promise<void> {
    const cltPath = this.getCommandLineToolPath();
    context.update(`Setting up ${this.getDescription()}`);
    const cmd = `echo "no" | ${cltPath} create avd --name "${AndroidVirtualDeviceName}" --device "pixel" --force --abi google_apis/x86_64 --package "system-images;android-29;google_apis;x86_64"`;
    await execCommand(context, cmd);

    const configPath = path.join(
      os.homedir(),
      `.android/avd/${AndroidVirtualDeviceName}.avd/config.ini`,
    );

    let config = ini.parse(fs.readFileSync(configPath, 'utf-8'));
    config = Object.assign(config, {
      'PlayStore.enabled': false,
      'abi.type': 'x86_64',
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
      'hw.cpu.arch': 'x86_64',
      'hw.dPad': 'no',
      'hw.device.hash2': 'MD5:6b5943207fe196d842659d2e43022e20',
      'hw.device.manufacturer': 'Google',
      'hw.device.name': 'pixel_4',
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
      'skin.dynamic': 'yes',
      'skin.name': 'pixel_4',
      'skin.path': path.join(getSDKPath(), 'skins/pixel_4'),
      'tag.display': 'Google APIs',
      'tag.id': 'google_apis',
      'vm.heapSize': 256,
    });

    const configStr = ini.stringify(config);
    fs.writeFileSync(configPath, configStr, {encoding: 'utf-8'});
  }
}
