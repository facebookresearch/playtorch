/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import semver, {SemVer} from 'semver';
import {ICommand} from './ICommand';

type Package = {
  path: string;
  version?: string;
  description?: string;
  location?: string;
};

type PackageHealthCheckResult = {
  package: Package;
  satisfies: boolean;
};

type HealthCheckRequirement = {
  minVersion: SemVer | null;
  packages?: Package[];
  parseInstalledPackages?(): Package[];
};

export type IHealthCheckConfig = {
  command: ICommand;
  healthCheck: IHealthCheck;
};

export interface IHealthCheck {
  getTitle(): string;
  getCommand(): ICommand;
  getMinVersion(): SemVer | null;
  satisfies(): boolean;
  hasPackages(): boolean;
  getRequiredPackages(): Package[];
  getInstalledPackages(): Package[];
  checkPackages(): PackageHealthCheckResult[];
}

export default class HealthCheck implements IHealthCheck {
  private title: string;
  private command: ICommand;
  private requirement: HealthCheckRequirement;

  constructor(
    title: string,
    command: ICommand,
    requirement: HealthCheckRequirement,
  ) {
    this.title = title;
    this.command = command;
    this.requirement = requirement;
  }

  getTitle(): string {
    return this.title;
  }

  getCommand(): ICommand {
    return this.command;
  }

  getMinVersion(): SemVer | null {
    return this.requirement.minVersion;
  }

  satisfies(): boolean {
    const {minVersion} = this.requirement;

    // No mininum version requirement, and it therefore always satisfies
    // version requirements.
    if (minVersion === null) {
      return true;
    }
    const version = this.command.getVersion();
    return semver.gte(version, minVersion);
  }

  hasPackages(): boolean {
    return this.requirement.packages?.length > 0;
  }

  getRequiredPackages(): Package[] {
    return this.requirement.packages;
  }

  getInstalledPackages(): Package[] {
    return this.requirement.parseInstalledPackages();
  }

  checkPackages(): PackageHealthCheckResult[] {
    const installedPackages = this.getInstalledPackages();
    const packages = this.getRequiredPackages();
    return packages.map(pkg => {
      const isInstalled =
        installedPackages.findIndex(installedPkg => {
          if (pkg.version != null) {
            return (
              installedPkg.path === pkg.path &&
              installedPkg.version === pkg.version
            );
          }
          return installedPkg.path === pkg.path;
        }) > -1;
      return {
        package: pkg,
        satisfies: isInstalled,
      };
    });
  }
}
