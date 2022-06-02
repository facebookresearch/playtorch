/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Foundation

struct ShapeLayer {

  static func hollowCircleLayer(rect: CGRect, innerRingFactor: CGFloat, lineWidth: CGFloat) -> CAShapeLayer {
    precondition(rect.width == rect.height, "rectangle need to be a square")

    let hollowCircleLayer = CAShapeLayer()

    let inset = (1 - innerRingFactor) * rect.width / 2
    let innerRect = rect.insetBy(dx: inset, dy: inset)
    let outerCirclePath = UIBezierPath(ovalIn: rect)
    outerCirclePath.lineWidth = lineWidth
    let innerCirclePath = UIBezierPath(ovalIn: innerRect)
    innerCirclePath.lineWidth = lineWidth

    outerCirclePath.append(innerCirclePath)
    outerCirclePath.addClip()
    outerCirclePath.usesEvenOddFillRule = true

    hollowCircleLayer.path = outerCirclePath.cgPath
    hollowCircleLayer.fillColor = UIColor.white.cgColor
    hollowCircleLayer.strokeColor = UIColor.clear.cgColor
    hollowCircleLayer.fillRule = .evenOdd
    return hollowCircleLayer
  }

  // this path is animatable to a square
  static func squareAnimatableCircleLayer(rect: CGRect, fillColor: CGColor) -> CAShapeLayer {
    precondition(rect.width == rect.height, "rectangle need to be a square")
    let radius = rect.width / 2
    let center = CGPoint(x: rect.midX, y: rect.midY)
    let circleLayer = CAShapeLayer()

    let circlePath = UIBezierPath()
    circlePath.addArc(withCenter: center,
                      radius: radius,
                      startAngle: -CGFloat(Double.pi),
                      endAngle: -CGFloat(Double.pi/2),
                      clockwise: true)
    circlePath.addArc(withCenter: center,
                      radius: radius,
                      startAngle: -CGFloat(Double.pi/2),
                      endAngle: 0,
                      clockwise: true)
    circlePath.addArc(withCenter: center,
                      radius: radius,
                      startAngle: 0,
                      endAngle: CGFloat(Double.pi/2),
                      clockwise: true)
    circlePath.addArc(withCenter: center,
                      radius: radius,
                      startAngle: CGFloat(Double.pi/2),
                      endAngle: CGFloat(Double.pi),
                      clockwise: true)
    circlePath.close()

    circleLayer.path = circlePath.cgPath
    circleLayer.fillColor = fillColor
    circleLayer.fillRule = .evenOdd

    return circleLayer
  }

  static func squarePathWithCenter(center: CGPoint, side: CGFloat) -> UIBezierPath {
    let squarePath = UIBezierPath()
    let startX = center.x - side / 2
    let startY = center.y - side / 2
    squarePath.move(to: CGPoint(x: startX, y: startY))
    squarePath.addLine(to: squarePath.currentPoint)
    squarePath.addLine(to: CGPoint(x: startX + side, y: startY))
    squarePath.addLine(to: squarePath.currentPoint)
    squarePath.addLine(to: CGPoint(x: startX + side, y: startY + side))
    squarePath.addLine(to: squarePath.currentPoint)
    squarePath.addLine(to: CGPoint(x: startX, y: startY + side))
    squarePath.addLine(to: squarePath.currentPoint)
    squarePath.close()
    return squarePath
  }

}
