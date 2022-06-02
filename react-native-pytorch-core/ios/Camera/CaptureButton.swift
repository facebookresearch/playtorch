/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Foundation

class CaptureButton: UIButton {
  var hollowCircleLayer: CAShapeLayer?
  var innerCircleLayer: CAShapeLayer?
  var innerCircleLayerPath: CGPath?

  struct ViewConstants {
    static let ringLineWidth: CGFloat = 3
    static let extraPadding: CGFloat = 1 // extra padding between boarder and the circleView.
    static let innerSquareWidth: CGFloat = 25
    static let capturedRingInsect: CGFloat = 13

    // animation configuration
    static let ringExpandTime: Double = 0.3
    static let ringShrinkTime: Double = 0.2
    static let innerRingShrinkFactor: CGFloat = 0.85
    static let radiusExpandFactor: CGFloat = 1.3
    static let innerRingScaleFactor: CGFloat = 0.9
    static let captureButtonScaleFactor: CGFloat = 0.7
  }

  override init(frame: CGRect) {
    super.init(frame: frame)
    let tapGestureRecognizer = UITapGestureRecognizer(target: self, action: #selector(handleTap))
    self.addGestureRecognizer(tapGestureRecognizer)
  }

  required init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }

  override func layoutSubviews() {
    precondition(self.bounds.size.width == self.bounds.size.height, "the capture button frame needs to be square")

    let width = self.bounds.size.width
    super.layoutSubviews()

    if let hollowCircleLayer = hollowCircleLayer {
      hollowCircleLayer.frame = self.bounds
    } else {
      hollowCircleLayer = ShapeLayer.hollowCircleLayer(rect: self.bounds,
                                                       innerRingFactor: ViewConstants.innerRingScaleFactor,
                                                       lineWidth: ViewConstants.ringLineWidth)
      layer.addSublayer(hollowCircleLayer!)
      hollowCircleLayer!.frame = self.bounds
    }

    let innerRingPadding = (1 - ViewConstants.captureButtonScaleFactor) * width / 2
    let innerCircleBounds = self.bounds.insetBy(dx: innerRingPadding, dy: innerRingPadding)

    if let innerCircleLayer = innerCircleLayer {
      innerCircleLayer.bounds = innerCircleBounds
      innerCircleLayer.position = CGPoint(x: self.bounds.midX, y: self.bounds.midY)
    } else {
      innerCircleLayer = ShapeLayer.squareAnimatableCircleLayer(rect: innerCircleBounds,
                                                                fillColor: UIColor.white.cgColor)
      layer.addSublayer(innerCircleLayer!)
      innerCircleLayer!.bounds = innerCircleBounds
        innerCircleLayer!.position = CGPoint(x: self.bounds.midX, y: self.bounds.midY)
    }
  }

  @objc func handleTap(_ sender: UITapGestureRecognizer) {
    guard let innerCircleLayer = self.innerCircleLayer else {
      fatalError("animating a layer that hasn't been initiated")
    }

    let scaleAnimation = CABasicAnimation(keyPath: "transform.scale")
    scaleAnimation.fromValue = 1.0
    scaleAnimation.toValue = ViewConstants.innerRingShrinkFactor
    scaleAnimation.fillMode = CAMediaTimingFillMode.forwards
    scaleAnimation.duration = ViewConstants.ringShrinkTime
    scaleAnimation.autoreverses = true

    innerCircleLayer.add(scaleAnimation, forKey: "transform.scale")
  }
}
