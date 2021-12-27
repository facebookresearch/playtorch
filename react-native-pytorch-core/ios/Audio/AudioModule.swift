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

    static let REACT_MODULE = "PyTorchCoreAudioModule"
    var promiseResolve : RCTPromiseResolveBlock!
    var promiseReject : RCTPromiseRejectBlock!

    enum AudioModuleError : Error {
        case castingObject
        case castingDict
    }

    @objc
    public func getName() -> String {
        return AudioModule.REACT_MODULE
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
        print(recorderFilePath)
        if flag {
            let url = NSURL.fileURL(withPath: recorderFilePath)
            let file = try! AVAudioFile(forReading: url)
            let format = AVAudioFormat(commonFormat: .pcmFormatFloat32, sampleRate: file.fileFormat.sampleRate, channels: 1, interleaved: false)

            let buf = AVAudioPCMBuffer(pcmFormat: format!, frameCapacity: AVAudioFrameCount(file.length))
            try! file.read(into: buf!)

            let floatArray = Array(UnsafeBufferPointer(start: buf?.floatChannelData![0], count:Int(buf!.frameLength)))
            let MAX_VALUE = 32767
            var intArray : [Int] = []
            for f in floatArray {
                intArray.append(Int(f * Float(MAX_VALUE)))
            }
            if intArray.isEmpty {
                promiseReject(RCTErrorUnspecified, "Invalid audio data", nil)
            }
            else {
                let audio = Audio(data: intArray)
                promiseResolve(JSContext.wrapObject(object: audio).getJSRef())
            }
        }
    }
}
