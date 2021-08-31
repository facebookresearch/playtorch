# Copyright (c) Facebook, Inc. and its affiliates.
#
# This source code is licensed under the MIT license found in the
# LICENSE file in the root directory of this source tree.

from transformers import pipeline

print("Instantiating model...")
gpt_pipeline = pipeline("text-generation", model="EleutherAI/gpt-neo-1.3B")
print("Model instantiated!")


def generate(prompt):
    print("Running model with prompt: ", prompt)
    model_output = gpt_pipeline(prompt, do_sample=True, min_length=50)
    generated_text = model_output[0]["generated_text"]
    print("Model done running!")
    return generated_text
