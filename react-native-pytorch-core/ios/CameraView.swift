/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Foundation
import AVFoundation
import UIKit

@objc(CameraView)
class CameraView: UIView {

    private let photoOutput = AVCapturePhotoOutput()

    @objc public var width: NSNumber?
    @objc public var height: NSNumber?

    public func openCamera() {
        switch AVCaptureDevice.authorizationStatus(for: .video) {
        case .authorized:
            self.setupCaptureSession()
        case .notDetermined:
            AVCaptureDevice.requestAccess(for: .video) { (granted) in
                if granted {
                    DispatchQueue.main.async {
                        self.setupCaptureSession()
                    }
                } else {
                    self.createErrorView(error: "Camera permission not granted")
                }
            }
        case .denied:
            createErrorView(error: "Camera access previously denied")
        case .restricted:
            createErrorView(error: "Camera access restricted")
        default:
            createErrorView(error: "Cannot access camera permission status")
        }
    }

    override func layoutSubviews() {
        for i in 0 ..< (layer.sublayers?.count ?? 0) {
            layer.sublayers?[i].frame = self.frame
        }
    }

    private func setupCaptureSession() {
        let captureSession = AVCaptureSession()

        if let captureDevice = AVCaptureDevice.default(for: AVMediaType.video) {
            do {
                let input = try AVCaptureDeviceInput(device: captureDevice)
                if captureSession.canAddInput(input) {
                    captureSession.addInput(input)
                } else {
                    createErrorView(error: "Could not add output to capture session")
                }
            } catch let error {
                createErrorView(error: "Cannot set input device: \(error)")
            }

            if captureSession.canAddOutput(photoOutput) {
                captureSession.addOutput(photoOutput)
            } else {
                createErrorView(error: "Could not add output to capture session")
            }

            let cameraLayer = AVCaptureVideoPreviewLayer(session: captureSession)
            cameraLayer.frame = self.bounds
            cameraLayer.videoGravity = .resizeAspectFill
            self.layer.addSublayer(cameraLayer)

            captureSession.startRunning()
        } else {
            createErrorView(error: "capture device not working")
        }
    }

    private func createErrorView(error: String) {
        let label = UILabel(frame: self.frame)
        label.text = error
        self.addSubview(label)
    }

}
