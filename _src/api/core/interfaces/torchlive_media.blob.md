---
id: "torchlive_media.blob"
title: "Interface: Blob"
sidebar_label: "Blob"
custom_edit_url: null
---

[torchlive/media](../modules/torchlive_media.md).Blob

## Properties

### size

• `Readonly` **size**: `number`

The Blob interface's size property returns the size of the Blob in bytes.

#### Defined in

[torchlive/media.ts:23](https://github.com/facebookresearch/playtorch/blob/d8eb616/react-native-pytorch-core/src/torchlive/media.ts#L23)

## Methods

### arrayBuffer

▸ **arrayBuffer**(): `Promise`<Uint8Array\>

The `arrayBuffer()` function returns a `Promise` that resolves with the
contents of the blob as binary data contained in an ArrayBuffer.

#### Returns

`Promise`<Uint8Array\>

#### Defined in

[torchlive/media.ts:19](https://github.com/facebookresearch/playtorch/blob/d8eb616/react-native-pytorch-core/src/torchlive/media.ts#L19)

___

### slice

▸ **slice**(`start?`, `end?`): [Blob](torchlive_media.blob.md)

The `slice() function creates and returns a new [Blob](torchlive_media.blob.md) object which contains
data from a subset of the blob on which it's called.

[https://developer.mozilla.org/en-US/docs/Web/API/Blob/slice](https://developer.mozilla.org/en-US/docs/Web/API/Blob/slice)

```
slice()
slice(start)
slice(start, end)
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `start?` | `number` | An index into the [Blob](torchlive_media.blob.md) indicating the first byte to include in the new [Blob](torchlive_media.blob.md). If you specify a negative value, it's treated as an offset from the end of the [Blob](torchlive_media.blob.md) toward the beginning. For example, -10 would be the 10th from last byte in the [Blob](torchlive_media.blob.md). The default value is 0. If you specify a value for `start` that is larger than the size of the source [Blob](torchlive_media.blob.md), the returned [Blob](torchlive_media.blob.md) has size 0 and contains no data. |
| `end?` | `number` | An index into the [Blob](torchlive_media.blob.md) indicating the first byte that will *not* be included in the new [Blob](torchlive_media.blob.md) (i.e. the byte exactly at this index is not included). If you specify a negative value, it's treated as an offset from the end of the [Blob](torchlive_media.blob.md) toward the beginning. For example, -10 would be the 10th from last byte in the [Blob](torchlive_media.blob.md). The default value is `size`. |

#### Returns

[Blob](torchlive_media.blob.md)

A new [Blob](torchlive_media.blob.md) object containing the specified subset of the data contained
within the blob on which this method was called. The original blob is not altered.

#### Defined in

[torchlive/media.ts:51](https://github.com/facebookresearch/playtorch/blob/d8eb616/react-native-pytorch-core/src/torchlive/media.ts#L51)
