/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Foundation
import AVFoundation

public class Audio: IAudio {

    private var mPlayer: AVAudioPlayer?
    private var mData: Data

    private static let DEFAULTVOLUME: Float = 1.0

    init(audioData: Data) {
        self.mData = audioData
    }

    public func getData() -> Data {
        return self.mData
    }

    public func play() {
        do {
            mPlayer?.volume = Audio.DEFAULTVOLUME
            mPlayer = try AVAudioPlayer(data: mData)
            mPlayer?.play()
        } catch {
            print("Error while playing the audio. \(error)")
        }
    }
}
