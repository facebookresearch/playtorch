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

[torchlive/torch.ts:168](https://github.com/pytorch/live/blob/c947816/react-native-pytorch-core/src/torchlive/torch.ts#L168)

___

### dtype

• **dtype**: `string`

A dtype is an string that represents the data type of a torch.Tensor.

[https://pytorch.org/docs/1.11/tensor_attributes.html](https://pytorch.org/docs/1.11/tensor_attributes.html)

#### Defined in

[torchlive/torch.ts:187](https://github.com/pytorch/live/blob/c947816/react-native-pytorch-core/src/torchlive/torch.ts#L187)

___

### shape

• **shape**: `number`[]

Returns the size of the tensor.

[https://pytorch.org/docs/1.11/generated/torch.Tensor.size.html](https://pytorch.org/docs/1.11/generated/torch.Tensor.size.html)

#### Defined in

[torchlive/torch.ts:216](https://github.com/pytorch/live/blob/c947816/react-native-pytorch-core/src/torchlive/torch.ts#L216)

## Methods

### abs

▸ **abs**(): [Tensor](torchlive_torch.tensor.md)

Computes the absolute value of each element in input.

[https://pytorch.org/docs/1.11/generated/torch.Tensor.abs.html](https://pytorch.org/docs/1.11/generated/torch.Tensor.abs.html)

#### Returns

[Tensor](torchlive_torch.tensor.md)

#### Defined in

[torchlive/torch.ts:129](https://github.com/pytorch/live/blob/c947816/react-native-pytorch-core/src/torchlive/torch.ts#L129)

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

[torchlive/torch.ts:137](https://github.com/pytorch/live/blob/c947816/react-native-pytorch-core/src/torchlive/torch.ts#L137)

___

### argmax

▸ **argmax**(`options?`): [Tensor](torchlive_torch.tensor.md)

Returns the indices of the maximum value of all elements in the input
tensor.

[https://pytorch.org/docs/1.11/generated/torch.Tensor.argmax.html](https://pytorch.org/docs/1.11/generated/torch.Tensor.argmax.html)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | `Object` | argmax Options as keywords argument in pytorch |
| `options.dim?` | `number` | The dimension to reduce. If `undefined`, the argmax of the flattened input is returned. |
| `options.keepdim?` | `boolean` | Whether the output tensor has `dim` retained or not. Ignored if `dim` is `undefined`. |

#### Returns

[Tensor](torchlive_torch.tensor.md)

#### Defined in

[torchlive/torch.ts:148](https://github.com/pytorch/live/blob/c947816/react-native-pytorch-core/src/torchlive/torch.ts#L148)

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

[torchlive/torch.ts:178](https://github.com/pytorch/live/blob/c947816/react-native-pytorch-core/src/torchlive/torch.ts#L178)

___

### item

▸ **item**(): `number`

Returns the value of this tensor as a standard Python number. This only works for tensors with one element.

[https://pytorch.org/docs/1.11/generated/torch.Tensor.item.html](https://pytorch.org/docs/1.11/generated/torch.Tensor.item.html)

#### Returns

`number`

#### Defined in

[torchlive/torch.ts:194](https://github.com/pytorch/live/blob/c947816/react-native-pytorch-core/src/torchlive/torch.ts#L194)

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

[torchlive/torch.ts:202](https://github.com/pytorch/live/blob/c947816/react-native-pytorch-core/src/torchlive/torch.ts#L202)

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

[torchlive/torch.ts:210](https://github.com/pytorch/live/blob/c947816/react-native-pytorch-core/src/torchlive/torch.ts#L210)

___

### size

▸ **size**(): `number`[]

Returns the size of the tensor.

[https://pytorch.org/docs/1.11/generated/torch.Tensor.size.html](https://pytorch.org/docs/1.11/generated/torch.Tensor.size.html)

#### Returns

`number`[]

#### Defined in

[torchlive/torch.ts:222](https://github.com/pytorch/live/blob/c947816/react-native-pytorch-core/src/torchlive/torch.ts#L222)

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

[torchlive/torch.ts:232](https://github.com/pytorch/live/blob/c947816/react-native-pytorch-core/src/torchlive/torch.ts#L232)

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

[torchlive/torch.ts:240](https://github.com/pytorch/live/blob/c947816/react-native-pytorch-core/src/torchlive/torch.ts#L240)

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

[torchlive/torch.ts:248](https://github.com/pytorch/live/blob/c947816/react-native-pytorch-core/src/torchlive/torch.ts#L248)

___

### toGenericDict

▸ **toGenericDict**(): `Object`

Returns a generic dict of key value pairs of strings as keys and
[IValue](torchlive_torch.ivalue.md) as values.

**`experimental`** This function is subject to change.

#### Returns

`Object`

#### Inherited from

[IValue](torchlive_torch.ivalue.md).[toGenericDict](torchlive_torch.ivalue.md#togenericdict)

#### Defined in

[torchlive/torch.ts:66](https://github.com/pytorch/live/blob/c947816/react-native-pytorch-core/src/torchlive/torch.ts#L66)

___

### toList

▸ **toList**(): [IValue](torchlive_torch.ivalue.md)[]

Returns a list of [IValue](torchlive_torch.ivalue.md).

**`experimental`** This function is subject to change.

#### Returns

[IValue](torchlive_torch.ivalue.md)[]

#### Inherited from

[IValue](torchlive_torch.ivalue.md).[toList](torchlive_torch.ivalue.md#tolist)

#### Defined in

[torchlive/torch.ts:53](https://github.com/pytorch/live/blob/c947816/react-native-pytorch-core/src/torchlive/torch.ts#L53)

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

[torchlive/torch.ts:270](https://github.com/pytorch/live/blob/c947816/react-native-pytorch-core/src/torchlive/torch.ts#L270)

___

### toTensor

▸ **toTensor**(): [Tensor](torchlive_torch.tensor.md)

Returns a [Tensor](torchlive_torch.tensor.md).

**`experimental`** This function is subject to change.

#### Returns

[Tensor](torchlive_torch.tensor.md)

#### Inherited from

[IValue](torchlive_torch.ivalue.md).[toTensor](torchlive_torch.ivalue.md#totensor)

#### Defined in

[torchlive/torch.ts:59](https://github.com/pytorch/live/blob/c947816/react-native-pytorch-core/src/torchlive/torch.ts#L59)

___

### toTuple

▸ **toTuple**(): [IValue](torchlive_torch.ivalue.md)[]

Returns a tuple of [IValue](torchlive_torch.ivalue.md).

**`experimental`** This function is subject to change.

#### Returns

[IValue](torchlive_torch.ivalue.md)[]

#### Inherited from

[IValue](torchlive_torch.ivalue.md).[toTuple](torchlive_torch.ivalue.md#totuple)

#### Defined in

[torchlive/torch.ts:72](https://github.com/pytorch/live/blob/c947816/react-native-pytorch-core/src/torchlive/torch.ts#L72)

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

[torchlive/torch.ts:257](https://github.com/pytorch/live/blob/c947816/react-native-pytorch-core/src/torchlive/torch.ts#L257)

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

[torchlive/torch.ts:279](https://github.com/pytorch/live/blob/c947816/react-native-pytorch-core/src/torchlive/torch.ts#L279)
