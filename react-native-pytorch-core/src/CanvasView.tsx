/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import * as React from 'react';
import {useCallback} from 'react';
import {
  NativeModules,
  processColor,
  requireNativeComponent,
  ViewProps,
} from 'react-native';
import type {Image} from './ImageModule';
import {NativeJSRef, toPlainNativeJSRef} from './NativeJSRef';
import * as CSSFontUtils from './utils/CSSFontUtils';

const {
  PyTorchCoreCanvasRenderingContext2DModule: CanvasRenderingContext2DModule,
  PyTorchCoreImageDataModule: ImageDataModule,
} = NativeModules;

export interface ImageData extends NativeJSRef {
  width: number;
  height: number;
  data: Uint8ClampedArray;
  release(): Promise<void>;
}

/**
 * * `"butt"` The ends of lines are squared off at the endpoints. Default value.
 * * `"round"` The ends of lines are rounded.
 * * `"square"` The ends of lines are squared off by adding a box with an equal width and half the height of the line's thickness.
 */
type LineCap = 'butt' | 'round' | 'square';

/**
 * There are three possible values for this property: `"round"`, `"bevel"`,
 * and `"miter"`. The default is `"miter"`.
 *
 * * `"round"` Rounds off the corners of a shape by filling an additional sector of disc centered at the common endpoint of connected segments. The radius for these rounded corners is equal to the line width.
 * * `"bevel"` Fills an additional triangular area between the common endpoint of connected segments, and the separate outside rectangular corners of each segment.
 * * `"miter"` Connected segments are joined by extending their outside edges to connect at a single point, with the effect of filling an additional lozenge-shaped area. This setting is affected by the [[miterLimit]] property. Default value.
 */
type LineJoin = 'bevel' | 'round' | 'miter';

/**
 * * `"left"` The text is left-aligned.
 * * `"right"` The text is right-aligned.
 * * `"center"` The text is centered.
 */
type TextAlign = 'left' | 'right' | 'center';

/**
 * The Canvas 2D API provided by the React Native PyTorch Core canvas
 * **is going to** match the W3C specification of the
 * [`2dcontext`](https://www.w3.org/TR/2dcontext/)
 * (and MDN [`CanvasRenderingContext2D`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/)).
 *
 * The motivation behind this is to have a canvas API for mobile that matches
 * the standardized Web canvas API, which ultimately will allow us to write
 * demos once and run them on mobile and web.
 *
 * :::info
 *
 * The canvas API currently only implements a subset of the `2dcontext` API and
 * we will gradually add more functionality as needed.
 *
 * :::
 *
 * :::info
 *
 * The documenation for the canvas is adapted from the MDN
 * [`CanvasRenderingContext2D`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/).
 *
 * :::
 */
export interface CanvasRenderingContext2D {
  /**
   * The `fillStyle` property of the Canvas 2D API specifies the color inside
   * shapes. The default style is `#000` (black).
   *
   * **Options**
   *
   * `color` A [`CSS <color>`](https://reactnative.dev/docs/colors#color-apis) value as string.
   */
  fillStyle: string;

  /**
   * The `font` property of the Canvas 2D API specifies the current text style
   * to use when drawing text. This string uses the same syntax as the CSS font
   * specifier.
   *
   * **Options**
   *
   * `value` A string parsed as CSS font value. The default font is 10px sans-serif.
   */
  font: string;

  /**
   * The `lineCap` property of the Canvas 2D API determines the shape used to
   * draw the end points of lines.
   *
   * :::note
   *
   * Lines can be drawn with the [[stroke]], [[strokeRect]], and [[strokeText]] functions.
   *
   * :::
   *
   * **Options**
   *
   * * `"butt"` The ends of lines are squared off at the endpoints. Default value.
   * * `"round"` The ends of lines are rounded.
   * * `"square"` The ends of lines are squared off by adding a box with an equal width and half the height of the line's thickness.
   */
  lineCap: LineCap;

