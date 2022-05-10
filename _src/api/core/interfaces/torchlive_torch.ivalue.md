---
id: "torchlive_torch.ivalue"
title: "Interface: IValue"
sidebar_label: "IValue"
custom_edit_url: null
---

[torchlive/torch](../modules/torchlive_torch.md).IValue

IValue (Interpreter Value) is a tagged union over the types supported by the
TorchScript interpreter.

[https://pytorch.org/cppdocs/api/structc10_1_1_i_value.html#struct-documentation](https://pytorch.org/cppdocs/api/structc10_1_1_i_value.html#struct-documentation)

## Methods

### toGenericDict

▸ **toGenericDict**(): `Object`

Returns a generic dict of key value pairs of strings as keys and
[IValue](torchlive_torch.ivalue.md) as values.

**`experimental`** This function is subject to change.

#### Returns

`Object`

#### Defined in

[torchlive/torch.ts:66](https://github.com/pytorch/live/blob/b3ca600/react-native-pytorch-core/src/torchlive/torch.ts#L66)

___

### toList

▸ **toList**(): [IValue](torchlive_torch.ivalue.md)[]

Returns a list of [IValue](torchlive_torch.ivalue.md).

**`experimental`** This function is subject to change.

#### Returns

[IValue](torchlive_torch.ivalue.md)[]

#### Defined in

[torchlive/torch.ts:53](https://github.com/pytorch/live/blob/b3ca600/react-native-pytorch-core/src/torchlive/torch.ts#L53)

___

### toTensor

▸ **toTensor**(): [Tensor](torchlive_torch.tensor.md)

Returns a [Tensor](torchlive_torch.tensor.md).

**`experimental`** This function is subject to change.

#### Returns

[Tensor](torchlive_torch.tensor.md)

#### Defined in

[torchlive/torch.ts:59](https://github.com/pytorch/live/blob/b3ca600/react-native-pytorch-core/src/torchlive/torch.ts#L59)

___

### toTuple

▸ **toTuple**(): [IValue](torchlive_torch.ivalue.md)[]

Returns a tuple of [IValue](torchlive_torch.ivalue.md).

**`experimental`** This function is subject to change.

#### Returns

[IValue](torchlive_torch.ivalue.md)[]

#### Defined in

[torchlive/torch.ts:72](https://github.com/pytorch/live/blob/b3ca600/react-native-pytorch-core/src/torchlive/torch.ts#L72)
