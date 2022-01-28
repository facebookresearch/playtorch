/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Foundation

public protocol IIValuePacker {
    func pack(params: NSDictionary, packerContext: PackerContext) throws -> IValue?

    func unpack(ivalue: IValue, params: NSDictionary, packerContext: PackerContext) throws -> [String: Any]

    func newContext() -> PackerContext
}