  /**
   * The `lineJoin` property of the Canvas 2D API determines the shape used to
   * join two line segments where they meet.
   *
   * This property has no effect wherever two connected segments have the same
   * direction, because no joining area will be added in this case. Degenerate
   * segments with a length of zero (i.e., with all endpoints and control
   * points at the exact same position) are also ignored.
   *
   * :::note
   *
   * Lines can be drawn with the [[stroke]], [[strokeRect]], and [[strokeText]]
   * functions.
   *
   * :::
   *
   * **Options**
   *
   * There are three possible values for this property: `"round"`, `"bevel"`,
   * and `"miter"`. The default is `"miter"`.
   *
   * * `"round"` Rounds off the corners of a shape by filling an additional sector of disc centered at the common endpoint of connected segments. The radius for these rounded corners is equal to the line width.
   * * `"bevel"` Fills an additional triangular area between the common endpoint of connected segments, and the separate outside rectangular corners of each segment.
   * * `"miter"` Connected segments are joined by extending their outside edges to connect at a single point, with the effect of filling an additional lozenge-shaped area. This setting is affected by the [[miterLimit]] property. Default value.
   */
  lineJoin: LineJoin;

  /**
   * The `lineWidth` property of the Canvas 2D API sets the thickness of lines.
   *
   * **Options**
   *
   * `value` A number specifying the line width, in coordinate space units. Zero, negative, `Infinity`, and `NaN` values are ignored. This value is `1.0` by default.
   */
  lineWidth: number;

  /**
   * The `miterLimit` property of the Canvas 2D API sets the miter limit ratio.
   *
   * `value` A number specifying the miter limit ratio, in coordinate space units. Zero, negative, [[Infinity]], and [[NaN]] values are ignored. The default value is `10.0`.
   */
  miterLimit: number;

  /**
   * The `strokeStyle` property of the Canvas 2D API specifies the color to use
   * for the strokes (outlines) around shapes. The default is `#000` (black).
   *
   * **Options**
   *
   * `color` A [`CSS <color>`](https://reactnative.dev/docs/colors#color-apis) value as string.
   */
  strokeStyle: string;

  /**
   * The `textAlign` property of the Canvas 2D API specifies the current text
   * alignment used when drawing text.
   *
   * The alignment is relative to the `x` value of the [[fillText]] method. For
   * example, if `textAlign` is `"center"`, then the text's left edge will be at
   * `x - (textWidth / 2)`.
   *
   * **Options**
   *
   * * `"left"` The text is left-aligned.
   * * `"right"` The text is right-aligned.
   * * `"center"` The text is centered.
   */
  textAlign: TextAlign;

  /**
   * The `arc()` function of the Canvas 2D API adds a circular arc to the
   * current sub-path.
   *
   * ```typescript
   * ctx.beginPath();
   * ctx.arc(100, 75, 50, 0, 2 * Math.PI);
   * ctx.stroke();
   * ```
   *
   * The `arc()` function creates a circular arc centered at `(x, y)` with a
   * radius of `radius`. The path starts at `startAngle`, ends at `endAngle`,
   * travels in the direction given by `counterclockwise` (defaulting to
   * clockwise).
   *
   * @param x The horizontal coordinate of the arc's center.
   * @param y The vertical coordinate of the arc's center.
   * @param radius The arc's radius. Must be positive.
   * @param startAngle The angle at which the arc starts in radians, measured from the positive x-axis.
   * @param endAngle The angle at which the arc ends in radians, measured from the positive x-axis.
   * @param anticlockwise An optional Boolean. If `true`, draws the arc counter-clockwise between the start and end angles. The default is `false` (clockwise).
   */
  arc(
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number,
    anticlockwise?: boolean,
  ): void;

  /**
   * The `beginPath()` function of the Canvas 2D API starts a new path by
   * emptying the list of sub-paths. Call this function when you want to create
   * a new path.
   */
  beginPath(): void;

  /**
   * Clears the entire canvas to be transparent.
   *
   * @deprecated This function will be removed in the beta release.
   */
  clear(): void;

  /**
   * The `clearRect()` function of the Canvas 2D API erases the pixels in a
   * rectangular area by setting them to transparent black.
   *
   * The `clearRect()` function sets the pixels in a rectangular area to
   * transparent black (`rgba(0,0,0,0)`). The rectangle's corner is at
   * `(x, y)`, and its size is specified by `width` and `height`.
   *
   * @param x The x-axis coordinate of the rectangle's starting point.
   * @param y The y-axis coordinate of the rectangle's starting point.
   * @param width The rectangle's width. Positive values are to the right, and negative to the left.
   * @param height The rectangle's height. Positive values are down, and negative are up.
   */
  clearRect(x: number, y: number, width: number, height: number): void;

