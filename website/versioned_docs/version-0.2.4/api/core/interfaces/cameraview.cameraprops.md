---
id: "cameraview.cameraprops"
title: "Interface: CameraProps"
sidebar_label: "CameraProps"
custom_edit_url: null
---

[CameraView](../modules/cameraview.md).CameraProps

Properties for the camera.

```typescript
<Camera
  onFrame={(image: Image) => {
    image.release();
  }}
  hideCaptureButton={true}
/>
```

## Hierarchy

- `ViewProps`

  ↳ **CameraProps**

## Properties

### facing

• `Optional` **facing**: [CameraFacing](../enums/cameraview.camerafacing.md)

Direction the camera faces relative to the device's screen.

___

### hideCaptureButton

• `Optional` **hideCaptureButton**: `boolean`

Hides the capture button if set to `true`, otherwise the camera will show
a capture button.

___

### hideFlipButton

• `Optional` **hideFlipButton**: `boolean`

Hides the flip button if set to `true`, otherwise the camera will show
a flip button.

___

### targetResolution

• `Optional` **targetResolution**: `TargetResolution`

Camera target resolution. It is not guaranteed that the camera runs at the
set target resolution, and it might pick the closest available resolution.

{@see https://developer.android.com/reference/androidx/camera/core/ImageAnalysis.Builder#setTargetResolution(android.util.Size)}

## Methods

### onCapture

▸ `Optional` **onCapture**(`image`): `void`

Callback with an [Image](imagemodule.image.md) after capture button was pressed.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `image` | [Image](imagemodule.image.md) | An [Image](imagemodule.image.md) reference. |

#### Returns

`void`

___

### onFrame

▸ `Optional` **onFrame**(`image`): `void`

Callback when the camera delivers an [Image](imagemodule.image.md).

:::caution

Needs to call [Image.release](imagemodule.image.md#release) to receive the next frame. The camera
preview will continue to render updates, but new [Image](imagemodule.image.md) frames will be
omitted until [Image.release](imagemodule.image.md#release) is called.

:::

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `image` | [Image](imagemodule.image.md) | An [Image](imagemodule.image.md) reference. |

#### Returns

`void`
