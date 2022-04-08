---
id: "text_wordpiecetokenizer.wordpiecetokenizer"
title: "Class: WordPieceTokenizer"
sidebar_label: "WordPieceTokenizer"
custom_edit_url: null
---

[text/WordpieceTokenizer](../modules/text_wordpiecetokenizer.md).WordPieceTokenizer

## Constructors

### constructor

• **new WordPieceTokenizer**(`config`)

Construct a tokenizer with a WordPieceTokenizer object.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config` | [WordPieceTokenizerConfig](../modules/text_wordpiecetokenizer.md#wordpiecetokenizerconfig) | a tokenizer configuration object that specify the vocabulary and special tokens, etc. |

#### Defined in

[text/WordpieceTokenizer.ts:21](https://github.com/pytorch/live/blob/5332dc9/react-native-pytorch-core/src/text/WordpieceTokenizer.ts#L21)

## Methods

### decode

▸ **decode**(`tokenIds`): `string`

Decode an array of tokenIds to a string using the vocabulary

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tokenIds` | `number`[] | an array of tokenIds derived from the output of model |

#### Returns

`string`

a string decoded from the output of the model

#### Defined in

[text/WordpieceTokenizer.ts:131](https://github.com/pytorch/live/blob/5332dc9/react-native-pytorch-core/src/text/WordpieceTokenizer.ts#L131)

___

### encode

▸ **encode**(`text`): `number`[]

Encode the raw input to a NLP model to an array of number, which is tensorizable.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `text` | `string` | the raw input of the model |

#### Returns

`number`[]

an array of number, which can then be used to create a tensor as model input with the torch.tensor API

#### Defined in

[text/WordpieceTokenizer.ts:121](https://github.com/pytorch/live/blob/5332dc9/react-native-pytorch-core/src/text/WordpieceTokenizer.ts#L121)

___

### tokenize

▸ **tokenize**(`text`): `string`[]

Tokenizes a piece of text into its word pieces.
This uses a greedy longest-match-first algorithm to perform tokenization using the given vocabulary.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `text` | `string` | the raw input of the model |

#### Returns

`string`[]

an array of tokens in vocabulary representing the input text.

#### Defined in

[text/WordpieceTokenizer.ts:60](https://github.com/pytorch/live/blob/5332dc9/react-native-pytorch-core/src/text/WordpieceTokenizer.ts#L60)
