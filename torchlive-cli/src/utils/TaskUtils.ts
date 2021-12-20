/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {spawn, SpawnOptionsWithoutStdio} from 'child_process';
import {
  Listr,
  ListrContext,
  ListrRendererFactory,
  ListrTaskWrapper,
} from 'listr2';
import {Observable} from 'rxjs';
import {
  isCommandInstallerTask,
  isInstallerTask,
} from '../installers/IInstaller';
import {ITask, TaskContext} from '../task/Task';
import {getLogger} from './Logger';
import {StringBuilder} from './StringBuilder';
import {getEnv} from './SystemUtils';

const Logger = getLogger('TaskUtils');
const NOBREAKSPACE = '‎ ';

export async function runTasks(
  tasks: ITask[],
  taskContext: ListrContext = {},
): Promise<void> {
  const validTasks = tasks.filter(task => task.isValid());

  const taskList = new Listr(
    validTasks.map(validTask => {
      return {
        title: validTask.getDescription(),
        skip(_ctx: ListrContext): boolean | string | Promise<boolean> {
          if (isCommandInstallerTask(validTask)) {
            const command = validTask.getCommand();
            if (command !== null && command.isInstalled()) {
              return `${validTask.getDescription()} (${command.getVersion()})`;
            }
          }

          if (isInstallerTask(validTask)) {
            const isInstalled = validTask.isInstalled();
            if (isInstalled) {
              return `${validTask.getDescription()} is installed`;
            }
          }

          return false;
        },
        options: validTask.taskRendererOptions,
        task(
          ctx: ListrContext,
          task: ListrTaskWrapper<ListrContext, ListrRendererFactory>,
        ): Observable<string> {
          task.output = `Installing ${validTask.getDescription()}`;
          return new Observable<string>(subscriber => {
            (async () => {
              try {
                await validTask.run({
                  async update(message: string) {
                    Logger.info(message);
                    subscriber.next(message);
                  },
                  ctx,
                  task,
                });

                if (isCommandInstallerTask(validTask)) {
                  const command = validTask.getCommand();
                  if (command) {
                    task.title = `${validTask.getDescription()} (${command.getVersion()})`;
                  }
                }

                subscriber.complete();
              } catch (error) {
                Logger.error(
                  `Failed to execute installer ${validTask.getDescription()}\n\n${validTask.mitigateOnError()}`,
                  error,
                );
                subscriber.error(`${error}\n\n${validTask.mitigateOnError()}`);
              }
            })();
          });
        },
      };
    }),
  );

  try {
    await taskList.run(taskContext);
  } catch (error) {
    const message = `
🚨 💥 🚨 💥 🚨

${error}
    `;
    console.error(message);
    Logger.error(message, error);
  }
}

export async function executeCommandForTask(
  context: TaskContext,
  cmd: string,
  args?: readonly string[],
  options?: SpawnOptionsWithoutStdio,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const errorString = new StringBuilder();

    const mergedOptions: SpawnOptionsWithoutStdio = Object.assign(
      {env: getEnv()},
      options,
    );
    const process = spawn(cmd, args, mergedOptions);

    process.stdout.on('data', data => {
      const message = String(data).trimEnd().replace(/ /g, NOBREAKSPACE);
      Logger.info(message);
      context.update(message);
    });

    process.stdout.on('error', error => {
      Logger.error('execute command for task failed', error);
      errorString.append(`${error.message}`);
    });

    process.stderr.on('data', data => {
      Logger.info(data);
      errorString.append(`${data}`);
    });

    process.stderr.on('error', error => {
      Logger.error('execute command for task failed', error);
      errorString.append(`${error.message}`);
    });

    process.on('error', error => {
      Logger.error('execute command for task failed', error);
      errorString.append(`${error.message}`);
    });

    process.on('exit', code => {
      if (code !== 0) {
        reject(errorString.toString());
        return;
      }
      resolve();
    });
  });
}
