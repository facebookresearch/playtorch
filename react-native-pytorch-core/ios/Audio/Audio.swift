/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Foundation

public class Audio: IAudio {

    private var mData: [Int]

    init(data: [Int]) {
        self.mData = data;
    }

    public func getData() -> [Int] {
        return self.mData
    }
}