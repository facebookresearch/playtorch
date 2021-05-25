/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {CanvasRenderingContext2D} from 'react-native-pytorch-core';

export default abstract class GameLoop {
  private totalTime: number = 0;
  private lastTime: number | null = null;
  private fpsTime: number = 1000 / 60;
  private isRunningAnimation: boolean = false;
  private rafHandle: number | null = null;
  private ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.animate = this.animate.bind(this);
  }

  public start(): void {
    this.totalTime = 0;
    this.lastTime = null;
    this.isRunningAnimation = true;
    this.rafHandle = requestAnimationFrame(this.animate);
  }

  public stop(): void {
    this.isRunningAnimation = false;
    if (this.rafHandle != null) {
      cancelAnimationFrame(this.rafHandle);
    }
  }

  private animate(time: number) {
    let deltaTime = 0;
    if (this.lastTime != null) {
      deltaTime = time - this.lastTime;
      if (deltaTime < this.fpsTime) {
        if (this.isRunningAnimation) {
          this.rafHandle = requestAnimationFrame(this.animate);
        }
        return;
      }
    }
    this.lastTime = time;

    if (deltaTime > 0) {
      this.totalTime += deltaTime;
      // Call animation function passed into the hook
      this.ctx.clear();
      this.loop(this.ctx, time, deltaTime, this.totalTime) !== false;
      this.ctx.invalidate();
    }

    if (this.isRunningAnimation) {
      this.rafHandle = requestAnimationFrame(this.animate.bind(this));
    }
  }

  public abstract loop(
    ctx: CanvasRenderingContext2D,
    time: number,
    deltaTime: number,
    totalTime: number,
  ): boolean | void;
}
