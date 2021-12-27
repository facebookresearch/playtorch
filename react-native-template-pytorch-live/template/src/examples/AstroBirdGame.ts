/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {
  CanvasRenderingContext2D,
  Image,
  ImageUtil,
} from 'react-native-pytorch-core';
import GameLoop from '../utils/GameLoop';

type Pipe = {
  x: number;
  height: number;
  passed: boolean;
};

export default class AstroBirdGame extends GameLoop {
  canvasWidth: number;
  canvasHeight: number;

  onGameEndedCallback: (() => void) | null = null;

  birdImage: Image | null = null;
  birdX: number = 0.33;
  birdImageWidthPct: number = 0.125;
  birdImageHeightPct: number = 0.2;
  birdImageScale: number = 0;
  birdFlapInterval: number = 125;
  deadImage: Image | null = null;

  instructionsImage: Image | null = null;
  landImage: Image | null = null;
  backgroundImage: Image | null = null;

  pipeImage: Image | null = null;
  pipeUpImage: Image | null = null;
  pipeDownImage: Image | null = null;
  pipeInterval: number = 0.5;
  minPipeHeight: number = 0.1;
  maxPipeHeightDiff: number = 0.25;
  pipeWidth: number = 0.175;
  pipeHeightGap: number = 0.285;
  pipeImageHeightPx: number = 0;
  pipeDownImageHeightPx: number = 0;

  birdFrame: number = 0;

  birdStartHeight: number = 0.5;

  gameStarted: boolean = false;
  acceleration: number = -2.75;
  isDead: boolean = false;
  isDying: boolean = false;
  score: number = 0;
  touchVelocity: number = 0.75;
  birdHeight: number = 0;
  birdVelocity: number = 0;
  pipes: Pipe[] = [];

  horizSpeed: number = 0.4;
  groundHeightPct: number = 0.2;
  landX: number = 0;
  landXBuffer: number = 1;
  landImageHeightPx: number = 0;
  backgroundShift: number = 0;

  constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
    super(ctx);
    this.canvasWidth = width;
    this.canvasHeight = height;
    this.loadImages();
  }

  async loadImages(): Promise<void> {
    await Promise.all([
      this._loadBirdImage(),
      this._loadLandImage(),
      this._loadBackgroundImage(),
      this._loadInstructionsImage(),
      this._loadPipeImage(),
      this._loadPipeUpImage(),
      this._loadPipeDownImage(),
    ]);
  }

  start(): void {
    this.gameStarted = false;
    this.isDead = false;
    this.isDying = false;
    this.score = 0;

    this.birdHeight = this.birdStartHeight;
    this.birdVelocity = this.touchVelocity;

    this.pipes = [];

    super.start();
  }

  loop(
    ctx: CanvasRenderingContext2D,
    _time: number,
    deltaTime: number,
    totalTime: number,
  ): boolean | void {
    if (!this.gameStarted) {
      this.drawInstructions(ctx);
      return;
    }
    if (!this.isDying) {
      this._updatePipes(deltaTime / 1000);
      this._updateBackground(deltaTime / 1000);
    }
    this._updateBird(deltaTime / 1000);

    this.drawBackground(ctx);
    this.drawPipes(ctx);
    this.drawBird(ctx, totalTime);
    this.drawLand(ctx);
    this.drawScore(ctx);

    if (this.isDead) {
      this.stop();
    }
  }

  drawInstructions(ctx: CanvasRenderingContext2D): void {
    this.drawBackground(ctx);
    this.drawLand(ctx);
    if (this.instructionsImage != null) {
      const width = this.instructionsImage.getWidth();
      const height = this.instructionsImage.getHeight();
      ctx.drawImage(
        this.instructionsImage,
        (this.canvasWidth - width) / 2,
        this.canvasHeight * (1 - this.birdHeight - this.birdImageHeightPct) -
          height / 2,
      );
    }
  }

  drawLand(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = '#1e045d';
    const groundHeight = this.groundHeightPct * this.canvasHeight;
    ctx.fillRect(
      0,
      this.canvasHeight - groundHeight,
      this.canvasWidth,
      groundHeight,
    );
    if (this.landImage != null) {
      ctx.drawImage(
        this.landImage,
        -this.canvasWidth * this.landX,
        this.canvasHeight * (1 - this.groundHeightPct),
      );
    }
  }

  drawBackground(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = '#1e045d';
    ctx.fillRect(0, 0, 432, 560);
    ctx.fillStyle = '#1e045d';
    ctx.fillRect(0, 560, 432, 768 - 644);

    if (this.backgroundImage != null) {
      const scaleWidth =
        (this.canvasHeight * (1 - this.groundHeightPct)) /
        this.backgroundImage.getHeight();
      this.backgroundShift = this.gameStarted
        ? this.backgroundShift - 0.5
        : this.backgroundShift;
      ctx.drawImage(
        this.backgroundImage,
        this.backgroundShift,
        0,
        this.backgroundImage.getWidth() * scaleWidth,
        this.canvasHeight * (1 - this.groundHeightPct),
      );
    }
  }

  drawBird(ctx: CanvasRenderingContext2D, totalTime: number): void {
    if (this.birdImage != null) {
      const x = this.canvasWidth * (this.birdX - this.birdImageWidthPct / 2);
      const y =
        this.canvasHeight * (1 - this.birdHeight - this.birdImageHeightPct / 2);

      const index = Math.round(totalTime / this.birdFlapInterval) % 4;
      ctx.save();
      let radians = 0;
      if (this.birdVelocity != null && totalTime > 0) {
        const angle = Math.min(
          Math.max((this.birdVelocity + 0.75) * -100, -20),
          90,
        );
        radians = (angle * Math.PI) / 180;
        ctx.translate(34 / 2, 24 / 2);
        ctx.rotate((angle * Math.PI) / 180);
        ctx.translate(-34 / 2, -24 / 2);
      }
      ctx.rotate(-radians);
      ctx.translate(x, y);
      ctx.rotate(radians);
      ctx.drawImage(
        this.birdImage,
        0,
        24 * index,
        32,
        24,
        0,
        0,
        32 * this.birdImageScale,
        24 * this.birdImageScale,
      );
      ctx.restore();
    }
  }

  drawPipes(ctx: CanvasRenderingContext2D): void {
    if (
      this.pipeImage != null &&
      this.pipeUpImage != null &&
      this.pipeDownImage != null
    ) {
      for (const p of this.pipes) {
        const x = this.canvasWidth * (p.x - this.pipeWidth / 2);
        const yUp = this.canvasHeight * (1 - p.height);
        const yDown = yUp - this.canvasHeight * this.pipeHeightGap;
        ctx.drawImage(this.pipeImage, x, yUp);
        ctx.drawImage(this.pipeImage, x, yDown - this.pipeImageHeightPx);
        ctx.drawImage(this.pipeUpImage, x, yUp);
        ctx.drawImage(
          this.pipeDownImage,
          x,
          yDown - this.pipeDownImageHeightPx,
        );
      }
    }
  }

  drawScore(ctx: CanvasRenderingContext2D): void {
    const x = 10;
    const y = 30;
    const offset = -1;
    ctx.font = '20px sans-serif';
    ctx.fillStyle = '#000000';
    ctx.fillText(`Score: ${this.score}`, x, y);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`Score: ${this.score}`, x + offset, y + offset);
  }

  onGameEnded(callback: () => void): void {
    this.onGameEndedCallback = callback;
  }

  async _loadBirdImage(): Promise<void> {
    const birdImage = await ImageUtil.fromBundle(
      require('../../assets/astrobird/bird.png'),
    );
    const width = birdImage.getWidth();
    const height = birdImage.getHeight();

    this.birdImageScale = Math.min(
      (this.canvasWidth * this.birdImageWidthPct) / width,
      (this.canvasHeight * this.birdImageHeightPct) / height,
    );
    this.birdImage = birdImage;

    var numSprites = 4;
    var spriteHeight = height / numSprites;
    this.birdImageHeightPct =
      (spriteHeight * this.birdImageScale) / this.canvasHeight;

    const newWidthPct = (width * this.birdImageScale) / this.canvasWidth;
    this.pipeWidth *= newWidthPct / this.birdImageWidthPct;
    this.birdImageWidthPct = newWidthPct;
  }

  async _loadLandImage(): Promise<void> {
    const landImage = await ImageUtil.fromBundle(
      require('../../assets/astrobird/land.png'),
    );
    this.landImage = await landImage.scale(
      (this.canvasWidth * (1 + this.landXBuffer)) / landImage.getWidth(),
      (this.canvasWidth * (1 + this.landXBuffer)) / landImage.getWidth(),
    );
    landImage.release();
    this.landImageHeightPx = this.landImage.getHeight();
  }

  async _loadBackgroundImage(): Promise<void> {
    const backgroundImage = await ImageUtil.fromBundle(
      require('../../assets/astrobird/background.png'),
    );
    this.backgroundImage = await backgroundImage.scale(
      this.canvasWidth / backgroundImage.getWidth(),
      this.canvasWidth / backgroundImage.getWidth(),
    );
    backgroundImage.release();
  }

  async _loadInstructionsImage(): Promise<void> {
    const instructionsImage = await ImageUtil.fromBundle(
      require('../../assets/astrobird/instructions.png'),
    );
    this.instructionsImage = await instructionsImage.scale(
      this.birdImageScale,
      this.birdImageScale,
    );
  }

  async _loadPipeImage(): Promise<void> {
    const pipeImage = await ImageUtil.fromBundle(
      require('../../assets/astrobird/pipe.png'),
    );
    this.pipeImage = await pipeImage.scale(
      (this.canvasWidth * this.pipeWidth) / pipeImage.getWidth(),
      (this.canvasWidth * this.pipeWidth) / pipeImage.getWidth(),
    );
    pipeImage.release();
    this.pipeImageHeightPx = this.pipeImage.getHeight();
  }

  async _loadPipeUpImage(): Promise<void> {
    const pipeUpImage = await ImageUtil.fromBundle(
      require('../../assets/astrobird/pipe_up.png'),
    );
    this.pipeUpImage = await pipeUpImage.scale(
      (this.canvasWidth * this.pipeWidth) / pipeUpImage.getWidth(),
      (this.canvasWidth * this.pipeWidth) / pipeUpImage.getWidth(),
    );
    pipeUpImage.release();
  }

  async _loadPipeDownImage(): Promise<void> {
    const pipeDownImage = await ImageUtil.fromBundle(
      require('../../assets/astrobird/pipe_down.png'),
    );
    this.pipeDownImage = await pipeDownImage.scale(
      (this.canvasWidth * this.pipeWidth) / pipeDownImage.getWidth(),
      (this.canvasWidth * this.pipeWidth) / pipeDownImage.getWidth(),
    );
    this.pipeDownImageHeightPx = this.pipeDownImage.getHeight();
  }

  _updateBackground(timeDelta: number): void {
    const dist = this.horizSpeed * timeDelta;
    this.landX += dist;
    if (this.landX > this.landXBuffer) {
      this.landX -= this.landXBuffer;
    }
  }

  _updatePipes(timeDelta: number): void {
    if (this.pipes.length > 0) {
      const dist = this.horizSpeed * timeDelta;
      for (let i = 0; i < this.pipes.length; i++) {
        this.pipes[i].x -= dist;
      }

      // Remove old pipes
      if (this.pipes[0].x < -this.pipeWidth) {
        this.pipes.shift();
      }
    }

    // Add new pipes
    if (
      this.pipes.length === 0 ||
      1 - this.pipes[this.pipes.length - 1].x >= this.pipeInterval / 2
    ) {
      let height =
        Math.random() *
          (1 -
            this.groundHeightPct -
            2 * this.minPipeHeight -
            this.pipeHeightGap) +
        this.groundHeightPct +
        this.minPipeHeight;

      // Random height
      if (this.pipes.length > 0) {
        const prevHeight = this.pipes[this.pipes.length - 1].height;

        // Make the height difference from the previous pipe reasonable
        if (Math.abs(height - prevHeight) > this.maxPipeHeightDiff) {
          if (height < prevHeight) {
            height = prevHeight - this.maxPipeHeightDiff;
          } else {
            height = prevHeight + this.maxPipeHeightDiff;
          }
        }
      }

      let x;
      if (this.pipes.length === 0) {
        x = 2;
      } else {
        let prevX = this.pipes[this.pipes.length - 1].x;
        x = prevX + this.pipeInterval;
      }
      this.pipes.push({x, height, passed: false});
    }
  }

  _updateBird(timeDelta: number): void {
    const initVelocity = this.birdVelocity;
    const accelerationTime = this.acceleration * timeDelta;

    // v_f = v_i + a * t
    this.birdVelocity += accelerationTime;

    // d = v_i * t + 0.5 * a * t^2
    this.birdHeight += (initVelocity + 0.5 * accelerationTime) * timeDelta;

    this._checkIfDead();
  }

  _checkIfDead(): void {
    // Check if hit the ground
    if (this.birdHeight - this.birdImageHeightPct / 2 <= this.groundHeightPct) {
      // birdHeight = groundHeight + birdImageHeightPct / 2;
      this.endGame();
      return;
    }

    // Check if hit a pipe

    // For the bird, inset a little bit since we are assuming that the bird is a rectangle,
    // but it is closer to an ellipse and too lazy to do the proper calculations.
    const width = this.birdImageWidthPct * 0.9;
    const height = this.birdImageHeightPct * 0.9;
    const x1 = this.birdX - width / 2;
    const x2 = x1 + width;
    const y1 = this.birdHeight - height / 2;
    const y2 = y1 + height;

    for (const p of this.pipes) {
      const px1 = p.x - this.pipeWidth / 2;
      const px2 = px1 + this.pipeWidth;

      const py1 = p.height;
      const py2 = py1 + this.pipeHeightGap;

      // Only safe if within the "x" of the pipe and in the gap.

      // In the pipe
      if (x1 <= px2 && px1 <= x2) {
        // Dead if not fully in the gap
        if (!(py1 < y1 && y2 < py2)) {
          this.isDying = true;
          return;
        }
      }
    }

    // Score
    for (const p of this.pipes) {
      if (!p.passed && p.x <= this.birdX) {
        p.passed = true;
        this.score++;
      }
    }
  }

  endGame(): void {
    this.isDead = true;
    if (this.onGameEndedCallback != null) {
      this.onGameEndedCallback();
    }
  }

  tap(): void {
    if (!this.gameStarted) {
      this.gameStarted = true;
    }
    if (!this.isDead && !this.isDying) {
      this.birdVelocity = this.touchVelocity;
    }
  }

  destroy() {
    this.birdImage?.release();
    this.landImage?.release();
    this.backgroundImage?.release();
    this.pipeImage?.release();
    this.pipeUpImage?.release();
    this.pipeDownImage?.release();
  }
}
