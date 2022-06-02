/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Foundation
import AVFoundation
import UIKit
import VideoToolbox

@objc(CameraView)
class CameraView: UIView, AVCapturePhotoCaptureDelegate, AVCaptureVideoDataOutputSampleBufferDelegate {

    private let captureButtonSize = 75.0
    private let captureButtonMargin = 16.0
    private let flipCameraButtonSize = 36.0
    private let flipCameraButtonMargin = 30.0
    private let photoOutput = AVCapturePhotoOutput()
    private var videoOutput: AVCaptureVideoDataOutput!
    private var captureSession: AVCaptureSession!
    private var cameraLayer: AVCaptureVideoPreviewLayer!
    private var backCamera: AVCaptureDevice!
    private var backInput: AVCaptureInput!
    private var frontCamera: AVCaptureDevice!
    private var frontInput: AVCaptureInput!
    private var previousImageFrame: Image?
    @objc public var onCapture: RCTDirectEventBlock?
    @objc public var onFrame: RCTDirectEventBlock?
    @objc public var hideCaptureButton: Bool = false
    @objc public var hideFlipButton: Bool = false
    @objc public var targetResolution: NSDictionary = [ "width": 480, "height": 640]
    var captureButton: CaptureButton?
    var flipCameraButton: UIButton?
    var backCameraOn = true

