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

___

### encode

▸ **encode**(`text`): `number`[]

Encode the raw input to a NLP model to an array of number, which is tensorizable.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `text` | `string` | The raw input of the model |

#### Returns

`number`[]

An array of number, which can then be used to create a tensor as model input with the torch.tensor API

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
