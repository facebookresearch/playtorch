---
id: "torchlive_torch.tensor"
title: "Interface: Tensor"
sidebar_label: "Tensor"
custom_edit_url: null
---

[torchlive/torch](../modules/torchlive_torch.md).Tensor

## Hierarchy

- [IValue](torchlive_torch.ivalue.md)

  ↳ **Tensor**

## Indexable

▪ [index: `number`]: [Tensor](torchlive_torch.tensor.md)

Access tensor with index. This is similar to how tensor data is accessed
in PyTorch Python.

```python
>>> tensor = torch.rand([2])
>>> tensor, tensor[0]
(tensor([0.8254, 0.0784]), tensor(0.8254))
```

## Properties

### data

• **data**: `TypedArray`

Returns the tensor data as [[TypedArray]] buffer.

[https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)

A valid TypeScript expression is as follows:

```typescript
torch.rand([2, 3]).data[3];
```

:::note

The function only exists in JavaScript.

:::

**`experimental`**

#### Defined in

[torchlive/torch.ts:145](https://github.com/pytorch/live/blob/a0d6a87/react-native-pytorch-core/src/torchlive/torch.ts#L145)

___

### dtype

• **dtype**: `string`

A dtype is an string that represents the data type of a torch.Tensor.

[https://pytorch.org/docs/1.11/tensor_attributes.html](https://pytorch.org/docs/1.11/tensor_attributes.html)

#### Defined in

[torchlive/torch.ts:164](https://github.com/pytorch/live/blob/a0d6a87/react-native-pytorch-core/src/torchlive/torch.ts#L164)

___

### shape

• **shape**: `number`[]

Returns the size of the tensor.

[https://pytorch.org/docs/1.11/generated/torch.Tensor.size.html](https://pytorch.org/docs/1.11/generated/torch.Tensor.size.html)

#### Defined in

[torchlive/torch.ts:186](https://github.com/pytorch/live/blob/a0d6a87/react-native-pytorch-core/src/torchlive/torch.ts#L186)

## Methods

### abs

▸ **abs**(): [Tensor](torchlive_torch.tensor.md)

Computes the absolute value of each element in input.

[https://pytorch.org/docs/1.11/generated/torch.Tensor.abs.html](https://pytorch.org/docs/1.11/generated/torch.Tensor.abs.html)

#### Returns

[Tensor](torchlive_torch.tensor.md)

#### Defined in

[torchlive/torch.ts:110](https://github.com/pytorch/live/blob/a0d6a87/react-native-pytorch-core/src/torchlive/torch.ts#L110)

___

### add

▸ **add**(`other`): [Tensor](torchlive_torch.tensor.md)

Add a scalar or tensor to this tensor.

[https://pytorch.org/docs/1.11/generated/torch.Tensor.add.html](https://pytorch.org/docs/1.11/generated/torch.Tensor.add.html)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `other` | `number` \| [Tensor](torchlive_torch.tensor.md) | Scalar or tensor to be added to each element in this tensor. |

#### Returns

[Tensor](torchlive_torch.tensor.md)

#### Defined in

[torchlive/torch.ts:118](https://github.com/pytorch/live/blob/a0d6a87/react-native-pytorch-core/src/torchlive/torch.ts#L118)

___

### argmax

▸ **argmax**(): `number`

Returns the indices of the maximum value of all elements in the input
tensor.

[https://pytorch.org/docs/1.11/generated/torch.Tensor.argmax.html](https://pytorch.org/docs/1.11/generated/torch.Tensor.argmax.html)

#### Returns

`number`

#### Defined in

[torchlive/torch.ts:125](https://github.com/pytorch/live/blob/a0d6a87/react-native-pytorch-core/src/torchlive/torch.ts#L125)

___

### div

▸ **div**(`other`, `options?`): [Tensor](torchlive_torch.tensor.md)

Divides each element of the input input by the corresponding element of
other.

[https://pytorch.org/docs/1.11/generated/torch.Tensor.div.html](https://pytorch.org/docs/1.11/generated/torch.Tensor.div.html)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `other` | `number` \| [Tensor](torchlive_torch.tensor.md) | Scalar or tensor that divides each element in this tensor. |
| `options?` | [TensorOptions](../modules/torchlive_torch.md#tensoroptions) & { `rounding_mode`: ``"trunc"`` \| ``"floor"``  } | Tensor options. |

#### Returns

[Tensor](torchlive_torch.tensor.md)

#### Defined in

[torchlive/torch.ts:155](https://github.com/pytorch/live/blob/a0d6a87/react-native-pytorch-core/src/torchlive/torch.ts#L155)

___

### mul

▸ **mul**(`other`): [Tensor](torchlive_torch.tensor.md)

Multiplies input by other scalar or tensor.

[https://pytorch.org/docs/1.11/generated/torch.Tensor.mul.html](https://pytorch.org/docs/1.11/generated/torch.Tensor.mul.html)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `other` | `number` \| [Tensor](torchlive_torch.tensor.md) | Scalar or tensor multiplied with each element in this tensor. |

#### Returns

[Tensor](torchlive_torch.tensor.md)

#### Defined in

[torchlive/torch.ts:172](https://github.com/pytorch/live/blob/a0d6a87/react-native-pytorch-core/src/torchlive/torch.ts#L172)

___

### permute

▸ **permute**(`dims`): [Tensor](torchlive_torch.tensor.md)

Returns a view of the original tensor input with its dimensions permuted.

[https://pytorch.org/docs/1.11/generated/torch.Tensor.permute.html](https://pytorch.org/docs/1.11/generated/torch.Tensor.permute.html)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `dims` | `number`[] | The desired ordering of dimensions. |

#### Returns

[Tensor](torchlive_torch.tensor.md)

#### Defined in

[torchlive/torch.ts:180](https://github.com/pytorch/live/blob/a0d6a87/react-native-pytorch-core/src/torchlive/torch.ts#L180)

___

### size

▸ **size**(): `number`[]

Returns the size of the tensor.

[https://pytorch.org/docs/1.11/generated/torch.Tensor.size.html](https://pytorch.org/docs/1.11/generated/torch.Tensor.size.html)

#### Returns

`number`[]

#### Defined in

[torchlive/torch.ts:192](https://github.com/pytorch/live/blob/a0d6a87/react-native-pytorch-core/src/torchlive/torch.ts#L192)

___

### softmax

▸ **softmax**(`dim`): [Tensor](torchlive_torch.tensor.md)

Applies a softmax function. It is applied to all slices along dim, and
will re-scale them so that the elements lie in the range `[0, 1]` and sum
to `1`.

[https://pytorch.org/docs/stable/generated/torch.nn.functional.softmax.html](https://pytorch.org/docs/stable/generated/torch.nn.functional.softmax.html)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `dim` | `number` | A dimension along which softmax will be computed. |

#### Returns

[Tensor](torchlive_torch.tensor.md)

#### Defined in

[torchlive/torch.ts:202](https://github.com/pytorch/live/blob/a0d6a87/react-native-pytorch-core/src/torchlive/torch.ts#L202)

___

### squeeze

▸ **squeeze**(`dim?`): [Tensor](torchlive_torch.tensor.md)

Returns a tensor with all the dimensions of input of size 1 removed.

[https://pytorch.org/docs/1.11/generated/torch.Tensor.squeeze.html](https://pytorch.org/docs/1.11/generated/torch.Tensor.squeeze.html)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `dim?` | `number` | If given, the input will be squeezed only in this dimension. |

#### Returns

[Tensor](torchlive_torch.tensor.md)

#### Defined in

[torchlive/torch.ts:210](https://github.com/pytorch/live/blob/a0d6a87/react-native-pytorch-core/src/torchlive/torch.ts#L210)

___

### sub

▸ **sub**(`other`): [Tensor](torchlive_torch.tensor.md)

Subtracts other from input.

[https://pytorch.org/docs/1.11/generated/torch.Tensor.sub.html](https://pytorch.org/docs/1.11/generated/torch.Tensor.sub.html)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `other` | `number` \| [Tensor](torchlive_torch.tensor.md) | The scalar or tensor to subtract from input. |

#### Returns

[Tensor](torchlive_torch.tensor.md)

#### Defined in

[torchlive/torch.ts:218](https://github.com/pytorch/live/blob/a0d6a87/react-native-pytorch-core/src/torchlive/torch.ts#L218)

___

### toGenericDict

▸ **toGenericDict**(): `Object`

Returns a generic dict.

**`experimental`**

#### Returns

`Object`

#### Inherited from

[IValue](torchlive_torch.ivalue.md).[toGenericDict](torchlive_torch.ivalue.md#togenericdict)

#### Defined in

[torchlive/torch.ts:53](https://github.com/pytorch/live/blob/a0d6a87/react-native-pytorch-core/src/torchlive/torch.ts#L53)

___

### toString

▸ **toString**(): `string`

Returns a string representation of the tensor including all items, the
shape, and the dtype.

:::note

The function only exists in JavaScript.

:::

**`experimental`**

#### Returns

`string`

#### Defined in

[torchlive/torch.ts:240](https://github.com/pytorch/live/blob/a0d6a87/react-native-pytorch-core/src/torchlive/torch.ts#L240)

___

### toTensor

▸ **toTensor**(): [Tensor](torchlive_torch.tensor.md)

Returns a tensor.

**`experimental`**

#### Returns

[Tensor](torchlive_torch.tensor.md)

#### Inherited from

[IValue](torchlive_torch.ivalue.md).[toTensor](torchlive_torch.ivalue.md#totensor)

#### Defined in

[torchlive/torch.ts:47](https://github.com/pytorch/live/blob/a0d6a87/react-native-pytorch-core/src/torchlive/torch.ts#L47)

___

### topk

▸ **topk**(`k`): [[Tensor](torchlive_torch.tensor.md), [Tensor](torchlive_torch.tensor.md)]

Returns the k largest elements of the given input tensor along a given
dimension.

[https://pytorch.org/docs/1.11/generated/torch.Tensor.topk.html](https://pytorch.org/docs/1.11/generated/torch.Tensor.topk.html)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `k` | `number` | The k in "top-k" |

#### Returns

[[Tensor](torchlive_torch.tensor.md), [Tensor](torchlive_torch.tensor.md)]

#### Defined in

[torchlive/torch.ts:227](https://github.com/pytorch/live/blob/a0d6a87/react-native-pytorch-core/src/torchlive/torch.ts#L227)

___

### unsqueeze

▸ **unsqueeze**(`dim`): [Tensor](torchlive_torch.tensor.md)

Returns a new tensor with a dimension of size one inserted at the
specified position.

[https://pytorch.org/docs/1.11/generated/torch.Tensor.unsqueeze.html](https://pytorch.org/docs/1.11/generated/torch.Tensor.unsqueeze.html)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `dim` | `number` | The index at which to insert the singleton dimension. |

#### Returns

[Tensor](torchlive_torch.tensor.md)

#### Defined in

[torchlive/torch.ts:249](https://github.com/pytorch/live/blob/a0d6a87/react-native-pytorch-core/src/torchlive/torch.ts#L249)
