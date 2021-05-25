/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import * as React from 'react';
import {useCallback} from 'react';
import {NativeModules, requireNativeComponent, ViewProps} from 'react-native';
import type {Image} from './ImageModule';
import type {NativeJSRef} from './NativeJSRef';

const {
  PyTorchCoreCanvasRenderingContext2DModule: CanvasRenderingContext2DModule,
} = NativeModules;

export type CanvasRenderingContext2D = {
  lineWidth: number,
  fillStyle: string,
  strokeStyle: string,
  invalidate(): void,
  clear(): void,
  clearRect(x: number, y: number, width: number, height: number): void,
  strokeRect(x: number, y: number, width: number, height: number): void,
  fillRect(x: number, y: number, width: number, height: number): void,
  arc(
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number,
    anticlockwise?: boolean,
  ): void,
  drawCircle(x: number, y: number, radius: number): void,
  fillCircle(x: number, y: number, radius: number): void,
  drawImage(image: Image, dx: number, dy: number): void,
  drawImage(
    image: Image,
    dx: number,
    dy: number,
    dWidth: number,
    dHeight: number,
  ): void,
  drawImage(
    image: Image,
    sx: number,
    sy: number,
    sWidth: number,
    sHeight: number,
    dx: number,
    dy: number,
    dWidth: number,
    dHeight: number,
  ): void,
  fillText(text: string, x: number, y: number): void,
  setTransform(
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
    f: number,
  ): void,
  scale(x: number, y: number): void,
  rotate(angle: number): void,
  /**
   * The rotate angle,x,y API is not supported by the web canvas and we will
   * eventually depracate this API. It is, however, needed for Flappy Bird
   * until the whole web canvas api is implemented.
   *
   * @deprecated Will be deprecated eventually.
   */
  rotate(angle: number, x: number, y: number): void,
  translate(x: number, y: number): void,
  save(): void,
  restore(): void,
};

type CanvasProps = {
  onContext2D(ctx: CanvasRenderingContext2D): void,
} & ViewProps;

// We use this invalid value as a workaround to simulate a nullable value. This allows
// us to implement overloading methods in native (e.g., see drawImage).
const INVALID_VALUE_NULLABLE = -1;

const wrapRef = (ref: NativeJSRef): CanvasRenderingContext2D => {
  return {
    set lineWidth(width: number) {
      CanvasRenderingContext2DModule.setLineWidth(ref, width);
    },
    set fillStyle(color: string) {
      CanvasRenderingContext2DModule.setFillStyle(ref, color);
    },
    set strokeStyle(color: string) {
      CanvasRenderingContext2DModule.setStrokeStyle(ref, color);
    },
    invalidate(): void {
      CanvasRenderingContext2DModule.invalidate(ref);
    },
    clear(): void {
      CanvasRenderingContext2DModule.clear(ref);
    },
    clearRect(x: number, y: number, width: number, height: number): void {
      CanvasRenderingContext2DModule.clearRect(ref, x, y, width, height);
    },
    strokeRect(x: number, y: number, width: number, height: number): void {
      CanvasRenderingContext2DModule.strokeRect(ref, x, y, width, height);
    },
    fillRect(x: number, y: number, width: number, height: number): void {
      CanvasRenderingContext2DModule.fillRect(ref, x, y, width, height);
    },
    arc(
      x: number,
      y: number,
      radius: number,
      startAngle: number,
      endAngle: number,
      anticlockwise: boolean = false,
    ): void {
      CanvasRenderingContext2DModule.arc(
        ref,
        x,
        y,
        radius,
        startAngle,
        endAngle,
        anticlockwise,
      );
    },
    drawCircle(x: number, y: number, radius: number): void {
      CanvasRenderingContext2DModule.drawCircle(ref, x, y, radius);
    },
    fillCircle(x: number, y: number, radius: number): void {
      CanvasRenderingContext2DModule.fillCircle(ref, x, y, radius);
    },
    drawImage(
      image: Image,
      dx_sx: number,
      dy_sy: number,
      dWidth_sWidth: number = INVALID_VALUE_NULLABLE,
      dHeight_sHeight: number = INVALID_VALUE_NULLABLE,
      dx: number = INVALID_VALUE_NULLABLE,
      dy: number = INVALID_VALUE_NULLABLE,
      dWidth: number = INVALID_VALUE_NULLABLE,
      dHeight: number = INVALID_VALUE_NULLABLE,
    ): void {
      CanvasRenderingContext2DModule.drawImage(
        ref,
        image,
        dx_sx,
        dy_sy,
        dWidth_sWidth,
        dHeight_sHeight,
        dx,
        dy,
        dWidth,
        dHeight,
      );
    },
    fillText(text: string, x: number, y: number): void {
      CanvasRenderingContext2DModule.fillText(ref, text, x, y);
    },
    setTransform(
      a: number,
      b: number,
      c: number,
      d: number,
      e: number,
      f: number,
    ) {
      CanvasRenderingContext2DModule.setTransform(ref, a, b, c, d, e, f);
    },
    scale(x: number, y: number): void {
      CanvasRenderingContext2DModule.scale(ref, x, y);
    },
    rotate(
      angle: number,
      x: number = INVALID_VALUE_NULLABLE,
      y: number = INVALID_VALUE_NULLABLE,
    ): void {
      CanvasRenderingContext2DModule.rotate(ref, angle, x, y);
    },
    translate(x: number, y: number): void {
      CanvasRenderingContext2DModule.translate(ref, x, y);
    },
    async save(): Promise<void> {
      await CanvasRenderingContext2DModule.save(ref);
    },
    async restore(): Promise<void> {
      await CanvasRenderingContext2DModule.restore(ref);
    },
  };
};

const PyTorchCoreCanvasView = requireNativeComponent<CanvasProps>(
  'PyTorchCoreCanvasView',
);

export function Canvas({onContext2D, ...otherProps}: CanvasProps) {
  const handleContext2D = useCallback(
    (event: any) => {
      const {nativeEvent} = event;
      const {ID} = nativeEvent;
      const ref: NativeJSRef = {ID};
      const ctx = wrapRef(ref);
      onContext2D(ctx);
    },
    [onContext2D],
  );
  return <PyTorchCoreCanvasView {...otherProps} onContext2D={handleContext2D} />;
}
