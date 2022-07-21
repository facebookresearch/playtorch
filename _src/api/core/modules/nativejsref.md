---
id: "nativejsref"
title: "Module: NativeJSRef"
sidebar_label: "NativeJSRef"
sidebar_position: 0
custom_edit_url: null
---

## Interfaces

- [NativeJSRef](../interfaces/nativejsref.nativejsref-1.md)

## Functions

### toPlainNativeJSRef

▸ **toPlainNativeJSRef**(`ref`): [NativeJSRef](../interfaces/nativejsref.nativejsref-1.md)

TODO(T122223365) Temporary solution to make new JSI-based native media
objects work with the old React Native architecture. For example, the
drawImage of the canvas expects a NativeJSRef, which itself only needs to
have an ID property with a UUID that resolves to an object on the native
side.

The new JSI-based native media objects have this ID too to make them
compatible with current approach of sending objects between native and
the JS thread. However, a JSI-based native media object might have other
properties and functions that aren't serializable by the bridge.

This helper function only selects the ID property of the ref, which
guarantees that the resulting NativeJSRef object is serializable.

This function can be removed once all callsites have been migrated to use
the new React Native architecture.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ref` | [NativeJSRef](../interfaces/nativejsref.nativejsref-1.md) | A NativeJSRef or a native media object. |

#### Returns

[NativeJSRef](../interfaces/nativejsref.nativejsref-1.md)

A Plain NativeJSRef object with only the ID property.

#### Defined in

[NativeJSRef.ts:88](https://github.com/facebookresearch/playtorch/blob/a729413/react-native-pytorch-core/src/NativeJSRef.ts#L88)
