/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Foundation

struct ModelSpecification: Codable {
    var pack: Pack
    var unpack: Unpack

    struct Pack: Codable {
        var type: String
        var image: String?
        var transforms: [Transform]?
    }

    struct Unpack: Codable {
        var type: String
        var dtype: String
        var key: String
    }

    struct Transform: Codable {
        var type: String
        var name: String
        var width: String?
        var height: String?
        var mean: [Float]?
        var std: [Float]?
    }
}