  /**
   * The `closePath()` function of the Canvas 2D API attempts to add a straight
   * line from the current point to the start of the current sub-path. If the
   * shape has already been closed or has only one point, this function does
   * nothing.
   *
   * This function doesn't draw anything to the canvas directly. You can render
   * the path using the [[stroke]] or [[fill]] functions.
   */
  closePath(): void;

  /**
   * Draws a circle at `(x, y)` with the given `radius`.
   *
   * @param x The x-axis coordinate of the circle's starting point.
   * @param y The y-axis coordinate of the circle's starting point.
   * @param radius The circle's radius. Must be positive.
   *
   * @deprecated This function will be removed in the beta release.
   */
  drawCircle(x: number, y: number, radius: number): void;

  /**
   * The `drawImage()` function of the Canvas 2D API provides different ways
   * to draw an image onto the canvas.
   *
   * @param image An element to draw into the context. The specification permits an [[Image]] source.
   * @param dx The x-axis coordinate in the destination canvas at which to place the top-left corner of the source image.
   * @param dy The y-axis coordinate in the destination canvas at which to place the top-left corner of the source image.
   */
  drawImage(image: Image, dx: number, dy: number): void;

  /**
   * The `drawImage()` function of the Canvas 2D API provides different ways
   * to draw an image onto the canvas.
   *
   * @param image An element to draw into the context. The specification permits an [[Image]] source.
   * @param dx The x-axis coordinate in the destination canvas at which to place the top-left corner of the source image.
   * @param dy The y-axis coordinate in the destination canvas at which to place the top-left corner of the source image.
   * @param dWidth The width to draw the image in the destination canvas. This allows scaling of the drawn image. If not specified, the image is not scaled in width when drawn. Note that this argument is not included in the 3-argument syntax.
   * @param dHeight The height to draw the image in the destination canvas. This allows scaling of the drawn image. If not specified, the image is not scaled in height when drawn. Note that this argument is not included in the 3-argument syntax.
   */
  drawImage(
    image: Image,
    dx: number,
    dy: number,
    dWidth: number,
    dHeight: number,
  ): void;

