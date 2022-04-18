/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Foundation

@objc(CameraManager)
class CameraManager: RCTViewManager {

  override func view() -> UIView! {
    let cameraView = CameraView()
    cameraView.openCamera()
    return cameraView
  }

  @objc func takePicture(_ reactTag: NSNumber) {
    self.bridge!.uiManager.addUIBlock { (_: RCTUIManager?, viewRegistry: [NSNumber: UIView]?) in
      guard let view: CameraView = viewRegistry?[reactTag] as? CameraView else {
          return
      }
      view.captureImage()
    }
  }

  @objc func flip(_ reactTag: NSNumber) {
    self.bridge!.uiManager.addUIBlock { (_: RCTUIManager?, viewRegistry: [NSNumber: UIView]?) in
      guard let view: CameraView = viewRegistry?[reactTag] as? CameraView else {
          return
      }
      view.flipCamera()
    }
  }
}
