/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Foundation
import UIKit

@objc(ImageModule)
public class ImageModule: NSObject {
    @objc
    public func getName() -> String {
        return "PyTorchCoreImageModule"
    }

    @objc(fromURL:resolver:rejecter:)
    public func fromURL(_ urlString: NSString,
                        resolver resolve: RCTPromiseResolveBlock,
                        rejecter reject: RCTPromiseRejectBlock) {
        if let cfURL = CFURLCreateWithString(nil, urlString, nil),
        let imageSource = CGImageSourceCreateWithURL(cfURL, nil),
        let image = CGImageSourceCreateImageAtIndex(imageSource, 0, nil) {
            let bitmapImage = Image(image: image)
            let ref = JSContext.wrapObject(object: bitmapImage).getJSRef()
            resolve(ref)
        } else {
            reject(RCTErrorUnspecified, "Couldn't create image from URL", nil)
        }
    }

    @objc(fromFile:resolver:rejecter:)
    public func fromFile(_ filepath: NSString,
                         resolver resolve: RCTPromiseResolveBlock,
                         rejecter reject: RCTPromiseRejectBlock) {
        let path = filepath as String
        let url = URL(fileURLWithPath: path)
        do {
            let data = try Data(contentsOf: url)
            guard let uiImage = UIImage(data: data), let cgImage = uiImage.cgImage else {
                reject(RCTErrorUnspecified, "Couldn't load image \(path)", nil)
                return
            }
            let image = Image(image: cgImage)
            let ref = JSContext.wrapObject(object: image).getJSRef()
            resolve(ref)
        } catch {
            reject(RCTErrorUnspecified, "Couldn't load file \(path)", nil)
        }
    }

    @objc(fromBundle:resolver:rejecter:)
    public func fromBundle(_ assetImage: NSDictionary,
                           resolver resolve: RCTPromiseResolveBlock,
                           rejecter reject: RCTPromiseRejectBlock) {
        DispatchQueue.main.sync {
            if let dictionary = assetImage as? [AnyHashable: Any] {
                let uiImage = Macros.toUIImage(dictionary)
                if let cgImage = uiImage.cgImage {
                    let bitmapImage = Image(image: cgImage)
                    let ref = JSContext.wrapObject(object: bitmapImage).getJSRef()
                    resolve(ref)
                }
            } else {
                reject(RCTErrorUnspecified, "Couldn't create image from bundle", nil)
            }
        }
    }

    @objc(fromImageData:scaled:resolver:rejecter:)
    public func fromImageData(_ imageDataRef: NSDictionary,
                              scaled: Bool,
                              resolver resolve: RCTPromiseResolveBlock,
                              rejecter reject: RCTPromiseRejectBlock) {
        DispatchQueue.main.sync {
            do {
                let imageData = try JSContextUtils.unwrapObject(imageDataRef, ImageData.self)

                var image: IImage
                if scaled {
                    let bitmap = try imageData.getScaledBitmap()
                    image = Image(image: bitmap)
                } else {
                    let pixelDensity = UIScreen.main.scale
                    image = Image(imageData: imageData, pixelDensity: pixelDensity)
                }

                let ref = JSContext.wrapObject(object: image).getJSRef()
                resolve(ref)
            } catch {
                reject(RCTErrorUnspecified, "Could't create image from image data: \(error)", error)
            }
        }
    }

    @objc(toFile:resolver:rejecter:)
    public func toFile(_ imageRef: NSDictionary,
                       resolver resolve: RCTPromiseResolveBlock,
                       rejecter reject: RCTPromiseRejectBlock) {
        do {
            let image = try JSContextUtils.unwrapObject(imageRef, IImage.self)
            guard let bitmap = image.getBitmap() else {
                print("Could not get bitmap from image")
                return
            }
            let uiImage = UIImage(cgImage: bitmap)
            if let data = uiImage.pngData() {
                let uuidFilename = NSUUID().uuidString
                let filename = getDocumentsDirectory().appendingPathComponent("\(uuidFilename).png")
                try? data.write(to: filename)
                resolve(filename.path)
            }
        } catch {
            reject(RCTErrorUnspecified, "Invalid image reference \(error)", error)
            return
        }
    }

    func getDocumentsDirectory() -> URL {
        let paths = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)
        return paths[0]
    }

    @objc
    public func getWidth(_ imageRef: NSDictionary) -> Any {
        do {
            let image = try JSContextUtils.unwrapObject(imageRef, IImage.self)
            return NSNumber(value: Float(image.getWidth()))
        } catch {
            print("Invalid image reference in getWidth")
            return -1
        }
    }

    @objc
    public func getHeight(_ imageRef: NSDictionary) -> Any {
        do {
            let image = try JSContextUtils.unwrapObject(imageRef, IImage.self)
            return NSNumber(value: Float(image.getHeight()))
        } catch {
            print("Invalid image reference in getHeight")
            return -1
        }
    }

    @objc(scale:sx:sy:resolver:rejecter:)
    public func scale(_ imageRef: NSDictionary,
                      sx: NSNumber,
                      sy: NSNumber,
                      resolver resolve: RCTPromiseResolveBlock,
                      rejecter reject: RCTPromiseRejectBlock) {
        do {
            let image = try JSContextUtils.unwrapObject(imageRef, IImage.self)
            let scaledImage = try image.scale(sx: CGFloat(truncating: sx), sy: CGFloat(truncating: sy))
            let ref = JSContext.wrapObject(object: scaledImage).getJSRef()
            resolve(ref)
        } catch {
            reject(RCTErrorUnspecified, "Invalid image reference in scale: \(error)", error)
        }
    }

    @objc(release:resolver:rejecter:)
    public func release(_ imageRef: NSDictionary,
                        resolver resolve: RCTPromiseResolveBlock,
                        rejecter reject: RCTPromiseRejectBlock) {
        do {
            if let imageRef = imageRef as? [ String: String] {
                try JSContext.release(jsRef: imageRef)
            }
            resolve(nil)
        } catch {
            reject(RCTErrorUnspecified, "Invalid image reference in release: \(error)", error)
        }
    }

    @objc(wrapImage:)
    public static func wrapImage(_ image: UIImage) -> NSString? {
      if let cgImage = image.cgImage {
        let bitmapImage = Image(image: cgImage)
        let ref = JSContext.wrapObject(object: bitmapImage).getJSRef()
        return ref["ID"]! as NSString
      } else {
        return nil
      }
    }
}