  /**
   * The `drawImage()` function of the Canvas 2D API provides different ways to
   * draw an image onto the canvas.
   *
   * @param image An element to draw into the context. The specification permits an [[Image]] source.
   * @param sx The x-axis coordinate of the top left corner of the sub-rectangle of the source image to draw into the destination context. Note that this argument is not included in the 3- or 5-argument syntax.
   * @param sy The y-axis coordinate of the top left corner of the sub-rectangle of the source image to draw into the destination context. Note that this argument is not included in the 3- or 5-argument syntax.
   * @param sWidth The width of the sub-rectangle of the source image to draw into the destination context. If not specified, the entire rectangle from the coordinates specified by `sx` and `sy` to the bottom-right corner of the image is used. Note that this argument is not included in the 3- or 5-argument syntax.
   * @param sHeight The height of the sub-rectangle of the source image to draw into the destination context. Note that this argument is not included in the 3- or 5-argument syntax.
   * @param dx The x-axis coordinate in the destination canvas at which to place the top-left corner of the source image.
   * @param dy The y-axis coordinate in the destination canvas at which to place the top-left corner of the source image.
   * @param dWidth The width to draw the image in the destination canvas. This allows scaling of the drawn image. If not specified, the image is not scaled in width when drawn. Note that this argument is not included in the 3-argument syntax.
   * @param dHeight The height to draw the image in the destination canvas. This allows scaling of the drawn image. If not specified, the image is not scaled in height when drawn. Note that this argument is not included in the 3-argument syntax.
   */
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
  ): void;

  /**
   * The `fill()` function of the Canvas 2D API fills the current or given path
   * with the current fillStyle.
   *
   * :::caution
   *
   * The `fill()` function differs from the 2dcontext specification and is
   * subject to change. It currently does not take additional `fillRule`
   * or `path` and `fillRule` params.
   *
   * ```typescript
   * // Create path
   * let region = new Path2D();
   * region.moveTo(30, 90);
   * region.lineTo(110, 20);
   * region.lineTo(240, 130);
   * region.lineTo(60, 130);
   * region.lineTo(190, 20);
   * region.lineTo(270, 90);
   * region.closePath();
   *
   * // Fill path
   * ctx.fillStyle = 'green';
   * ctx.fill(region, 'evenodd');
   * ```
   *
   * :::
   */
  fill(): void;

  /**
   * Fill a circle at `(x, y)` with the given `radius`.
   *
   * @param x The x-axis coordinate of the circle's starting point.
   * @param y The y-axis coordinate of the circle's starting point.
   * @param radius The circle's radius. Must be positive.
   *
   * @deprecated This function will be removed in the beta release.
   */
  fillCircle(x: number, y: number, radius: number): void;

  /**
   * The `fillRect()` function of the Canvas 2D API draws a rectangle that is filled according to the current `fillStyle`.
   *
   * The `fillRect()` function draws a filled rectangle whose starting point is at `(x, y)` and whose size is specified by `width` and `height`. The fill style is determined by the current `fillStyle` attribute.
   *
   * ```typescript
   * ctx.fillRect(10, 20, 30, 40);
   * ```
   *
   * @param x The x-axis coordinate of the rectangle's starting point.
   * @param y The y-axis coordinate of the rectangle's starting point.
   * @param width The rectangle's width. Positive values are to the right, and negative to the left.
   * @param height The rectangle's height. Positive values are down, and negative are up.
   */
  fillRect(x: number, y: number, width: number, height: number): void;

  /**
   * The `fillText()` function, part of the Canvas 2D API, draws a text string
   * at the specified coordinates, filling the string's characters with the
   * current [[fillStyle]].
   *
   * ```typescript
   * ctx.fillText('Hello world', 50, 90);
   * ```
   *
   * :::caution
   *
   * The `strokeText()` function does not support `textAlign`, `textBaseline`,
   * and `direction`.
   *
   * ```typescript
   * ctx.font = '50px serif';
   * ctx.fillText('Hello world', 50, 90);
   * ```
   *
   * :::
   *
   * @param text A string specifying the text string to render into the context. The text is rendered using the settings specified by `font`.
   * @param x The x-axis coordinate of the point at which to begin drawing the text, in pixels.
   * @param y The y-axis coordinate of the baseline on which to begin drawing the text, in pixels.
   */
  fillText(text: string, x: number, y: number): void;

  /**
   * The `getImageData()` of the Canvas 2D API returns an [[ImageData]] object
   * representing the underlying pixel data for a specified portion of the
   * canvas.
   *
   * :::caution
   *
   * The `getImageData()` function differs from the 2dcontext specification and
   * is subject to change. The function is async and returns a [[Promise]] with
   * an [[ImageData]] rather than synchronously returning the [[ImageData]]. It
   * currently does not support working with the [[ImageData.data]] of the
   * returned [[ImageData]] object.
   *
   * The following is **not** yet implemented:
   *
   * This function is not affected by the canvas's transformation matrix. If
   * the specified rectangle extends outside the bounds of the canvas, the
   * pixels outside the canvas are transparent black in the returned
   * [[ImageData]] object.
   *
   * :::
   *
   * @param sx The x-axis coordinate of the top-left corner of the rectangle from which the [[ImageData]] will be extracted.
   * @param sy The y-axis coordinate of the top-left corner of the rectangle from which the [[ImageData]] will be extracted.
   * @param sw The width of the rectangle from which the [[ImageData]] will be extracted. Positive values are to the right, and negative to the left.
   * @param sh The height of the rectangle from which the [[ImageData]] will be extracted. Positive values are down, and negative are up.
   */
  getImageData(
    sx: number,
    sy: number,
    sw: number,
    sh: number,
  ): Promise<ImageData>;

  /**
   * Invalidate the canvas resulting in a repaint.
   */
  invalidate(): Promise<void>;

  /**
   * The `lineTo()`, part of the Canvas 2D API, adds a straight line to the
   * current sub-path by connecting the sub-path's last point to the specified
   * `(x, y)` coordinates.
   *
   * Like other functions that modify the current path, this function does not
   * directly render anything. To draw the path onto a canvas, you can use the
   * [[fill]] or [[stroke]] functions.
   *
   * @param x The x-axis coordinate of the line's end point.
   * @param y The y-axis coordinate of the line's end point.
   */
  lineTo(x: number, y: number): void;

  /**
   * The `moveTo()` function of the Canvas 2D API begins a new sub-path at the
   * point specified by the given `(x, y)` coordinates.
   *
   * @param x The x-axis (horizontal) coordinate of the point.
   * @param y The y-axis (vertical) coordinate of the point.
   */
  moveTo(x: number, y: number): void;

  /**
   * The `putImageData()` function of the Canvas 2D API paints data from the
   * given [[ImageData]] object onto the canvas. If a dirty rectangle is
   * provided, only the pixels from that rectangle are painted. This function
   * is not affected by the canvas transformation matrix.
   *
   * :::note
   *
   * Image data can be retrieved from a canvas using the `getImageData()`
   * function.
   *
   * :::
   *
   * :::caution
   *
   * The `putImageData()` does not implement `dirtyX`, `dirtyY`, `dirtyWidth`,
   * and `dirtyHeight` params.
   *
   * :::
   *
   * @param imageData An [[ImageData]] object containing the array of pixel values.
   * @param dx Horizontal position (x coordinate) at which to place the image data in the destination canvas.
   * @param dy Vertical position (y coordinate) at which to place the image data in the destination canvas.
   */
  putImageData(imageData: ImageData, dx: number, dy: number): void;

  /**
   * The `rect()` method of the Canvas 2D API adds a rectangle to the current
   * path.
   *
   * Like other methods that modify the current path, this method does not
   * directly render anything.  To draw the rectangle onto a canvas, you can
   * use the [[fill]] or [[stroke]] methods.
   *
   * :::note
   *
   * To both create and render a rectangle in one step, use the [[fillRect]] or
   * [[strokeRect]] functions.
   *
   * :::
   *
   * The `rect()` method creates a rectangular path whose starting point is at
   * `(x, y)` and whose size is specified by `width` and `height`.
   *
   * @param x The x-axis coordinate of the rectangle's starting point.
   * @param y The y-axis coordinate of the rectangle's starting point.
   * @param width The rectangle's width. Positive values are to the right, and negative to the left.
   * @param height The rectangle's height. Positive values are down, and negative are up.
   */
  rect(x: number, y: number, width: number, height: number): void;

  /**
   * The `restore()` function of the Canvas 2D API restores the most recently
   * saved canvas state by popping the top entry in the drawing state stack. If
   * there is no saved state, this function does nothing.
   *
   * For more information about the drawing state, see [[CanvasRenderingContext2D.save]].
   */
  restore(): void;

  /**
   * The `rotate()` function of the Canvas 2D API adds a rotation to the
   * transformation matrix.
   *
   * The rotation center point is always the canvas origin. To change the
   * center point, you will need to move the canvas by using the
   * [[translate]] function.
   *
   * @param angle The rotation angle, clockwise in radians. You can use _`degree`_` * Math.PI / 180` to calculate a radian from a degree.
   */
  rotate(angle: number): void;

  /**
   * The `save()` function of the Canvas 2D API saves the entire state of the
   * canvas by pushing the current state onto a stack.
   *
   * **The drawing state**
   *
   * The drawing state that gets saved onto a stack consists of:
   *
   * * The current transformation matrix.
   * * The current values of the following attributes: [[strokeStyle]], [[fillStyle]].
   */
  save(): void;

  /**
   * The `scale()` function of the Canvas 2D API adds a scaling transformation
   * to the canvas units horizontally and/or vertically.
   *
   * By default, one unit on the canvas is exactly one pixel. A scaling
   * transformation modifies this behavior. For instance, a scaling factor of
   * `0.5` results in a unit size of 0.5 pixels; shapes are thus drawn at half
   * the normal size. Similarly, a scaling factor of 2.0 increases the unit
   * size so that one unit becomes two pixels; shapes are thus drawn at twice
   * the normal size.
   *
   * @param x Scaling factor in the horizontal direction. A negative value flips pixels across the vertical axis. A value of `1` results in no horizontal scaling.
   * @param y Scaling factor in the vertical direction. A negative value flips pixels across the horizontal axis. A value of `1` results in no vertical scaling.
   */
  scale(x: number, y: number): void;

  /**
   * The `setTransform()` function of the Canvas 2D API resets (overrides) the
   * current transformation to the identity matrix, and then invokes a
   * transformation described by the arguments of this function. This lets you
   * scale, rotate, translate (move), and skew the context.
   *
   * The transformation matrix is described by:
   *
   * $$\left[ \begin{array}{ccc} a & c & e \\ b & d & f \\ 0 & 0 & 1 \end{array} \right]$$
   *
   * `setTransform()` has two types of parameter that it can accept. The older type consists of several parameters representing the individual components of the transformation matrix to set:
   *
   * The newer type consists of a single parameter, `matrix`, representing a 2D transformation matrix to set.
   *
   * @param a $$m_{11}$$ Horizontal scaling. A value of `1` results in no scaling.
   * @param b $$m_{12}$$ Vertical skewing.
   * @param c $$m_{21}$$ Horizontal skewing.
   * @param d $$m_{22}$$ Vertical scaling. A value of `1` results in no scaling.
   * @param e $$dx$$ Horizontal translation (moving).
   * @param f $$dy$$ Vertical translation (moving).
   */
  setTransform(
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
    f: number,
  ): void;

  /**
   * The `stroke()` function of the Canvas 2D API strokes (outlines) the
   * current or given path with the current stroke style.
   *
   * Strokes are aligned to the center of a path; in other words, half of the
   * stroke is drawn on the inner side, and half on the outer side.
   *
   * The stroke is drawn using the non-zero winding rule, which means that path
   * intersections will still get filled.
   *
   * :::caution
   *
   * The `stroke()` function differs from the 2dcontext specification and is
   * subject to change. It currently does not take additional `path` param.
   *
   * ```typescript
   * void ctx.stroke(path);
   * ```
   *
   * :::
   */
  stroke(): void;

  /**
   * The `strokeRect()` function of the Canvas 2D API draws a rectangle that is
   * stroked (outlined) according to the current `strokeStyle` and other
   * context settings.
   *
   * The `strokeRect()` function draws a stroked rectangle whose starting point is at `(x, y)` and whose size is specified by `width` and `height`.
   *
   * @param x The x-axis coordinate of the rectangle's starting point.
   * @param y The y-axis coordinate of the rectangle's starting point.
   * @param width The rectangle's width. Positive values are to the right, and negative to the left.
   * @param height The rectangle's height. Positive values are down, and negative are up.
   */
  strokeRect(x: number, y: number, width: number, height: number): void;

  /**
   * The `strokeText()`, part of the Canvas 2D API, strokes — that is, draws
   * the outlines of — the characters of a text string at the specified
   * coordinates. An optional parameter allows specifying a maximum width for
   * the rendered text, which the user agent will achieve by condensing the
   * text or by using a lower font size.
   *
   * This function draws directly to the canvas without modifying the current
   * path, so any subsequent [[fill]] or [[stroke]] calls will have no effect
   * on it.
   *
   * :::caution
   *
   * The `strokeText()` function does not support `textAlign`, `textBaseline`,
   * and `direction`.
   *
   * ```typescript
   * ctx.font = '50px serif';
   * ctx.strokeText('Hello world', 50, 90);
   * ```
   *
   * :::
   *
   * @param text A string specifying the text string to render into the context. The text is rendered using the settings specified by `font`.
   * @param x The x-axis coordinate of the point at which to begin drawing the text.
   * @param y The y-axis coordinate of the point at which to begin drawing the text.
   */
  strokeText(text: string, x: number, y: number): void;

  /**
   * The `translate()` function of the Canvas 2D API adds a translation
   * transformation to the current matrix.
   *
   * The `translate()` function adds a translation transformation to the
   * current matrix by moving the canvas and its origin `x` units horizontally
   * and `y` units vertically on the grid.
   *
   * @param x Distance to move in the horizontal direction. Positive values are to the right, and negative to the left.
   * @param y Distance to move in the vertical direction. Positive values are down, and negative are up.
   */
  translate(x: number, y: number): void;
}

