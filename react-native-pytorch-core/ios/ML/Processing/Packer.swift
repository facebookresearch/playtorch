/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Foundation
import SwiftyJSON

public protocol Packer {
    func pack(modelSpec: JSON, params: NSDictionary, packerContext: PackerContext) throws -> IValue?
}
