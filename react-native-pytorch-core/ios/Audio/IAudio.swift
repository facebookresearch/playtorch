/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Foundation

public protocol IAudio {
    func getData() -> Data

    func play()

    func pause()

    func stop()

    func getDuration() -> Int
}
