/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Foundation
import AVFoundation
import UIKit

var audioRecorder: AVAudioRecorder!

@objc(AudioModule)
public class AudioModule: NSObject, AVAudioRecorderDelegate {

    static let NAME = "PyTorchCoreAudioModule"
    var promiseResolve : RCTPromiseResolveBlock!
    var promiseReject : RCTPromiseRejectBlock!

    enum AudioModuleError : Error {
        case castingObject
        case castingDict
    }

    @objc
    public func getName() -> String {
        return AudioModule.NAME
    }

     public static func unwrapAudio(_ audioRef: NSDictionary) throws -> IAudio {
         guard let ref = audioRef["ID"] as? String else { throw AudioModuleError.castingDict }
         let castedAudio = try JSContext.unwrapObject(jsRef: ["ID": ref]) as? IAudio
         guard let audio = castedAudio else { throw AudioModuleError.castingObject }
         return audio
     }

    public static func unwrapAudio(_ audioRef: String) throws -> IAudio {
        let castedAudio = try JSContext.unwrapObject(jsRef: ["ID": audioRef]) as? IAudio
        guard let audio = castedAudio else { throw AudioModuleError.castingObject }
        return audio
    }

    @objc(record:resolver:rejecter:)
    public func record(_ length : NSNumber, resolver resolve : @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        promiseResolve = resolve
        promiseReject = reject
        AVAudioSession.sharedInstance().requestRecordPermission ({(granted: Bool)-> Void in
            if !granted {
                reject(RCTErrorUnspecified, "Record permission needs to be granted for the app to run successfully.", nil)
            }
         })

        let audioSession = AVAudioSession.sharedInstance()

        do {
            try audioSession.setCategory(AVAudioSession.Category.record)
            try audioSession.setActive(true)
        } catch {
            reject(RCTErrorUnspecified, "Error during recording", nil)
            return
        }

        let settings = [
            AVFormatIDKey: Int(kAudioFormatLinearPCM),
            AVSampleRateKey: 16000,
            AVNumberOfChannelsKey: 1,
            AVLinearPCMBitDepthKey: 16,
            AVLinearPCMIsBigEndianKey: false,
            AVLinearPCMIsFloatKey: false,
            AVEncoderAudioQualityKey: AVAudioQuality.high.rawValue
            ] as [String : Any]
        do {
            let recorderFilePath = (NSHomeDirectory() as NSString).appendingPathComponent("tmp/recorded_file.wav")
            audioRecorder = try AVAudioRecorder(url: NSURL.fileURL(withPath: recorderFilePath), settings: settings)
                audioRecorder.delegate = self
                audioRecorder.record(forDuration: 5)
        } catch let error {
            reject(RCTErrorUnspecified, "error:" + error.localizedDescription, error)
        }
    }

    @objc public func audioRecorderDidFinishRecording(_ recorder: AVAudioRecorder, successfully flag: Bool) {
        let recorderFilePath = (NSHomeDirectory() as NSString).appendingPathComponent("tmp/recorded_file.wav")
        if flag {
            let url = NSURL.fileURL(withPath: recorderFilePath)
            guard let data = try? Data(contentsOf: url) else { return }
            if data.isEmpty {
                promiseReject(RCTErrorUnspecified, "Invalid audio data", nil)
            }
            else {
                let audio = Audio(audioData: data)
                promiseResolve(JSContext.wrapObject(object: audio).getJSRef())
            }
        }
    }

    @objc
    public func play(_ audioRef: NSDictionary) {
        do {
            let audio = try AudioModule.unwrapAudio(audioRef)
            audio.play()
        } catch {
            print("Invalid audio reference sent. \(error)")
        }
    }
}
