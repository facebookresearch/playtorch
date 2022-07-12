---
id: "canvasview.canvasrenderingcontext2d"
title: "Interface: CanvasRenderingContext2D"
sidebar_label: "CanvasRenderingContext2D"
custom_edit_url: null
---

[CanvasView](../modules/canvasview.md).CanvasRenderingContext2D

The Canvas 2D API provided by the React Native PyTorch Core canvas
**is going to** match the W3C specification of the
[`2dcontext`](https://www.w3.org/TR/2dcontext/)
(and MDN [`CanvasRenderingContext2D`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/)).

The motivation behind this is to have a canvas API for mobile that matches
the standardized Web canvas API, which ultimately will allow us to write
demos once and run them on mobile and web.

:::info

The canvas API currently only implements a subset of the `2dcontext` API and
we will gradually add more functionality as needed.

:::

:::info

The documenation for the canvas is adapted from the MDN
[`CanvasRenderingContext2D`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/).

:::

## Properties

### fillStyle

• **fillStyle**: `string`

The `fillStyle` property of the Canvas 2D API specifies the color inside
shapes. The default style is `#000` (black).

**Options**

`color` A [`CSS <color>`](https://reactnative.dev/docs/colors#color-apis) value as string.

#### Defined in

[CanvasView.tsx:91](https://github.com/pytorch/live/blob/fe61f5b/react-native-pytorch-core/src/CanvasView.tsx#L91)

___

### font

• **font**: `string`

The `font` property of the Canvas 2D API specifies the current text style
to use when drawing text. This string uses the same syntax as the CSS font
specifier.

**Options**

`value` A string parsed as CSS font value. The default font is 10px sans-serif.

#### Defined in

[CanvasView.tsx:102](https://github.com/pytorch/live/blob/fe61f5b/react-native-pytorch-core/src/CanvasView.tsx#L102)

___

### lineCap

• **lineCap**: `LineCap`

The `lineCap` property of the Canvas 2D API determines the shape used to
draw the end points of lines.

:::note

Lines can be drawn with the [stroke](canvasview.canvasrenderingcontext2d.md#stroke), [strokeRect](canvasview.canvasrenderingcontext2d.md#strokerect), and [strokeText](canvasview.canvasrenderingcontext2d.md#stroketext) functions.

:::

**Options**

* `"butt"` The ends of lines are squared off at the endpoints. Default value.
* `"round"` The ends of lines are rounded.
* `"square"` The ends of lines are squared off by adding a box with an equal width and half the height of the line's thickness.

#### Defined in

[CanvasView.tsx:120](https://github.com/pytorch/live/blob/fe61f5b/react-native-pytorch-core/src/CanvasView.tsx#L120)

___

### lineJoin

• **lineJoin**: `LineJoin`

The `lineJoin` property of the Canvas 2D API determines the shape used to
join two line segments where they meet.

This property has no effect wherever two connected segments have the same
direction, because no joining area will be added in this case. Degenerate
segments with a length of zero (i.e., with all endpoints and control
points at the exact same position) are also ignored.

:::note

Lines can be drawn with the [stroke](canvasview.canvasrenderingcontext2d.md#stroke), [strokeRect](canvasview.canvasrenderingcontext2d.md#strokerect), and [strokeText](canvasview.canvasrenderingcontext2d.md#stroketext)
functions.

:::

**Options**

There are three possible values for this property: `"round"`, `"bevel"`,
and `"miter"`. The default is `"miter"`.

* `"round"` Rounds off the corners of a shape by filling an additional sector of disc centered at the common endpoint of connected segments. The radius for these rounded corners is equal to the line width.
* `"bevel"` Fills an additional triangular area between the common endpoint of connected segments, and the separate outside rectangular corners of each segment.
* `"miter"` Connected segments are joined by extending their outside edges to connect at a single point, with the effect of filling an additional lozenge-shaped area. This setting is affected by the [miterLimit](canvasview.canvasrenderingcontext2d.md#miterlimit) property. Default value.

#### Defined in

[CanvasView.tsx:147](https://github.com/pytorch/live/blob/fe61f5b/react-native-pytorch-core/src/CanvasView.tsx#L147)

___

### lineWidth

• **lineWidth**: `number`

The `lineWidth` property of the Canvas 2D API sets the thickness of lines.

**Options**

`value` A number specifying the line width, in coordinate space units. Zero, negative, `Infinity`, and `NaN` values are ignored. This value is `1.0` by default.

#### Defined in

[CanvasView.tsx:156](https://github.com/pytorch/live/blob/fe61f5b/react-native-pytorch-core/src/CanvasView.tsx#L156)

___

### miterLimit

• **miterLimit**: `number`

The `miterLimit` property of the Canvas 2D API sets the miter limit ratio.

`value` A number specifying the miter limit ratio, in coordinate space units. Zero, negative, [[Infinity]], and [[NaN]] values are ignored. The default value is `10.0`.

#### Defined in

[CanvasView.tsx:163](https://github.com/pytorch/live/blob/fe61f5b/react-native-pytorch-core/src/CanvasView.tsx#L163)

___

### strokeStyle

• **strokeStyle**: `string`

The `strokeStyle` property of the Canvas 2D API specifies the color to use
for the strokes (outlines) around shapes. The default is `#000` (black).

**Options**

`color` A [`CSS <color>`](https://reactnative.dev/docs/colors#color-apis) value as string.

#### Defined in

[CanvasView.tsx:173](https://github.com/pytorch/live/blob/fe61f5b/react-native-pytorch-core/src/CanvasView.tsx#L173)

___

### textAlign

• **textAlign**: `TextAlign`

The `textAlign` property of the Canvas 2D API specifies the current text
alignment used when drawing text.

The alignment is relative to the `x` value of the [fillText](canvasview.canvasrenderingcontext2d.md#filltext) method. For
example, if `textAlign` is `"center"`, then the text's left edge will be at
`x - (textWidth / 2)`.

**Options**

* `"left"` The text is left-aligned.
* `"right"` The text is right-aligned.
* `"center"` The text is centered.

#### Defined in

[CanvasView.tsx:189](https://github.com/pytorch/live/blob/fe61f5b/react-native-pytorch-core/src/CanvasView.tsx#L189)

## Methods

### arc

▸ **arc**(`x`, `y`, `radius`, `startAngle`, `endAngle`, `anticlockwise?`): `void`

The `arc()` function of the Canvas 2D API adds a circular arc to the
current sub-path.

```typescript
ctx.beginPath();
ctx.arc(100, 75, 50, 0, 2 * Math.PI);
ctx.stroke();
```

The `arc()` function creates a circular arc centered at `(x, y)` with a
radius of `radius`. The path starts at `startAngle`, ends at `endAngle`,
travels in the direction given by `counterclockwise` (defaulting to
clockwise).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `x` | `number` | The horizontal coordinate of the arc's center. |
| `y` | `number` | The vertical coordinate of the arc's center. |
| `radius` | `number` | The arc's radius. Must be positive. |
| `startAngle` | `number` | The angle at which the arc starts in radians, measured from the positive x-axis. |
| `endAngle` | `number` | The angle at which the arc ends in radians, measured from the positive x-axis. |
| `anticlockwise?` | `boolean` | An optional Boolean. If `true`, draws the arc counter-clockwise between the start and end angles. The default is `false` (clockwise). |

#### Returns

`void`

#### Defined in

[CanvasView.tsx:213](https://github.com/pytorch/live/blob/fe61f5b/react-native-pytorch-core/src/CanvasView.tsx#L213)

___

### beginPath

▸ **beginPath**(): `void`

The `beginPath()` function of the Canvas 2D API starts a new path by
emptying the list of sub-paths. Call this function when you want to create
a new path.

#### Returns

`void`

#### Defined in

[CanvasView.tsx:227](https://github.com/pytorch/live/blob/fe61f5b/react-native-pytorch-core/src/CanvasView.tsx#L227)

___

### clear

▸ **clear**(): `void`

Clears the entire canvas to be transparent.

**`deprecated`** This function will be removed in the beta release.

#### Returns

`void`

#### Defined in

[CanvasView.tsx:234](https://github.com/pytorch/live/blob/fe61f5b/react-native-pytorch-core/src/CanvasView.tsx#L234)

___

### clearRect

▸ **clearRect**(`x`, `y`, `width`, `height`): `void`

The `clearRect()` function of the Canvas 2D API erases the pixels in a
rectangular area by setting them to transparent black.

The `clearRect()` function sets the pixels in a rectangular area to
transparent black (`rgba(0,0,0,0)`). The rectangle's corner is at
`(x, y)`, and its size is specified by `width` and `height`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `x` | `number` | The x-axis coordinate of the rectangle's starting point. |
| `y` | `number` | The y-axis coordinate of the rectangle's starting point. |
| `width` | `number` | The rectangle's width. Positive values are to the right, and negative to the left. |
| `height` | `number` | The rectangle's height. Positive values are down, and negative are up. |

#### Returns

`void`

#### Defined in

[CanvasView.tsx:249](https://github.com/pytorch/live/blob/fe61f5b/react-native-pytorch-core/src/CanvasView.tsx#L249)

___

### closePath

▸ **closePath**(): `void`

The `closePath()` function of the Canvas 2D API attempts to add a straight
line from the current point to the start of the current sub-path. If the
shape has already been closed or has only one point, this function does
nothing.

This function doesn't draw anything to the canvas directly. You can render
the path using the [stroke](canvasview.canvasrenderingcontext2d.md#stroke) or [fill](canvasview.canvasrenderingcontext2d.md#fill) functions.

#### Returns

`void`

#### Defined in

[CanvasView.tsx:260](https://github.com/pytorch/live/blob/fe61f5b/react-native-pytorch-core/src/CanvasView.tsx#L260)

___

### drawCircle

▸ **drawCircle**(`x`, `y`, `radius`): `void`

Draws a circle at `(x, y)` with the given `radius`.

**`deprecated`** This function will be removed in the beta release.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `x` | `number` | The x-axis coordinate of the circle's starting point. |
| `y` | `number` | The y-axis coordinate of the circle's starting point. |
| `radius` | `number` | The circle's radius. Must be positive. |

#### Returns

`void`

#### Defined in

[CanvasView.tsx:271](https://github.com/pytorch/live/blob/fe61f5b/react-native-pytorch-core/src/CanvasView.tsx#L271)

___

### drawImage

▸ **drawImage**(`image`, `dx`, `dy`): `void`

The `drawImage()` function of the Canvas 2D API provides different ways
to draw an image onto the canvas.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `image` | [Image](imagemodule.image.md) | An element to draw into the context. The specification permits an [Image](imagemodule.image.md) source. |
| `dx` | `number` | The x-axis coordinate in the destination canvas at which to place the top-left corner of the source image. |
| `dy` | `number` | The y-axis coordinate in the destination canvas at which to place the top-left corner of the source image. |

#### Returns

`void`

#### Defined in

[CanvasView.tsx:281](https://github.com/pytorch/live/blob/fe61f5b/react-native-pytorch-core/src/CanvasView.tsx#L281)

▸ **drawImage**(`image`, `dx`, `dy`, `dWidth`, `dHeight`): `void`

The `drawImage()` function of the Canvas 2D API provides different ways
to draw an image onto the canvas.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `image` | [Image](imagemodule.image.md) | An element to draw into the context. The specification permits an [Image](imagemodule.image.md) source. |
| `dx` | `number` | The x-axis coordinate in the destination canvas at which to place the top-left corner of the source image. |
| `dy` | `number` | The y-axis coordinate in the destination canvas at which to place the top-left corner of the source image. |
| `dWidth` | `number` | The width to draw the image in the destination canvas. This allows scaling of the drawn image. If not specified, the image is not scaled in width when drawn. Note that this argument is not included in the 3-argument syntax. |
| `dHeight` | `number` | The height to draw the image in the destination canvas. This allows scaling of the drawn image. If not specified, the image is not scaled in height when drawn. Note that this argument is not included in the 3-argument syntax. |

#### Returns

`void`

#### Defined in

[CanvasView.tsx:293](https://github.com/pytorch/live/blob/fe61f5b/react-native-pytorch-core/src/CanvasView.tsx#L293)

▸ **drawImage**(`image`, `sx`, `sy`, `sWidth`, `sHeight`, `dx`, `dy`, `dWidth`, `dHeight`): `void`

The `drawImage()` function of the Canvas 2D API provides different ways to
draw an image onto the canvas.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `image` | [Image](imagemodule.image.md) | An element to draw into the context. The specification permits an [Image](imagemodule.image.md) source. |
| `sx` | `number` | The x-axis coordinate of the top left corner of the sub-rectangle of the source image to draw into the destination context. Note that this argument is not included in the 3- or 5-argument syntax. |
| `sy` | `number` | The y-axis coordinate of the top left corner of the sub-rectangle of the source image to draw into the destination context. Note that this argument is not included in the 3- or 5-argument syntax. |
| `sWidth` | `number` | The width of the sub-rectangle of the source image to draw into the destination context. If not specified, the entire rectangle from the coordinates specified by `sx` and `sy` to the bottom-right corner of the image is used. Note that this argument is not included in the 3- or 5-argument syntax. |
| `sHeight` | `number` | The height of the sub-rectangle of the source image to draw into the destination context. Note that this argument is not included in the 3- or 5-argument syntax. |
| `dx` | `number` | The x-axis coordinate in the destination canvas at which to place the top-left corner of the source image. |
| `dy` | `number` | The y-axis coordinate in the destination canvas at which to place the top-left corner of the source image. |
| `dWidth` | `number` | The width to draw the image in the destination canvas. This allows scaling of the drawn image. If not specified, the image is not scaled in width when drawn. Note that this argument is not included in the 3-argument syntax. |
| `dHeight` | `number` | The height to draw the image in the destination canvas. This allows scaling of the drawn image. If not specified, the image is not scaled in height when drawn. Note that this argument is not included in the 3-argument syntax. |

#### Returns

`void`

#### Defined in

[CanvasView.tsx:315](https://github.com/pytorch/live/blob/fe61f5b/react-native-pytorch-core/src/CanvasView.tsx#L315)

___

### fill

▸ **fill**(): `void`

The `fill()` function of the Canvas 2D API fills the current or given path
with the current fillStyle.

:::caution

The `fill()` function differs from the 2dcontext specification and is
subject to change. It currently does not take additional `fillRule`
or `path` and `fillRule` params.

```typescript
// Create path
let region = new Path2D();
region.moveTo(30, 90);
region.lineTo(110, 20);
region.lineTo(240, 130);
region.lineTo(60, 130);
region.lineTo(190, 20);
region.lineTo(270, 90);
region.closePath();

// Fill path
ctx.fillStyle = 'green';
ctx.fill(region, 'evenodd');
```

:::

#### Returns

`void`

#### Defined in

[CanvasView.tsx:355](https://github.com/pytorch/live/blob/fe61f5b/react-native-pytorch-core/src/CanvasView.tsx#L355)

___

### fillCircle

▸ **fillCircle**(`x`, `y`, `radius`): `void`

Fill a circle at `(x, y)` with the given `radius`.

**`deprecated`** This function will be removed in the beta release.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `x` | `number` | The x-axis coordinate of the circle's starting point. |
| `y` | `number` | The y-axis coordinate of the circle's starting point. |
| `radius` | `number` | The circle's radius. Must be positive. |

#### Returns

`void`

#### Defined in

[CanvasView.tsx:366](https://github.com/pytorch/live/blob/fe61f5b/react-native-pytorch-core/src/CanvasView.tsx#L366)

___

### fillRect

▸ **fillRect**(`x`, `y`, `width`, `height`): `void`

The `fillRect()` function of the Canvas 2D API draws a rectangle that is filled according to the current `fillStyle`.

The `fillRect()` function draws a filled rectangle whose starting point is at `(x, y)` and whose size is specified by `width` and `height`. The fill style is determined by the current `fillStyle` attribute.

```typescript
ctx.fillRect(10, 20, 30, 40);
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `x` | `number` | The x-axis coordinate of the rectangle's starting point. |
| `y` | `number` | The y-axis coordinate of the rectangle's starting point. |
| `width` | `number` | The rectangle's width. Positive values are to the right, and negative to the left. |
| `height` | `number` | The rectangle's height. Positive values are down, and negative are up. |

#### Returns

`void`

#### Defined in

[CanvasView.tsx:382](https://github.com/pytorch/live/blob/fe61f5b/react-native-pytorch-core/src/CanvasView.tsx#L382)

___

### fillText

▸ **fillText**(`text`, `x`, `y`): `void`

The `fillText()` function, part of the Canvas 2D API, draws a text string
at the specified coordinates, filling the string's characters with the
current [fillStyle](canvasview.canvasrenderingcontext2d.md#fillstyle).

```typescript
ctx.fillText('Hello world', 50, 90);
```

:::caution

The `strokeText()` function does not support `textAlign`, `textBaseline`,
and `direction`.

```typescript
ctx.font = '50px serif';
ctx.fillText('Hello world', 50, 90);
```

:::

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `text` | `string` | A string specifying the text string to render into the context. The text is rendered using the settings specified by `font`. |
| `x` | `number` | The x-axis coordinate of the point at which to begin drawing the text, in pixels. |
| `y` | `number` | The y-axis coordinate of the baseline on which to begin drawing the text, in pixels. |

#### Returns

`void`

#### Defined in

[CanvasView.tsx:409](https://github.com/pytorch/live/blob/fe61f5b/react-native-pytorch-core/src/CanvasView.tsx#L409)

___

### getImageData

▸ **getImageData**(`sx`, `sy`, `sw`, `sh`): `Promise`<[ImageData](canvasview.imagedata.md)\>

The `getImageData()` of the Canvas 2D API returns an [ImageData](canvasview.imagedata.md) object
representing the underlying pixel data for a specified portion of the
canvas.

:::caution

The `getImageData()` function differs from the 2dcontext specification and
is subject to change. The function is async and returns a [[Promise]] with
an [ImageData](canvasview.imagedata.md) rather than synchronously returning the [ImageData](canvasview.imagedata.md). It
currently does not support working with the [ImageData.data](canvasview.imagedata.md#data) of the
returned [ImageData](canvasview.imagedata.md) object.

The following is **not** yet implemented:

This function is not affected by the canvas's transformation matrix. If
the specified rectangle extends outside the bounds of the canvas, the
pixels outside the canvas are transparent black in the returned
[ImageData](canvasview.imagedata.md) object.

:::

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `sx` | `number` | The x-axis coordinate of the top-left corner of the rectangle from which the [ImageData](canvasview.imagedata.md) will be extracted. |
| `sy` | `number` | The y-axis coordinate of the top-left corner of the rectangle from which the [ImageData](canvasview.imagedata.md) will be extracted. |
| `sw` | `number` | The width of the rectangle from which the [ImageData](canvasview.imagedata.md) will be extracted. Positive values are to the right, and negative to the left. |
| `sh` | `number` | The height of the rectangle from which the [ImageData](canvasview.imagedata.md) will be extracted. Positive values are down, and negative are up. |

#### Returns

`Promise`<[ImageData](canvasview.imagedata.md)\>

#### Defined in

[CanvasView.tsx:438](https://github.com/pytorch/live/blob/fe61f5b/react-native-pytorch-core/src/CanvasView.tsx#L438)

___

### invalidate

▸ **invalidate**(): `Promise`<void\>

Invalidate the canvas resulting in a repaint.

#### Returns

`Promise`<void\>

#### Defined in

[CanvasView.tsx:448](https://github.com/pytorch/live/blob/fe61f5b/react-native-pytorch-core/src/CanvasView.tsx#L448)

___

### lineTo

▸ **lineTo**(`x`, `y`): `void`

The `lineTo()`, part of the Canvas 2D API, adds a straight line to the
current sub-path by connecting the sub-path's last point to the specified
`(x, y)` coordinates.

Like other functions that modify the current path, this function does not
directly render anything. To draw the path onto a canvas, you can use the
[fill](canvasview.canvasrenderingcontext2d.md#fill) or [stroke](canvasview.canvasrenderingcontext2d.md#stroke) functions.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `x` | `number` | The x-axis coordinate of the line's end point. |
| `y` | `number` | The y-axis coordinate of the line's end point. |

#### Returns

`void`

#### Defined in

[CanvasView.tsx:462](https://github.com/pytorch/live/blob/fe61f5b/react-native-pytorch-core/src/CanvasView.tsx#L462)

___

### moveTo

▸ **moveTo**(`x`, `y`): `void`

The `moveTo()` function of the Canvas 2D API begins a new sub-path at the
point specified by the given `(x, y)` coordinates.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `x` | `number` | The x-axis (horizontal) coordinate of the point. |
| `y` | `number` | The y-axis (vertical) coordinate of the point. |

#### Returns

`void`

#### Defined in

[CanvasView.tsx:471](https://github.com/pytorch/live/blob/fe61f5b/react-native-pytorch-core/src/CanvasView.tsx#L471)

___

### putImageData

▸ **putImageData**(`imageData`, `dx`, `dy`): `void`

The `putImageData()` function of the Canvas 2D API paints data from the
given [ImageData](canvasview.imagedata.md) object onto the canvas. If a dirty rectangle is
provided, only the pixels from that rectangle are painted. This function
is not affected by the canvas transformation matrix.

:::note

Image data can be retrieved from a canvas using the `getImageData()`
function.

:::

:::caution

The `putImageData()` does not implement `dirtyX`, `dirtyY`, `dirtyWidth`,
and `dirtyHeight` params.

:::

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `imageData` | [ImageData](canvasview.imagedata.md) | An [ImageData](canvasview.imagedata.md) object containing the array of pixel values. |
| `dx` | `number` | Horizontal position (x coordinate) at which to place the image data in the destination canvas. |
| `dy` | `number` | Vertical position (y coordinate) at which to place the image data in the destination canvas. |

#### Returns

`void`

#### Defined in

[CanvasView.tsx:497](https://github.com/pytorch/live/blob/fe61f5b/react-native-pytorch-core/src/CanvasView.tsx#L497)

___

### rect

▸ **rect**(`x`, `y`, `width`, `height`): `void`

The `rect()` method of the Canvas 2D API adds a rectangle to the current
path.

Like other methods that modify the current path, this method does not
directly render anything.  To draw the rectangle onto a canvas, you can
use the [fill](canvasview.canvasrenderingcontext2d.md#fill) or [stroke](canvasview.canvasrenderingcontext2d.md#stroke) methods.

:::note

To both create and render a rectangle in one step, use the [fillRect](canvasview.canvasrenderingcontext2d.md#fillrect) or
[strokeRect](canvasview.canvasrenderingcontext2d.md#strokerect) functions.

:::

The `rect()` method creates a rectangular path whose starting point is at
`(x, y)` and whose size is specified by `width` and `height`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `x` | `number` | The x-axis coordinate of the rectangle's starting point. |
| `y` | `number` | The y-axis coordinate of the rectangle's starting point. |
| `width` | `number` | The rectangle's width. Positive values are to the right, and negative to the left. |
| `height` | `number` | The rectangle's height. Positive values are down, and negative are up. |

#### Returns

`void`

#### Defined in

[CanvasView.tsx:522](https://github.com/pytorch/live/blob/fe61f5b/react-native-pytorch-core/src/CanvasView.tsx#L522)

___

### restore

▸ **restore**(): `void`

The `restore()` function of the Canvas 2D API restores the most recently
saved canvas state by popping the top entry in the drawing state stack. If
there is no saved state, this function does nothing.

For more information about the drawing state, see [CanvasRenderingContext2D.save](canvasview.canvasrenderingcontext2d.md#save).

#### Returns

`void`

#### Defined in

[CanvasView.tsx:531](https://github.com/pytorch/live/blob/fe61f5b/react-native-pytorch-core/src/CanvasView.tsx#L531)

___

### rotate

▸ **rotate**(`angle`): `void`

The `rotate()` function of the Canvas 2D API adds a rotation to the
transformation matrix.

The rotation center point is always the canvas origin. To change the
center point, you will need to move the canvas by using the
[translate](canvasview.canvasrenderingcontext2d.md#translate) function.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `angle` | `number` | The rotation angle, clockwise in radians. You can use _`degree`_` * Math.PI / 180` to calculate a radian from a degree. |

#### Returns

`void`

#### Defined in

[CanvasView.tsx:543](https://github.com/pytorch/live/blob/fe61f5b/react-native-pytorch-core/src/CanvasView.tsx#L543)

___

### save

▸ **save**(): `void`

The `save()` function of the Canvas 2D API saves the entire state of the
canvas by pushing the current state onto a stack.

**The drawing state**

The drawing state that gets saved onto a stack consists of:

* The current transformation matrix.
* The current values of the following attributes: [strokeStyle](canvasview.canvasrenderingcontext2d.md#strokestyle), [fillStyle](canvasview.canvasrenderingcontext2d.md#fillstyle).

#### Returns

`void`

#### Defined in

[CanvasView.tsx:556](https://github.com/pytorch/live/blob/fe61f5b/react-native-pytorch-core/src/CanvasView.tsx#L556)

___

### scale

▸ **scale**(`x`, `y`): `void`

The `scale()` function of the Canvas 2D API adds a scaling transformation
to the canvas units horizontally and/or vertically.

By default, one unit on the canvas is exactly one pixel. A scaling
transformation modifies this behavior. For instance, a scaling factor of
`0.5` results in a unit size of 0.5 pixels; shapes are thus drawn at half
the normal size. Similarly, a scaling factor of 2.0 increases the unit
size so that one unit becomes two pixels; shapes are thus drawn at twice
the normal size.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `x` | `number` | Scaling factor in the horizontal direction. A negative value flips pixels across the vertical axis. A value of `1` results in no horizontal scaling. |
| `y` | `number` | Scaling factor in the vertical direction. A negative value flips pixels across the horizontal axis. A value of `1` results in no vertical scaling. |

#### Returns

`void`

#### Defined in

[CanvasView.tsx:572](https://github.com/pytorch/live/blob/fe61f5b/react-native-pytorch-core/src/CanvasView.tsx#L572)

___

### setTransform

▸ **setTransform**(`a`, `b`, `c`, `d`, `e`, `f`): `void`

The `setTransform()` function of the Canvas 2D API resets (overrides) the
current transformation to the identity matrix, and then invokes a
transformation described by the arguments of this function. This lets you
scale, rotate, translate (move), and skew the context.

The transformation matrix is described by:

$$\left[ \begin{array}{ccc} a & c & e \\ b & d & f \\ 0 & 0 & 1 \end{array} \right]$$

`setTransform()` has two types of parameter that it can accept. The older type consists of several parameters representing the individual components of the transformation matrix to set:

The newer type consists of a single parameter, `matrix`, representing a 2D transformation matrix to set.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `a` | `number` | $$m_{11}$$ Horizontal scaling. A value of `1` results in no scaling. |
| `b` | `number` | $$m_{12}$$ Vertical skewing. |
| `c` | `number` | $$m_{21}$$ Horizontal skewing. |
| `d` | `number` | $$m_{22}$$ Vertical scaling. A value of `1` results in no scaling. |
| `e` | `number` | $$dx$$ Horizontal translation (moving). |
| `f` | `number` | $$dy$$ Vertical translation (moving). |

#### Returns

`void`

#### Defined in

[CanvasView.tsx:595](https://github.com/pytorch/live/blob/fe61f5b/react-native-pytorch-core/src/CanvasView.tsx#L595)

___

### stroke

▸ **stroke**(): `void`

The `stroke()` function of the Canvas 2D API strokes (outlines) the
current or given path with the current stroke style.

Strokes are aligned to the center of a path; in other words, half of the
stroke is drawn on the inner side, and half on the outer side.

The stroke is drawn using the non-zero winding rule, which means that path
intersections will still get filled.

:::caution

The `stroke()` function differs from the 2dcontext specification and is
subject to change. It currently does not take additional `path` param.

```typescript
void ctx.stroke(path);
```

:::

#### Returns

`void`

#### Defined in

[CanvasView.tsx:625](https://github.com/pytorch/live/blob/fe61f5b/react-native-pytorch-core/src/CanvasView.tsx#L625)

___

### strokeRect

▸ **strokeRect**(`x`, `y`, `width`, `height`): `void`

The `strokeRect()` function of the Canvas 2D API draws a rectangle that is
stroked (outlined) according to the current `strokeStyle` and other
context settings.

The `strokeRect()` function draws a stroked rectangle whose starting point is at `(x, y)` and whose size is specified by `width` and `height`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `x` | `number` | The x-axis coordinate of the rectangle's starting point. |
| `y` | `number` | The y-axis coordinate of the rectangle's starting point. |
| `width` | `number` | The rectangle's width. Positive values are to the right, and negative to the left. |
| `height` | `number` | The rectangle's height. Positive values are down, and negative are up. |

#### Returns

`void`

#### Defined in

[CanvasView.tsx:639](https://github.com/pytorch/live/blob/fe61f5b/react-native-pytorch-core/src/CanvasView.tsx#L639)

___

### strokeText

▸ **strokeText**(`text`, `x`, `y`): `void`

The `strokeText()`, part of the Canvas 2D API, strokes — that is, draws
the outlines of — the characters of a text string at the specified
coordinates. An optional parameter allows specifying a maximum width for
the rendered text, which the user agent will achieve by condensing the
text or by using a lower font size.

This function draws directly to the canvas without modifying the current
path, so any subsequent [fill](canvasview.canvasrenderingcontext2d.md#fill) or [stroke](canvasview.canvasrenderingcontext2d.md#stroke) calls will have no effect
on it.

:::caution

The `strokeText()` function does not support `textAlign`, `textBaseline`,
and `direction`.

```typescript
ctx.font = '50px serif';
ctx.strokeText('Hello world', 50, 90);
```

:::

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `text` | `string` | A string specifying the text string to render into the context. The text is rendered using the settings specified by `font`. |
| `x` | `number` | The x-axis coordinate of the point at which to begin drawing the text. |
| `y` | `number` | The y-axis coordinate of the point at which to begin drawing the text. |

#### Returns

`void`

#### Defined in

[CanvasView.tsx:668](https://github.com/pytorch/live/blob/fe61f5b/react-native-pytorch-core/src/CanvasView.tsx#L668)

___

### translate

▸ **translate**(`x`, `y`): `void`

The `translate()` function of the Canvas 2D API adds a translation
transformation to the current matrix.

The `translate()` function adds a translation transformation to the
current matrix by moving the canvas and its origin `x` units horizontally
and `y` units vertically on the grid.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `x` | `number` | Distance to move in the horizontal direction. Positive values are to the right, and negative to the left. |
| `y` | `number` | Distance to move in the vertical direction. Positive values are down, and negative are up. |

#### Returns

`void`

#### Defined in

[CanvasView.tsx:681](https://github.com/pytorch/live/blob/fe61f5b/react-native-pytorch-core/src/CanvasView.tsx#L681)
