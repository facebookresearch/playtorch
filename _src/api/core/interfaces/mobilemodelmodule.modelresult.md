---
id: "mobilemodelmodule.modelresult"
title: "Interface: ModelResult<T>"
sidebar_label: "ModelResult"
custom_edit_url: null
---

[MobileModelModule](../modules/mobilemodelmodule.md).ModelResult

Result of model inference. Each model result has the inference time and the
model result. The model result depends on the model and is therefore
specified as a generic type (i.e., template).

## Type parameters

| Name | Description |
| :------ | :------ |
| `T` | Model result type |

## Properties

### metrics

• **metrics**: [ModelResultMetrics](mobilemodelmodule.modelresultmetrics.md)

The model result metrics, e.g., including inference time in milliseconds.

#### Defined in

[MobileModelModule.ts:53](https://github.com/pytorch/live/blob/58996af/react-native-pytorch-core/src/MobileModelModule.ts#L53)

___

### result

• **result**: `T`

The model result.

#### Defined in

[MobileModelModule.ts:48](https://github.com/pytorch/live/blob/58996af/react-native-pytorch-core/src/MobileModelModule.ts#L48)
