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
class CameraView: UIView, AVCapturePhotoCaptureDelegate, AVCaptureVideoDataOutputSampleBufferDelegate {

    private let captureButtonSize = 75.0
    private let captureButtonMargin = 16.0
    private let photoOutput = AVCapturePhotoOutput()
    private var videoOutput: AVCaptureVideoDataOutput!
    private var captureSession: AVCaptureSession!
    private var cameraLayer: AVCaptureVideoPreviewLayer!
    private var backCamera: AVCaptureDevice!
    private var backInput: AVCaptureInput!
    private var frontCamera: AVCaptureDevice!
    private var frontInput: AVCaptureInput!
    @objc public var onCapture: RCTDirectEventBlock?
    @objc public var onFrame: RCTDirectEventBlock?
    @objc public var hideCaptureButton: Bool = false
    var captureButton: CaptureButton?

    public func openCamera() {
        setupCaptureButton()
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
        let height = self.bounds.height
        let width = self.bounds.width
        cameraLayer?.frame = CGRect(x: 0, y: 0, width: width, height: height)
        captureButton?.frame = CGRect(x: Double(width)/2.0 - captureButtonSize/2.0, y: Double(height) - captureButtonSize - captureButtonMargin, width: captureButtonSize, height: captureButtonSize)
    }

    func setupCaptureButton() {
        captureButton = CaptureButton(frame: CGRect(x: Double(self.bounds.width)/2.0 - captureButtonSize/2.0, y: Double(self.bounds.height) - captureButtonSize - captureButtonMargin, width: captureButtonSize, height: captureButtonSize))
        captureButton?.addTarget(self, action: #selector(captureImage), for: .touchDown)
        if let captureButton = captureButton {
            self.addSubview(captureButton)
        }
    }

    func setupInput() {
        if #available(iOS 10.2, *) {
            if let device = AVCaptureDevice.DiscoverySession(deviceTypes: [.builtInDualCamera, .builtInWideAngleCamera], mediaType: .video, position: .back).devices.first {
                backCamera = device
                if let bInput = try? AVCaptureDeviceInput(device: backCamera) {
                    backInput = bInput
                    captureSession.addInput(backInput)
                } else {
                    createErrorView(error: "Could not add output to capture session")
                }
            } else {
                createErrorView(error: "Could not find back camera")
            }
        } else {
            if let device = AVCaptureDevice.default(.builtInWideAngleCamera, for: .video, position: .back) {
                backCamera = device
                if let bInput = try? AVCaptureDeviceInput(device: backCamera) {
                    backInput = bInput
                    captureSession.addInput(backInput)
                } else {
                    createErrorView(error: "Could not add output to capture session")
                }
            } else {
                createErrorView(error: "Could not find back camera")
            }
        }
    }

    func setupOutput() {
        videoOutput = AVCaptureVideoDataOutput()
        let videoQueue = DispatchQueue(label: "videoQueue", qos: .userInteractive)
        videoOutput.setSampleBufferDelegate(self, queue: videoQueue)
        if captureSession.canAddOutput(videoOutput) {
            captureSession.addOutput(videoOutput)
        }
        videoOutput.connection(with: AVMediaType.video)?.videoOrientation = .portrait
        if captureSession.canAddOutput(photoOutput) {
            captureSession.addOutput(photoOutput)
        }
    }

    func setupPreviewLayer() {
        cameraLayer = AVCaptureVideoPreviewLayer(session: captureSession)
        cameraLayer.videoGravity = .resizeAspectFill
        self.layer.insertSublayer(cameraLayer, at: 0)
    }

    private func setupCaptureSession() {
        self.captureSession = AVCaptureSession()
        self.captureSession.beginConfiguration()
        if self.captureSession.canSetSessionPreset(.photo) {
            self.captureSession.sessionPreset = .photo
        } else {
            createErrorView(error: "capture device not working")
        }
        self.setupInput()
        self.setupPreviewLayer()
        self.setupOutput()
        self.captureSession.commitConfiguration()
        self.captureSession.startRunning()
    }

    private func createErrorView(error: String) {
        let label = UILabel(frame: self.frame)
        label.text = error
        self.addSubview(label)
    }

    @objc func captureImage() {
        self.photoOutput.capturePhoto(with: AVCapturePhotoSettings(), delegate: self)
    }

    @available(iOS 11.0, *)
    func photoOutput(_ output: AVCapturePhotoOutput, didFinishProcessingPhoto photo: AVCapturePhoto, error: Error?) {
        if let error = error {
            print("Error capturing photo: \(error)")
            return
        }
        guard let image = photo.cgImageRepresentation()?.takeUnretainedValue() else { print("Could not get imageData"); return }
        let colorSpace: CGColorSpace = image.colorSpace ?? CGColorSpace(name: CGColorSpace.sRGB)!
        guard let context = CGContext(
                data: nil,
                width: image.height,
                height: image.width,
                bitsPerComponent: image.bitsPerComponent,
                bytesPerRow: image.bytesPerRow,
                space: colorSpace,
                bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)
        else {
            print("Could not create context to rotate image, resolving with unrotated image");
            let bitmapImage = BitmapImage(image: image)
            let ref = JSContext.wrapObject(object: bitmapImage).getJSRef()
            if let onCapture = onCapture {
                onCapture(ref)
            }
            return
        }
        context.translateBy(x: CGFloat(image.width)/2, y: CGFloat(image.height)/2)
        context.rotate(by: -CGFloat.pi/2)
        context.translateBy(x: CGFloat(image.height)/(-2) - (CGFloat(image.width - image.height)), y: CGFloat(image.width)/(-2))
        context.draw(image, in: CGRect(origin: .zero, size: CGSize(width: image.width, height: image.height)))
        if let rotatedImage = context.makeImage() {
            let bitmapImage = BitmapImage(image: rotatedImage)
            let ref = JSContext.wrapObject(object: bitmapImage).getJSRef()
            if let onCapture = onCapture {
                onCapture(ref)
            }
        } else {
            print("Error making image")
        }
    }

    func captureOutput(_ output: AVCaptureOutput, didOutput sampleBuffer: CMSampleBuffer, from connection: AVCaptureConnection) {
        guard let onFrame = onFrame else { return }
        guard let cvBuffer = CMSampleBufferGetImageBuffer(sampleBuffer) else {
            print("Could not get sample buffer")
            return
            //TODO(T92857704) Eventually forward Error to React Native using promises
        }
        let ciImage = CIImage(cvImageBuffer: cvBuffer)
        let bitmapImage = BitmapImage(image: ciImage)
        let ref = JSContext.wrapObject(object: bitmapImage).getJSRef()
        onFrame(ref)
    }
}
