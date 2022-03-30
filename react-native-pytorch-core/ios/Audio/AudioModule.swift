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

    private static let PREFIX = "audio"
    private static let EXTENSION = ".wav"

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

    @objc(isRecording:rejecter:)
    public func isRecording(_ resolve: @escaping RCTPromiseResolveBlock,
                            rejecter reject: @escaping RCTPromiseRejectBlock) {
        resolve(audioRecorder?.isRecording)
    }

    @objc
    public func startRecord() {
        AVAudioSession.sharedInstance().requestRecordPermission ({(granted: Bool)-> Void in
            if !granted {
                fatalError("Record permission needs to be granted for the app to run successfully.")
            }
         })

        let audioSession = AVAudioSession.sharedInstance()

        do {
            try audioSession.setCategory(AVAudioSession.Category.record)
            try audioSession.setActive(true)
        } catch {
            fatalError("Error while recording audio.")
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
                audioRecorder.record()
        } catch let error {
            fatalError("Error while recording audio : " + error.localizedDescription)
        }
    }

    @objc(stopRecord:rejecter:)
    public func stopRecord(_ resolve: @escaping RCTPromiseResolveBlock,
                           rejecter reject: @escaping RCTPromiseRejectBlock) {
        promiseResolve = resolve
        promiseReject = reject
        if audioRecorder.isRecording {
            audioRecorder.stop()
        } else {
            promiseResolve(nil)
        }
    }

    @objc public func audioRecorderDidFinishRecording(_ recorder: AVAudioRecorder, successfully flag: Bool) {
        let recorderFilePath = (NSHomeDirectory() as NSString).appendingPathComponent("tmp/recorded_file.wav")
        if flag {
            let url = NSURL.fileURL(withPath: recorderFilePath)
            guard let data = try? Data(contentsOf: url) else {
                audioRecorder.deleteRecording()
                return
            }
            if data.isEmpty {
                promiseReject(RCTErrorUnspecified, "Invalid audio data", nil)
            }
            else {
                let audio = Audio(audioData: data)
                promiseResolve(JSContext.wrapObject(object: audio).getJSRef())
            }
        }
        audioRecorder.deleteRecording()
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

    @objc(toFile:resolver:rejecter:)
    public func toFile(_ audioRef: NSDictionary, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        let uuid = NSUUID().uuidString
        do {
            let audio = try AudioModule.unwrapAudio(audioRef)
            let filename = NSURL.fileURL(withPathComponents: [NSTemporaryDirectory()])!.appendingPathComponent(
                            AudioModule.PREFIX + uuid + AudioModule.EXTENSION)
            try? audio.getData().write(to: filename)
            resolve(filename.path)
        } catch {
            reject(RCTErrorUnspecified, "Could not write audio data to a file. \(error)", error)
        }
    }

    @objc(fromFile:resolver:rejecter:)
    public func fromFile(_ filepath: NSString, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        let path = filepath as String
        let url = URL(fileURLWithPath: path)
        do {
            let data = try Data(contentsOf: url)
            let ref = JSContext.wrapObject(object: Audio(audioData: data)).getJSRef()
            resolve(ref)
        } catch {
            reject(RCTErrorUnspecified, "Couldn't load file \(path)", nil)
        }
    }

    @objc(fromBundle:resolver:rejecter:)
    public func fromBundle(_ assetAudio: NSString, resolve: @escaping RCTPromiseResolveBlock,
                           reject: @escaping RCTPromiseRejectBlock) {
        let audioUrl = URL(string: assetAudio as String)
        let sessionConfig = URLSessionConfiguration.default
        let session = URLSession(configuration: sessionConfig)
        let request = URLRequest(url: audioUrl!)
        let task = session.downloadTask(with: request) { (tempUrl, _, error) in
            if let destinationUrl = tempUrl, error == nil {
                do {
                    let data = try Data(contentsOf: destinationUrl)
                    let ref = JSContext.wrapObject(object: Audio(audioData: data)).getJSRef()
                    resolve(ref)
                } catch {
                    reject(RCTErrorUnspecified, "Couldn't load audio from asset \(assetAudio)", error)
                }
            }
        }
        task.resume()
    }
}
