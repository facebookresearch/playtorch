---
id: "torchlive_torch.tensor"
title: "Interface: Tensor"
sidebar_label: "Tensor"
custom_edit_url: null
---

[torchlive/torch](../modules/torchlive_torch.md).Tensor

## Indexable

▪ [index: `number`]: [Tensor](torchlive_torch.tensor.md)

Access tensor with index.

```typescript
const tensor = torch.rand([2]);
console.log(tensor.data, tensor[0].data);
// [0.8339180946350098, 0.17733973264694214], [0.8339180946350098]
```

[https://pytorch.org/cppdocs/notes/tensor_indexing.html](https://pytorch.org/cppdocs/notes/tensor_indexing.html)

## Properties

### dtype

• **dtype**: [Dtype](../modules/torchlive_torch.md#dtype)

A dtype is an string that represents the data type of a torch.Tensor.

[https://pytorch.org/docs/1.11/tensor_attributes.html](https://pytorch.org/docs/1.11/tensor_attributes.html)

#### Defined in

[torchlive/torch.ts:238](https://github.com/facebookresearch/playtorch/blob/a792455/react-native-pytorch-core/src/torchlive/torch.ts#L238)

___

### shape

• **shape**: `number`[]

Returns the size of the tensor.

[https://pytorch.org/docs/1.11/generated/torch.Tensor.size.html](https://pytorch.org/docs/1.11/generated/torch.Tensor.size.html)

#### Defined in

[torchlive/torch.ts:276](https://github.com/facebookresearch/playtorch/blob/a792455/react-native-pytorch-core/src/torchlive/torch.ts#L276)

## Methods

### abs

▸ **abs**(): [Tensor](torchlive_torch.tensor.md)

Computes the absolute value of each element in input.

[https://pytorch.org/docs/1.11/generated/torch.Tensor.abs.html](https://pytorch.org/docs/1.11/generated/torch.Tensor.abs.html)

#### Returns

[Tensor](torchlive_torch.tensor.md)

#### Defined in

[torchlive/torch.ts:147](https://github.com/facebookresearch/playtorch/blob/a792455/react-native-pytorch-core/src/torchlive/torch.ts#L147)

___

### add

▸ **add**(`other`, `options?`): [Tensor](torchlive_torch.tensor.md)

Add a scalar or tensor to this tensor.

[https://pytorch.org/docs/1.11/generated/torch.Tensor.add.html](https://pytorch.org/docs/1.11/generated/torch.Tensor.add.html)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `other` | `number` \| [Tensor](torchlive_torch.tensor.md) | Scalar or tensor to be added to each element in this tensor. |
| `options?` | `Object` | - |
| `options.alpha?` | `Number` | The multiplier for `other`. Default: `1`. |

#### Returns

[Tensor](torchlive_torch.tensor.md)

#### Defined in

[torchlive/torch.ts:156](https://github.com/facebookresearch/playtorch/blob/a792455/react-native-pytorch-core/src/torchlive/torch.ts#L156)

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

[torchlive/torch.ts:167](https://github.com/facebookresearch/playtorch/blob/a792455/react-native-pytorch-core/src/torchlive/torch.ts#L167)

___

### clamp

▸ **clamp**(`min`, `max?`): [Tensor](torchlive_torch.tensor.md)

Clamps all elements in input into the range `[ min, max ]`.

If `min` is `undefined`, there is no lower bound. Or, if `max` is `undefined` there is no upper bound.

[https://pytorch.org/docs/1.11/generated/torch.Tensor.clamp.html](https://pytorch.org/docs/1.11/generated/torch.Tensor.clamp.html)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `min` | `number` \| [Tensor](torchlive_torch.tensor.md) | Lower-bound of the range to be clamped to |
| `max?` | `number` \| [Tensor](torchlive_torch.tensor.md) | Upper-bound of the range to be clamped to |

#### Returns

[Tensor](torchlive_torch.tensor.md)

#### Defined in

[torchlive/torch.ts:178](https://github.com/facebookresearch/playtorch/blob/a792455/react-native-pytorch-core/src/torchlive/torch.ts#L178)

▸ **clamp**(`options`): [Tensor](torchlive_torch.tensor.md)

Clamps all elements in input into the range `[ min, max ]`.

If `min` is `undefined`, there is no lower bound. Or, if `max` is `undefined` there is no upper bound.

[https://pytorch.org/docs/1.11/generated/torch.Tensor.clamp.html](https://pytorch.org/docs/1.11/generated/torch.Tensor.clamp.html)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | `Object` | - |
| `options.max?` | `number` \| [Tensor](torchlive_torch.tensor.md) | Upper-bound of the range to be clamped to |
| `options.min?` | `number` \| [Tensor](torchlive_torch.tensor.md) | Lower-bound of the range to be clamped to |

#### Returns

[Tensor](torchlive_torch.tensor.md)

#### Defined in

[torchlive/torch.ts:189](https://github.com/facebookresearch/playtorch/blob/a792455/react-native-pytorch-core/src/torchlive/torch.ts#L189)

___

### contiguous

▸ **contiguous**(`options?`): [Tensor](torchlive_torch.tensor.md)

Returns a contiguous in memory tensor containing the same data as this
tensor. If this tensor is already in the specified memory format, this
function returns this tensor.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | `Object` | - |
| `options.memoryFormat` | [MemoryFormat](../modules/torchlive_torch.md#memoryformat) | The desired memory format of returned Tensor. Default: torch.contiguousFormat.  [https://pytorch.org/docs/1.11/generated/torch.Tensor.contiguous.html](https://pytorch.org/docs/1.11/generated/torch.Tensor.contiguous.html) |

#### Returns

[Tensor](torchlive_torch.tensor.md)

#### Defined in

[torchlive/torch.ts:199](https://github.com/facebookresearch/playtorch/blob/a792455/react-native-pytorch-core/src/torchlive/torch.ts#L199)

___

### data

▸ **data**(): `TypedArray`

Returns the tensor data as `TypedArray` buffer.

[https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)

A valid TypeScript expression is as follows:

```typescript
torch.rand([2, 3]).data()[3];
```

:::note

The function only exists in JavaScript.

:::

**`experimental`**

#### Returns

`TypedArray`

#### Defined in

[torchlive/torch.ts:219](https://github.com/facebookresearch/playtorch/blob/a792455/react-native-pytorch-core/src/torchlive/torch.ts#L219)

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
| `options?` | `Object` | - |
| `options.roundingMode?` | ``"trunc"`` \| ``"floor"`` | Type of rounding applied to the result |

#### Returns

[Tensor](torchlive_torch.tensor.md)

#### Defined in

[torchlive/torch.ts:229](https://github.com/facebookresearch/playtorch/blob/a792455/react-native-pytorch-core/src/torchlive/torch.ts#L229)

___

### item

▸ **item**(): `number`

Returns the value of this tensor as a `number`. This only works for
tensors with one element.

[https://pytorch.org/docs/1.11/generated/torch.Tensor.item.html](https://pytorch.org/docs/1.11/generated/torch.Tensor.item.html)

#### Returns

`number`

#### Defined in

[torchlive/torch.ts:245](https://github.com/facebookresearch/playtorch/blob/a792455/react-native-pytorch-core/src/torchlive/torch.ts#L245)

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

[torchlive/torch.ts:262](https://github.com/facebookresearch/playtorch/blob/a792455/react-native-pytorch-core/src/torchlive/torch.ts#L262)

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

[torchlive/torch.ts:270](https://github.com/facebookresearch/playtorch/blob/a792455/react-native-pytorch-core/src/torchlive/torch.ts#L270)

___

### reshape

▸ **reshape**(`shape`): [Tensor](torchlive_torch.tensor.md)

Returns a tensor with the same data and number of elements as input, but
with the specified shape.

[https://pytorch.org/docs/1.11/generated/torch.Tensor.reshape.html](https://pytorch.org/docs/1.11/generated/torch.Tensor.reshape.html)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `shape` | `number`[] | The new shape. |

#### Returns

[Tensor](torchlive_torch.tensor.md)

#### Defined in

[torchlive/torch.ts:254](https://github.com/facebookresearch/playtorch/blob/a792455/react-native-pytorch-core/src/torchlive/torch.ts#L254)

___

### size

▸ **size**(): `number`[]

Returns the size of the tensor.

[https://pytorch.org/docs/1.11/generated/torch.Tensor.size.html](https://pytorch.org/docs/1.11/generated/torch.Tensor.size.html)

#### Returns

`number`[]

#### Defined in

[torchlive/torch.ts:282](https://github.com/facebookresearch/playtorch/blob/a792455/react-native-pytorch-core/src/torchlive/torch.ts#L282)

___

### softmax

▸ **softmax**(`dim`): [Tensor](torchlive_torch.tensor.md)

Applies a softmax function. It is applied to all slices along dim, and
will re-scale them so that the elements lie in the range `[0, 1]` and sum
to `1`.

[https://pytorch.org/docs/1.11/generated/torch.nn.functional.softmax.html](https://pytorch.org/docs/1.11/generated/torch.nn.functional.softmax.html)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `dim` | `number` | A dimension along which softmax will be computed. |

#### Returns

[Tensor](torchlive_torch.tensor.md)

#### Defined in

[torchlive/torch.ts:292](https://github.com/facebookresearch/playtorch/blob/a792455/react-native-pytorch-core/src/torchlive/torch.ts#L292)

___

### sqrt

▸ **sqrt**(): [Tensor](torchlive_torch.tensor.md)

Computes the square-root value of each element in input.

[https://pytorch.org/docs/1.11/generated/torch.Tensor.sqrt.html](https://pytorch.org/docs/1.11/generated/torch.Tensor.sqrt.html)

#### Returns

[Tensor](torchlive_torch.tensor.md)

#### Defined in

[torchlive/torch.ts:298](https://github.com/facebookresearch/playtorch/blob/a792455/react-native-pytorch-core/src/torchlive/torch.ts#L298)

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

[torchlive/torch.ts:306](https://github.com/facebookresearch/playtorch/blob/a792455/react-native-pytorch-core/src/torchlive/torch.ts#L306)

___

### stride

▸ **stride**(): `number`[]

Returns the stride of the tensor.

[https://pytorch.org/docs/1.11/generated/torch.Tensor.stride.html](https://pytorch.org/docs/1.11/generated/torch.Tensor.stride.html)

#### Returns

`number`[]

#### Defined in

[torchlive/torch.ts:312](https://github.com/facebookresearch/playtorch/blob/a792455/react-native-pytorch-core/src/torchlive/torch.ts#L312)

▸ **stride**(`dim`): `number`

Returns the stride of the tensor.

[https://pytorch.org/docs/1.11/generated/torch.Tensor.stride.html](https://pytorch.org/docs/1.11/generated/torch.Tensor.stride.html)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `dim` | `number` | The desired dimension in which stride is required. |

#### Returns

`number`

#### Defined in

[torchlive/torch.ts:320](https://github.com/facebookresearch/playtorch/blob/a792455/react-native-pytorch-core/src/torchlive/torch.ts#L320)

___

### sub

▸ **sub**(`other`, `options?`): [Tensor](torchlive_torch.tensor.md)

Subtracts other from input.

[https://pytorch.org/docs/1.11/generated/torch.Tensor.sub.html](https://pytorch.org/docs/1.11/generated/torch.Tensor.sub.html)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `other` | `number` \| [Tensor](torchlive_torch.tensor.md) | The scalar or tensor to subtract from input. |
| `options?` | `Object` | - |
| `options.alpha?` | `Number` | The multiplier for `other`. Default: `1`. |

#### Returns

[Tensor](torchlive_torch.tensor.md)

#### Defined in

[torchlive/torch.ts:329](https://github.com/facebookresearch/playtorch/blob/a792455/react-native-pytorch-core/src/torchlive/torch.ts#L329)

___

### sum

▸ **sum**(): [Tensor](torchlive_torch.tensor.md)

Returns the sum of all elements in the input tensor.

[https://pytorch.org/docs/1.11/generated/torch.Tensor.sum.html](https://pytorch.org/docs/1.11/generated/torch.Tensor.sum.html)

#### Returns

[Tensor](torchlive_torch.tensor.md)

#### Defined in

[torchlive/torch.ts:335](https://github.com/facebookresearch/playtorch/blob/a792455/react-native-pytorch-core/src/torchlive/torch.ts#L335)

▸ **sum**(`dim`, `options?`): [Tensor](torchlive_torch.tensor.md)

Returns the sum of each row of the input tensor in the given dimension dim.
If dim is a list of dimensions, reduce over all of them.

[https://pytorch.org/docs/1.11/generated/torch.Tensor.sum.html](https://pytorch.org/docs/1.11/generated/torch.Tensor.sum.html)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `dim` | `number` \| `number`[] | The dimension or dimensions to reduce. |
| `options?` | `Object` | - |
| `options.keepdim?` | `boolean` | Whether the output tensor has `dim` retained or not. |

#### Returns

[Tensor](torchlive_torch.tensor.md)

#### Defined in

[torchlive/torch.ts:345](https://github.com/facebookresearch/playtorch/blob/a792455/react-native-pytorch-core/src/torchlive/torch.ts#L345)

___

### to

▸ **to**(`options`): [Tensor](torchlive_torch.tensor.md)

Performs Tensor conversion.

[https://pytorch.org/docs/1.11/generated/torch.Tensor.to.html](https://pytorch.org/docs/1.11/generated/torch.Tensor.to.html)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | [TensorOptions](../modules/torchlive_torch.md#tensoroptions) | Tensor options. |

#### Returns

[Tensor](torchlive_torch.tensor.md)

#### Defined in

[torchlive/torch.ts:353](https://github.com/facebookresearch/playtorch/blob/a792455/react-native-pytorch-core/src/torchlive/torch.ts#L353)

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

[torchlive/torch.ts:362](https://github.com/facebookresearch/playtorch/blob/a792455/react-native-pytorch-core/src/torchlive/torch.ts#L362)

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

[torchlive/torch.ts:371](https://github.com/facebookresearch/playtorch/blob/a792455/react-native-pytorch-core/src/torchlive/torch.ts#L371)
