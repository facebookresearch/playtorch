---
id: "cameraview.camera"
title: "Class: Camera"
sidebar_label: "Camera"
custom_edit_url: null
---

[CameraView](../modules/cameraview.md).Camera

A camera component with [CameraProps.onCapture](../interfaces/cameraview.cameraprops.md#oncapture) and [CameraProps.onFrame](../interfaces/cameraview.cameraprops.md#onframe) callbacks.
To programmatically trigger a capture, call the [takePicture](cameraview.camera.md#takepicture) function.

```typescript
export default function App() {
  const {imageClass, processImage} = useImageClassification(
    require('./resnet18.ptl'),
  );

  const handleFrame = useCallback(
    async (image: Image) => {
      await processImage(image);
      image.release();
    },
    [processImage],
  );

  return (
    <>
      <Camera
        style={styles.camera}
        onFrame={handleFrame}
        hideCaptureButton={true}
      />
      <Text>{imageClass}</Text>
    </>
  );
}
```

**`component`**

## Hierarchy

- `PureComponent`<[CameraProps](../interfaces/cameraview.cameraprops.md)\>

  ↳ **Camera**

## Methods

### takePicture

▸ **takePicture**(): `void`

The [takePicture](cameraview.camera.md#takepicture) function captures an image from the camera and then
trigger the [onCapture](../interfaces/cameraview.cameraprops.md#oncapture) callback registered on the [Camera](cameraview.camera.md)
component.

```typescript
export default function CameraTakePicture() {
  const cameraRef = React.useRef<Camera>(null);

  async function handleCapture(image: Image) {
    // Use captured image before releasing it.
    image.release();
  }

  function handleTakePicture() {
    const camera = cameraRef.current;
    if (camera != null) {
      camera.takePicture();
    }
  }

  return (
    <>
      <Camera
        ref={cameraRef}
        onCapture={handleCapture}
        hideCaptureButton={true}
        style={StyleSheet.absoluteFill}
        targetResolution={{width: 480, height: 640}}
        facing={CameraFacing.BACK}
      />
      <Button title="Take Picture" onPress={handleTakePicture} />
    </>
  );
}
```

#### Returns

`void`

#### Defined in

[CameraView.tsx:192](https://github.com/pytorch/live/blob/7cc166b/react-native-pytorch-core/src/CameraView.tsx#L192)
