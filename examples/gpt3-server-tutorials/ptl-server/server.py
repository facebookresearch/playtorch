# Copyright (c) Facebook, Inc. and its affiliates.
#
# This source code is licensed under the MIT license found in the
# LICENSE file in the root directory of this source tree.

from flask import Flask, jsonify, request
from flask_cors import CORS
from gpt import generate

app = Flask(__name__)
CORS(app)


@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"


@app.route("/echo", methods=["POST"])
def echo():
    data = request.form
    user_said = data["text"]
    response = jsonify({"echo": user_said})
    return response


@app.route("/gpt", methods=["POST"])
def gpt():
    data = request.form
    prompt = data["prompt"]
    generated_text = generate(prompt)
    response = jsonify({"generated_text": generated_text})
    return response


app.run()
