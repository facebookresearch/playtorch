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

[torchlive/media.ts:23](https://github.com/pytorch/live/blob/d47c0e2/react-native-pytorch-core/src/torchlive/media.ts#L23)

## Methods

### arrayBuffer

▸ **arrayBuffer**(): `Promise`<Uint8Array\>

The `arrayBuffer()` function returns a `Promise` that resolves with the
contents of the blob as binary data contained in an ArrayBuffer.

#### Returns

`Promise`<Uint8Array\>

#### Defined in

[torchlive/media.ts:19](https://github.com/pytorch/live/blob/d47c0e2/react-native-pytorch-core/src/torchlive/media.ts#L19)
