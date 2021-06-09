/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

export type AnimateFunction = (
  time: number,
  frames: number,
  frameTime: number,
) => void;

export class Animator {
  frameCount: number = 0;
  frameTime: number = 1000 / 60;
  startTime: number = 0;
  previousTime: number = 0;
  animateFn: AnimateFunction = () => false;
  isDone: boolean = false;
  private rafHandle: number = -1;

  animate() {
    if (this.isDone) return;

    const now = Date.now();
    const deltaTime = now - this.previousTime;

    if (deltaTime > this.frameTime) {
      this.animateFn(now - this.startTime, this.frameCount, deltaTime);

      this.previousTime = now;
      this.frameCount++;
    }

    this.rafHandle = requestAnimationFrame(this.animate.bind(this));
  }

  start(animateFn: AnimateFunction, frameRate: number = 60) {
    this.stop();
    this.isDone = false;
    this.frameCount = 0;
    const now = Date.now();
    this.previousTime = now;
    this.startTime = now;
    this.frameTime = 1000 / frameRate;
    this.animateFn = animateFn;
    this.rafHandle = requestAnimationFrame(this.animate.bind(this));
  }

  stop() {
    cancelAnimationFrame(this.rafHandle);
    this.isDone = true;
  }
}
