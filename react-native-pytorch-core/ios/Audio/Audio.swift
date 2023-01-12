/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import AVFoundation
import Foundation

@objc(PTLAudio)
public class Audio: NSObject, IAudio {

  private var mPlayer: AVAudioPlayer?
  private var mData: Data

  private static let DEFAULTVOLUME: Float = 1.0

  @objc
  public init(audioData: Data) {
    self.mData = audioData
  }

  public func getData() -> Data {
    return self.mData
  }

  @objc
  public func play() {
    do {
      if self.mPlayer == nil {
        mPlayer = try AVAudioPlayer(data: mData)
      }
      try? AVAudioSession.sharedInstance().setCategory(AVAudioSession.Category.playback)
      mPlayer?.volume = Audio.DEFAULTVOLUME
      mPlayer?.play()
    } catch {
      print("Error while playing the audio. \(error)")
    }
  }

  @objc
  public func pause() {
    if (mPlayer?.isPlaying) != nil {
      mPlayer?.pause()
    }
  }

  @objc
  public func stop() {
    if let mPlayer = mPlayer, mPlayer.isPlaying {
      mPlayer.stop()
      mPlayer.currentTime = 0
    }
  }

  @objc
  public func getDuration() -> Int {
    do {
      if self.mPlayer == nil {
        mPlayer = try AVAudioPlayer(data: mData)
        try? AVAudioSession.sharedInstance().setCategory(AVAudioSession.Category.playback)
      }
      return Int(mPlayer!.duration * 1000)
    } catch {
      print("Error while fetching duration of audio. \(error)")
      return -1
    }
  }
}
