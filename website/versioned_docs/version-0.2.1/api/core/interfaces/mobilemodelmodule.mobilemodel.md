---
id: "mobilemodelmodule.mobilemodel"
title: "Interface: MobileModel"
sidebar_label: "MobileModel"
custom_edit_url: null
---

[MobileModelModule](../modules/mobilemodelmodule.md).MobileModel

## Methods

### download

▸ **download**(`modelPath`): `Promise`<string\>

Download a model to the local file system and return the local file path
as a model. If the model path is a file path already, it will return the
same path as a result.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `modelPath` | [ModelPath](../modules/models.md#modelpath) | The model path as require or uri (i.e., `require`). |

#### Returns

`Promise`<string\>

___

### execute

▸ **execute**<T\>(`modelPath`, `params`): `Promise`<[ModelResult](mobilemodelmodule.modelresult.md)<T\>\>

**`deprecated`** The function will be removed in 0.2.2, please consider using `Module.forward`.

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

___

### preload

▸ **preload**(`modelPath`): `Promise`<void\>

**`deprecated`** The function will be removed in 0.2.2, please consider using `torch.jit._loadForMobile`.

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

___

### unload

▸ **unload**(): `Promise`<void\>

**`deprecated`** The function will be removed in 0.2.2, please consider using `torch.jit._loadForMobile`.

Unload all model. If any model were loaded previously, they will be discarded.
This function allows to load a new version of a model without restarting the
app.

#### Returns

`Promise`<void\>
