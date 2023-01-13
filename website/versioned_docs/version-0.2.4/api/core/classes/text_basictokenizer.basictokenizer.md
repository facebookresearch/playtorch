---
id: "text_basictokenizer.basictokenizer"
title: "Class: BasicTokenizer"
sidebar_label: "BasicTokenizer"
custom_edit_url: null
---

[text/BasicTokenizer](../modules/text_basictokenizer.md).BasicTokenizer

## Constructors

### constructor

• **new BasicTokenizer**(`config`)

Construct a BasicTokenizer Object.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config` | [BasicTokenizerConfig](../modules/text_basictokenizer.md#basictokenizerconfig) | A basic tokenizer configuration object that specifies the non-splitable symbol, lowercase, customized punctuations, etc. |

## Methods

### tokenize

▸ **tokenize**(`text`): `string`[]

Tokenize any text with basic operations like lowercase transform, blackspace trimming and punctuation splitting.
Normally used to clean text before passing to other tokenizers (e.g. wordpiece).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `text` | `string` | The text to be processed |

#### Returns

`string`[]