    public func openCamera() {
        setupCaptureButton()
        setupFlipCameraButton()
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

    override func didSetProps(_ changedProps: [String]!) {
        captureButton?.isHidden = hideCaptureButton
        flipCameraButton?.isHidden = hideFlipButton
        if changedProps.contains("targetResolution") { setSessionPreset() }
    }

    override func layoutSubviews() {
        let height = self.bounds.height
        let width = self.bounds.width

        cameraLayer?.frame = CGRect(x: 0, y: 0, width: width, height: height)

        let captureButtonX = Double(width) / 2.0 - captureButtonSize / 2.0
        let captureButtonY = Double(height) - captureButtonSize - captureButtonMargin

        captureButton?.frame = CGRect(x: captureButtonX,
                                      y: captureButtonY,
                                      width: captureButtonSize,
                                      height: captureButtonSize)

        let flipCameraButtonX = Double(width) - flipCameraButtonMargin - flipCameraButtonSize
        let flipCameraButtonY = Double(height) -
            captureButtonMargin -
            (captureButtonSize - flipCameraButtonSize) / 2.0 -
            flipCameraButtonSize

        flipCameraButton?.frame = CGRect(x: flipCameraButtonX,
                                         y: flipCameraButtonY,
                                         width: flipCameraButtonSize,
                                         height: flipCameraButtonSize)
        captureButton?.isHidden = hideCaptureButton
        flipCameraButton?.isHidden = hideFlipButton
    }

    func setSessionPreset() {
        if let captureSession = captureSession,
           let width = (targetResolution["width"] as? NSNumber)?.intValue,
           let height = (targetResolution["height"] as? NSNumber)?.intValue {
            if width <= 288 && height <= 352 {
                captureSession.sessionPreset = .cif352x288
            } else if width <= 480 && height <= 640 {
                captureSession.sessionPreset = .vga640x480
            } else if width <= 720 && height <= 1280 {
                captureSession.sessionPreset = .hd1280x720
            } else if width <= 1080 && height <= 1920 {
                captureSession.sessionPreset = .hd1920x1080
            } else {
                captureSession.sessionPreset = .hd4K3840x2160
            }
        }
    }

    func setupCaptureButton() {
        let xPos = Double(self.bounds.width) / 2.0 - captureButtonSize / 2.0
        let yPos = Double(self.bounds.height) - captureButtonSize - captureButtonMargin
        let frame = CGRect(x: xPos, y: yPos, width: captureButtonSize, height: captureButtonSize)
        captureButton = CaptureButton(frame: frame)
        captureButton?.isHidden = hideCaptureButton
        captureButton?.addTarget(self, action: #selector(captureImage), for: .touchDown)
        if let captureButton = captureButton {
            self.addSubview(captureButton)
        }
    }

    func setupFlipCameraButton() {
        if flipCameraButton?.superview != nil {
            flipCameraButton?.removeFromSuperview()
        }

        let xPos = Double(self.bounds.width) - flipCameraButtonMargin
        let yPos = Double(self.bounds.height) -
            captureButtonMargin -
            (captureButtonSize - flipCameraButtonSize) / 2.0 -
            flipCameraButtonSize

        flipCameraButton = UIButton()
        flipCameraButton?.tintColor = UIColor.white
        flipCameraButton?.frame = CGRect(x: xPos,
                                         y: yPos,
                                         width: flipCameraButtonSize,
                                         height: flipCameraButtonSize)
        flipCameraButton?.isHidden = hideFlipButton
        flipCameraButton?.addTarget(self, action: #selector(flipCamera), for: .touchDown)

        let bundle = Bundle(for: CameraView.self)
        if let url = bundle.url(forResource: "PyTorchCore", withExtension: "bundle") {
            let coreBundle = Bundle(url: url)
            let flipCameraImage = UIImage(named: "FlipCamera", in: coreBundle, compatibleWith: nil)
            flipCameraButton?.setImage(flipCameraImage, for: .normal)
        }

        if let flipCameraButton = flipCameraButton {
            self.addSubview(flipCameraButton)
        }
    }

    func setupInput() {
        if #available(iOS 10.2, *) {
            if let device = AVCaptureDevice.DiscoverySession(deviceTypes: [.builtInDualCamera, .builtInWideAngleCamera],
                                                             mediaType: .video,
                                                             position: .back).devices.first {
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

        if let device = AVCaptureDevice.default(.builtInWideAngleCamera, for: .video, position: .front) {
            frontCamera = device
            if let fInput = try? AVCaptureDeviceInput(device: frontCamera) {
                frontInput = fInput
            } else {
                print("could not create front input")
            }
        } else {
            print("no front camera")
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
        self.setSessionPreset()
        self.captureSession.commitConfiguration()
        self.captureSession.startRunning()
    }

    private func createErrorView(error: String) {
        let label = UILabel(frame: self.frame)
        label.text = error
        self.addSubview(label)
    }

    @objc func flipCamera() {
        flipCameraButton?.isUserInteractionEnabled = false
        captureSession.beginConfiguration()
        if backCameraOn {
            captureSession.removeInput(backInput)
            captureSession.addInput(frontInput)
            backCameraOn = false
        } else {
            captureSession.removeInput(frontInput)
            captureSession.addInput(backInput)
            backCameraOn = true
        }
        videoOutput.connection(with: AVMediaType.video)?.videoOrientation = .portrait
        captureSession.commitConfiguration()
        flipCameraButton?.isUserInteractionEnabled = true
    }

    @objc func captureImage() {
        let photoSettings =
            AVCapturePhotoSettings(format: [kCVPixelBufferPixelFormatTypeKey as String: Int(kCVPixelFormatType_32BGRA)])
        self.photoOutput.capturePhoto(with: photoSettings, delegate: self)
    }

    @available(iOS 11.0, *)
    func photoOutput(_ output: AVCapturePhotoOutput, didFinishProcessingPhoto photo: AVCapturePhoto, error: Error?) {
        if let error = error {
            print("Error capturing photo: \(error)")
            return
        }
        guard let image: CGImage = photo.cgImageRepresentation() else { print("Could not get imageData"); return }
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
            print("Could not create context to rotate image, resolving with unrotated image")
            let bitmapImage = Image(image: image)
            let ref = JSContext.wrapObject(object: bitmapImage).getJSRef()
            if let onCapture = onCapture {
                onCapture(ref)
            }
            return
        }
        context.translateBy(x: CGFloat(image.width)/2, y: CGFloat(image.height)/2)
        context.rotate(by: -CGFloat.pi/2)
        context.translateBy(x: CGFloat(image.height)/(-2) - (CGFloat(image.width - image.height)),
                            y: CGFloat(image.width)/(-2))
        context.draw(image, in: CGRect(origin: .zero, size: CGSize(width: image.width, height: image.height)))
        if let rotatedImage = context.makeImage() {
            let bitmapImage = Image(image: rotatedImage)
            let ref = JSContext.wrapObject(object: bitmapImage).getJSRef()
            if let onCapture = onCapture {
                onCapture(ref)
            }
        } else {
            print("Error making image")
        }
    }

    func captureOutput(_ output: AVCaptureOutput,
                       didOutput sampleBuffer: CMSampleBuffer,
                       from connection: AVCaptureConnection) {
        // Check if the previous image frame was released in JavaScript. If the
        // image was not released, then the closed flag in the image frame is
        // false and the current frame will be skipped to avoid the data
        // processing pipeline from congesting.
        if previousImageFrame != nil && previousImageFrame!.isClosed() == false {
            return
        }
        guard let onFrame = onFrame else { return }
        guard let cvBuffer = CMSampleBufferGetImageBuffer(sampleBuffer) else {
            print("Could not get sample buffer")
            return
            // TODO(T92857704) Eventually forward Error to React Native using promises
        }
        let ciImage = CIImage(cvImageBuffer: cvBuffer)
        let imageFrame = Image(image: ciImage)
        let ref = JSContext.wrapObject(object: imageFrame).getJSRef()
        previousImageFrame = imageFrame
        onFrame(ref)
    }
}
