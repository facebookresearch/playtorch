/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {
  ListrContext,
  ListrRendererFactory,
  ListrTaskWrapper,
  ListrGetRendererTaskOptions,
  ListrDefaultRenderer,
} from 'listr2';

export type TaskContext = {
  update(message: string): void;
  ctx: ListrContext;
  task: ListrTaskWrapper<ListrContext, ListrRendererFactory>;
};

export interface ITask {
  taskRendererOptions?: ListrGetRendererTaskOptions<ListrDefaultRenderer>;
  getDescription(): string;
  isValid(): boolean;
  mitigateOnError(): string;
  run(context: TaskContext): Promise<void>;
}