/**
 * Properties for the canvas.
 *
 * ```typescript
 * <Canvas style={styles.canvas} onContext2D={handleContext2D} />
 * ```
 */
export interface CanvasProps extends ViewProps {
  onContext2D(ctx: CanvasRenderingContext2D): void;
}

/**
 * @hidden
 *
 * We use this invalid value as a workaround to simulate a nullable value. This
 * allows us to implement overloading functions in native (e.g., see
 * [[CanvasRenderingContext2D.drawImage]]).
 */
const INVALID_VALUE_NULLABLE = -1;

const wrapRef = (ref: NativeJSRef): CanvasRenderingContext2D => {
  let lineCap: LineCap | null = null;
  let lineJoin: LineJoin | null = null;
  let lineWidth: number | null = null;
  let miterLimit: number | null = null;
  let textAlign: TextAlign | null = null;
  return {
    set font(value: string) {
      const font = CSSFontUtils.parse(value);
      if (font !== null) {
        CanvasRenderingContext2DModule.setFont(ref, font);
      }
    },
    set fillStyle(value: string) {
      const color = processColor(value);
      if (color == null) {
        throw new Error(`invalid color value ${value}`);
      }
      CanvasRenderingContext2DModule.setFillStyle(ref, color);
    },
    set lineCap(value: LineCap) {
      if (value !== lineCap) {
        lineCap = value;
        CanvasRenderingContext2DModule.setLineCap(ref, value);
      }
    },
    set lineJoin(value: LineJoin) {
      if (lineJoin !== value) {
        lineJoin = value;
        CanvasRenderingContext2DModule.setLineJoin(ref, value);
      }
    },
    set lineWidth(width: number) {
      if (lineWidth !== width) {
        lineWidth = width;
        CanvasRenderingContext2DModule.setLineWidth(ref, width);
      }
    },
    set miterLimit(value: number) {
      if (miterLimit !== value) {
        miterLimit = value;
        CanvasRenderingContext2DModule.setMiterLimit(ref, value);
      }
    },
    set strokeStyle(value: string) {
      const color = processColor(value);
      if (color == null) {
        throw new Error(`invalid color value ${value}`);
      }
      CanvasRenderingContext2DModule.setStrokeStyle(ref, color);
    },
    set textAlign(value: TextAlign) {
      if (textAlign !== value) {
        textAlign = value;
        CanvasRenderingContext2DModule.setTextAlign(ref, value);
      }
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
    beginPath(): void {
      CanvasRenderingContext2DModule.beginPath(ref);
    },
    clear(): void {
      CanvasRenderingContext2DModule.clear(ref);
    },
    clearRect(x: number, y: number, width: number, height: number): void {
      CanvasRenderingContext2DModule.clearRect(ref, x, y, width, height);
    },
    closePath(): void {
      CanvasRenderingContext2DModule.closePath(ref);
    },
    drawCircle(x: number, y: number, radius: number): void {
      CanvasRenderingContext2DModule.drawCircle(ref, x, y, radius);
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
      // TODO(T122223365) Temporary solution to make the drawImage function
      // work with either NativeJSRef images or true native images (see
      // IImage.h).
      //
      // Without this reassignment of just the image ID, the bridge will
      // eventually throw an error because it can't serialize the the native
      // image.
      //
      // {@link https://github.com/pytorch/live/blob/main/react-native-pytorch-core/cxx/src/torchlive/media/image/IImage.h#L15}
      const imageRef = toPlainNativeJSRef(image);
      CanvasRenderingContext2DModule.drawImage(
        ref,
        imageRef,
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
    fill(): void {
      CanvasRenderingContext2DModule.fill(ref);
    },
    fillCircle(x: number, y: number, radius: number): void {
      CanvasRenderingContext2DModule.fillCircle(ref, x, y, radius);
    },
    fillRect(x: number, y: number, width: number, height: number): void {
      CanvasRenderingContext2DModule.fillRect(ref, x, y, width, height);
    },
    fillText(text: string, x: number, y: number): void {
      CanvasRenderingContext2DModule.fillText(ref, text, x, y);
    },
    async getImageData(
      sx: number,
      sy: number,
      sw: number,
      sh: number,
    ): Promise<ImageData> {
      const imageDataRef = await CanvasRenderingContext2DModule.getImageData(
        ref,
        sx,
        sy,
        sw,
        sh,
      );
      return {
        ...imageDataRef,
        get width(): number {
          return sw;
        },
        get height(): number {
          return sh;
        },
        get data(): Uint8ClampedArray {
          // TODO(T92409860) Implement ImageData.data
          return new Uint8ClampedArray();
        },
        async release(): Promise<void> {
          return await ImageDataModule.release(imageDataRef);
        },
      };
    },
    async invalidate(): Promise<void> {
      return await CanvasRenderingContext2DModule.invalidate(ref);
    },
    lineTo(x: number, y: number): void {
      CanvasRenderingContext2DModule.lineTo(ref, x, y);
    },
    moveTo(x: number, y: number): void {
      CanvasRenderingContext2DModule.moveTo(ref, x, y);
    },
    putImageData(imageData: ImageData, dx: number, dy: number): void {
      CanvasRenderingContext2DModule.putImageData(ref, imageData, dx, dy);
    },
    rect(x: number, y: number, width: number, height: number): void {
      CanvasRenderingContext2DModule.rect(ref, x, y, width, height);
    },
    async restore(): Promise<void> {
      // The local values for the canvas context properties need to be reset on
      // `ctx.restore()`. If they aren't reset, the values for these properties
      // might be different native than in JavaScript and can cause issues
      // where the native functions aren't called and therefore leading to
      // different rendering outcomes on web canvas than in this native canvas
      // implementation.
      //
      // In the example below, the second red `strokeRect` should fully cover
      // the lime `strokeRect`. Without this reset, the `lineWidth` for the red
      // `strokeRect` will be  1px instead of `10px`.
      //
      // ```typescript
      // ctx.save();
      // ctx.lineWidth = 10;
      // ctx.strokeStyle = 'lime';
      // ctx.strokeRect(10, 10, 40, 40);
      // ctx.restore();
      //
      // ctx.save();
      // ctx.lineWidth = 10;
      // ctx.strokeStyle = 'red';
      // ctx.strokeRect(10, 10, 40, 40);
      // ctx.restore();
      // ctx.invalidate();
      // ```
      //
      lineCap = null;
      lineJoin = null;
      lineWidth = null;
      miterLimit = null;
      textAlign = null;
      await CanvasRenderingContext2DModule.restore(ref);
    },
    rotate(angle: number): void {
      CanvasRenderingContext2DModule.rotate(ref, angle);
    },
    async save(): Promise<void> {
      await CanvasRenderingContext2DModule.save(ref);
    },
    scale(x: number, y: number): void {
      CanvasRenderingContext2DModule.scale(ref, x, y);
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
    stroke(): void {
      CanvasRenderingContext2DModule.stroke(ref);
    },
    strokeRect(x: number, y: number, width: number, height: number): void {
      CanvasRenderingContext2DModule.strokeRect(ref, x, y, width, height);
    },
    strokeText(text: string, x: number, y: number): void {
      CanvasRenderingContext2DModule.strokeText(ref, text, x, y);
    },
    translate(x: number, y: number): void {
      CanvasRenderingContext2DModule.translate(ref, x, y);
    },
  };
};

const PyTorchCoreCanvasView = requireNativeComponent<CanvasProps>(
  'PyTorchCoreCanvasView',
);

/**
 * A canvas component providing drawing functions similar to `2dcontext`.
 *
 * ```typescript
 * export default function App() {
 *   const [drawingContext, setDrawingContext] = useState<
 *     CanvasRenderingContext2D
 *   >();
 *
 *   const handleContext2D = useCallback(
 *     async (ctx: CanvasRenderingContext2D) => {
 *       setDrawingContext(ctx);
 *     },
 *     [setDrawingContext],
 *   );
 *
 *   useLayoutEffect(() => {
 *     const ctx = drawingContext;
 *     if (ctx != null) {
 *       ctx.clear();
 *
 *       ctx.fillStyle = '#fb0fff';
 *       ctx.fillRect(40, 160, 64, 72);
 *       ctx.strokeStyle = '#00ffff';
 *       ctx.lineWidth = 6;
 *       ctx.strokeRect(40, 160, 64, 72);
 *
 *       ctx.invalidate();
 *     }
 *   }, [drawingContext]);
 *
 *   return (
 *     <Canvas style={StyleSheet.absoluteFill} onContext2D={handleContext2D} />
 *   );
 * }
 * ```
 *
 * @component
 */
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
  return (
    <PyTorchCoreCanvasView {...otherProps} onContext2D={handleContext2D} />
  );
}
