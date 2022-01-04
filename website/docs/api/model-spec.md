---
id: model-spec
sidebar_position: 5
---

# Model Specification

<div className="tutorial-page">

A PyTorch Live model consists of two components: (1) A model file saved
for the PyTorch "lite" interpreter format; and (2) a JSON file with
details on the model input and output types. The JSON file is stored
within the model file itself as an [extra_file of the model](https://pytorch.org/docs/stable/generated/torch.jit.load.html#torch.jit.load) with the name
`model/live.spec.json`.

Example of model with specification preparation:

```py title=make_model.py
from pathlib import Path

import torch
import torchvision
from torch.utils.mobile_optimizer import optimize_for_mobile

# Get the original PyTorch model and convert it to mobile-optimized
# TorchScript.
model = torchvision.models.mobilenet_v3_small(pretrained=True)
model.eval()
script_model = torch.jit.script(model)
script_model_opt = optimize_for_mobile(script_model)

# Read the live.spec.json file and embed it into the model file.
spec = Path("live.spec.json").read_text()
extra_files = {}
extra_files["model/live.spec.json"] = spec
script_model_opt._save_for_lite_interpreter("model_with_spec.ptl", _extra_files=extra_files)
```

The `model/live.spec.json` file is a valid JSON file that contains two objects: `pack` and `unpack` objects. It may also contain other root objects that will be used by both pack (input preprocessing) and unpack (model output post processing) functionality.

The JavaScript side calls the model to forward specifying a plain javascript object that contains `$key` members of predefined types (Image, double, integer, string).

'model/live.spec.json' contains `"$key"` stubs that will be replaced with the values from the specified JavaScript object.

Example:
```json title=model/live.spec.json
{
 "pack": {
   "type": "tuple",
   "items": [
     {
       "type": "tensor_from_image",
       "image": "image",
       "transforms": [
         {
           "type": "image_to_image",
           "name": "center_crop",
           "width": "$cropWidth",
           "height": "$cropHeight"
         },
         {
           "type": "image_to_image",
           "name": "scale",
           "width": "$scaleWidth",
           "height": "$scaleHeight"
         },
         {
           "type": "image_to_tensor",
           "name": "rgb_norm",
           "mean": [0.0, 0.0, 0.0],
           "std": [1.0, 1.0, 1.0]
         }
       ]
     },
     {
       "type": "tensor",
       "dtype": "float",
       "sizes": [1, 3],
       "items": [
         "$scaleWidth",
         "$scaleHeight",
         "$scale"
       ]
     },
     {
       "type": "tensor",
       "dtype": "float",
       "sizes": [
         1
       ],
       "items": [
         "$should_run_track"
       ]
     },
     {
       "type": "tensor",
       "dtype": "float",
       "sizes": ["$rois_n", 4],
       "items": "$rois"
     }
   ]
 },
 "unpack": {
   "type": "tensor",
   "dtype": "float",
   "key": "scores"
 }
}
```
Respective JavaScript for this spec:
```js
const {
  result: {scores: scores},
  inferenceTime: time,
} = await MobileModel.execute(modelInfo.model, {
  image: image,
  cropWidth: 448,
  cropHeight: 448,
  scaleWidth: 224,
  scaleHeight: 224,
  scale: 1.0,
  rois_n: 3,
  rois: [0, 0, 20, 20, 10, 10, 50, 50, 30, 30, 60, 60],
  should_run_track: 0.0
});
```

## Pack - Input preprocessing

The input processing required for the model is specified by `pack` object. Every object in `pack` has a `type` field, other fields are specific to that `type`.

### Types supported for `"pack"`

- `tuple` *(currently supported on Android only)*
   - `items`: array of the tuple items
- `scalar_bool` *(currently supported on Android only)*
   - `value`: `true` or `false`
- `scalar_long` *(currently supported on Android only)*
   - `value`: long value
- `scalar_double` *(currently supported on Android only)*
   - `value`: double value
- `tensor` *(currently supported on Android only)*
   - `dtype`: data type of the tensor (`"float"` or `"long"`)
   - `items`: array of tensor data of specified dtype
- `tensor_from_image`
   - `image`: JavaScript image object
   - `transforms`: array of chained transformations on the input image of type `ImageTransform` (see below)
- `tensor_from_string`
   - `tokenizer`:
       - `bert`:
           Prepares tensor dtype=long of token ids using a BERT vocabulary. The vocabulary used to encode inputs must be stored in the top-level key `vocabulary_bert` in the spec JSON object. It should be a string with BERT tokens separated with `\n`.
       - `gpt2`:
           Prepares tensor dtype=long of token ids using a GPT2 vocabulary. The vocabulary used to encode inputs must be stored in the top-level key `vocabulary_gpt2` in the spec JSON object. It should be a JSON object mapping from vocabulary terms to the corresponding tokenId.

### Type `ImageTransform`

- type: `"image_to_image"` or `"image_to_tensor"`
- name: the name of transformation
- additional parameters specific to the particular type and name

`image_to_image` type:
   - `name`: `center_crop`
       Crops from the center part of the image with specified width and height.
       parameters:
       - `width`: width of the result cropped image
       - `height`: height of the result cropped image
   - `name`: `scale`
       Scales input image to specified width and height.
       parameters:
       - `width`: width of the result scaled image
       - `height`: height of the result scaled image

`image_to_tensor` type:
   - name: `rgb_norm`
       The output is NCHW tensor from input image, normalized by specified mean and std.
       parameters:
       - `mean`: array of 3 float numbers with values of mean for normalization (one value per channel)
       - `std`: array of 3 float numbers with values of std for normalization (one value per channel)

## Unpack - Output post-processing

The result of model post processing is a plain JavaScript object, referred
to below as `output_jsmap`.
 
The `unpack` object is a recursive structure of objects of predefined `type`s.

### Types supported for `"unpack"`

   - `tuple` *(currently supported on Android only)*
       - `items`: An array of `unpack` objects, one per tuple item to unpack.
   - `list` *(currently supported on Android only)*
       - `items`: An array of `unpack` objects, one per list item to unpack.
   - `dict_string_key` *(currently supported on Android only)*
       - `items`: An array of objects of the form `{"dict_key": <string value>}` where each `dict_key` is a string key into a dictionary returned by the model. The unpacked values will be those entries in the dictionary specified by each `dict_key`.
   - `tensor`
       - `key`: key of the array of specified data type that contains tensor items in NCHW format.
       - `dtype`: data of the tensor "float" or "long"
   - `scalar_long`: *(currently supported on Android only)*
       - `key`: key of the long value in output_jsmap
   - `scalar_float`: *(currently supported on Android only)*
       - `key`: key of the double value in output_jsmap
   - `scalar_bool`: *(currently supported on Android only)*
       - `key`: key of the bool value in output_jsmap
   - `string`:
       - `key`: key of the string in output_jsmap
   - `tensor_to_string`: *(currently supported on Android only)*
       - `key`: key of the result string in output_jsmap
       - `decoder`:
           `gpt2`:
               Expects tensor of long data type containing tokenIds. The vocabulary used to decode results must be stored in the top-level key `vocabulary_gpt2` in the spec JSON object. It should be a JSON object mapping from vocabulary terms to the corresponding tokenId.
   - `bert_decode_qa_answer`:
       - `key`: key of the result string in output_jsmap. The vocabulary used to decode results must be stored in the top-level key `vocabulary_bert` in the spec JSON object. It should contain a string with BERT tokens separated with `\n`.

## Examples

```json title=bert_qa.json
{
  "vocabulary_bert": "[PAD]\n[unused0]\n[unused1]\n[unused2]\n[unused3]\n[unused4]\n[unused5]\n...",
  "pack": {
    "type": "tensor_from_string",
    "tokenizer": "bert",
    "string": "$string",
    "model_input_length": "$model_input_length"
  },
  "unpack": {
    "type": "bert_decode_qa_answer",
    "key": "bert_answer"
  }
}
```

```json title=gpt2.json
{
  "vocabulary_gpt2": { "!": 0, "\"": 1, "#": 2, "$": 3, "%": 4, "&": 5, ... ,"<|endoftext|>": 50256},
  "pack": {
    "type": "tensor_from_string",
    "tokenizer": "gpt2",
    "string": "$string"
  },
  "unpack": {
    "type": "tensor_to_string",
    "decoder": "gpt2",
    "key": "text"
  }
}
```

</div>
