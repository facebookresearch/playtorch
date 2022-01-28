/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Foundation
import SwiftyJSON

enum PackerRegistryError: Error {
    case packerNameAlreadyRegistered
    case unpackerNameAlreadyRegistered
}

public class PackerRegistry {

    enum PackerRegistryError: Error {
        case packerNameAlreadyRegistered
        case unpackerNameAlreadyRegistered
        case unknownPackerType
        case unknownUnpackerType
    }

    private static var mPackerMap = [String: Packer]()
    private static var mUnpackerMap = [String: Unpacker]()

    public static func register(type: String, packer: Packer) throws {
        if mPackerMap.keys.contains(type) {
            throw PackerRegistryError.packerNameAlreadyRegistered
        }

        mPackerMap[type] = packer
    }

    public static func register(type: String, unpacker: Unpacker) throws {
        if mUnpackerMap.keys.contains(type) {
            throw PackerRegistryError.unpackerNameAlreadyRegistered
        }

        mUnpackerMap[type] = unpacker
    }

    public static func pack(
        modelSpec: JSON,
        params: NSDictionary,
        packerContext: PackerContext)
    throws ->  IValue? {
        let packSpec = modelSpec["pack"]
        guard let type: String = packSpec["type"].string else {
            throw BaseIValuePackerError.invalidPackType
        }

        guard let packer: Packer = mPackerMap[type] else {
            throw PackerRegistryError.unknownPackerType
        }

        return try packer.pack(modelSpec: modelSpec, params: params, packerContext: packerContext)
    }

    public static func unpack(
        ivalue: IValue,
        modelSpec: JSON,
        result: inout [String: Any],
        packerContext: PackerContext)
    throws {
        let unpackSpec = modelSpec["unpack"]
        guard let type: String = unpackSpec["type"].string else {
            throw BaseIValuePackerError.invalidUnpackType
        }

        guard let unpacker: Unpacker = mUnpackerMap[type] else {
            throw PackerRegistryError.unknownUnpackerType
        }

        try unpacker.unpack(ivalue: ivalue, modelSpec: modelSpec, result: &result, packerContext: packerContext)
    }
}
