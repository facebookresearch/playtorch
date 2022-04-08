---
id: "canvasview"
title: "Module: CanvasView"
sidebar_label: "CanvasView"
sidebar_position: 0
custom_edit_url: null
---

## Interfaces

- [CanvasProps](../interfaces/canvasview.canvasprops.md)
- [CanvasRenderingContext2D](../interfaces/canvasview.canvasrenderingcontext2d.md)
- [ImageData](../interfaces/canvasview.imagedata.md)

## Functions

### Canvas

▸ **Canvas**(`props`): `Element`

A canvas component providing drawing functions similar to `2dcontext`.

```typescript
export default function App() {
  const [drawingContext, setDrawingContext] = useState<
    CanvasRenderingContext2D
  >();

  const handleContext2D = useCallback(
    async (ctx: CanvasRenderingContext2D) => {
      setDrawingContext(ctx);
    },
    [setDrawingContext],
  );

  useLayoutEffect(() => {
    const ctx = drawingContext;
    if (ctx != null) {
      ctx.clear();

      ctx.fillStyle = '#fb0fff';
      ctx.fillRect(40, 160, 64, 72);
      ctx.strokeStyle = '#00ffff';
      ctx.lineWidth = 6;
      ctx.strokeRect(40, 160, 64, 72);

      ctx.invalidate();
    }
  }, [drawingContext]);

  return (
    <Canvas style={StyleSheet.absoluteFill} onContext2D={handleContext2D} />
  );
}
```

**`component`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | [CanvasProps](../interfaces/canvasview.canvasprops.md) |

#### Returns

`Element`

#### Defined in

[CanvasView.tsx:986](https://github.com/pytorch/live/blob/5332dc9/react-native-pytorch-core/src/CanvasView.tsx#L986)
