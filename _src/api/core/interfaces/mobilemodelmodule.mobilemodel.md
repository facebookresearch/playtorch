---
id: "mobilemodelmodule.mobilemodel"
title: "Interface: MobileModel"
sidebar_label: "MobileModel"
custom_edit_url: null
---

[MobileModelModule](../modules/mobilemodelmodule.md).MobileModel

## Methods

### execute

▸ **execute**<T\>(`modelPath`, `params`): `Promise`<[ModelResult](mobilemodelmodule.modelresult.md)<T\>\>

Run inference on a model.

```typescript
const classificationModel = require('../models/mobilenet_v3_small.ptl');

// or

const classificationModel = require('https://example.com/models/mobilenet_v3_small.ptl');

const image: Image = await ImageUtils.fromURL('https://image.url');

const { result: {maxIdx} } = await MobileModel.execute(
  classificationModel,
  {
    image,
  }
);

const topClass = ImageClasses(scores);
```

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `modelPath` | [ModelPath](../modules/models.md#modelpath) | The model path as require or uri (i.e., `require`). |
| `params` | `any` | The input parameters for the model. |

#### Returns

`Promise`<[ModelResult](mobilemodelmodule.modelresult.md)<T\>\>

#### Defined in

[MobileModelModule.ts:149](https://github.com/pytorch/live/blob/33c6ac7/react-native-pytorch-core/src/MobileModelModule.ts#L149)

___

### preload

▸ **preload**(`modelPath`): `Promise`<void\>

Preload a model. If a model is not preloaded, it will be loaded during the
first inference call. However, the first inference time will therefore
take significantly longer. This function allows to preload a model ahead
of time before running the first inference.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `modelPath` | [ModelPath](../modules/models.md#modelpath) | The model path as require or uri (i.e., `require`). |

#### Returns

`Promise`<void\>

#### Defined in

[MobileModelModule.ts:115](https://github.com/pytorch/live/blob/33c6ac7/react-native-pytorch-core/src/MobileModelModule.ts#L115)

___

### unload

▸ **unload**(): `Promise`<void\>

Unload all model. If any model were loaded previously, they will be discarded.
This function allows to load a new version of a model without restarting the
app.

#### Returns

`Promise`<void\>

#### Defined in

[MobileModelModule.ts:122](https://github.com/pytorch/live/blob/33c6ac7/react-native-pytorch-core/src/MobileModelModule.ts#L122)
