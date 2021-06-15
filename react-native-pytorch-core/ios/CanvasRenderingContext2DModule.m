/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTConvert.h>


@interface RCT_EXTERN_REMAP_MODULE(PyTorchCoreCanvasRenderingContext2DModule, CanvasRenderingContext2D, NSObject)

RCT_EXTERN_METHOD(fillRect:(nonnull NSDictionary)canvasRef x:(nonnull NSNumber)x y:(nonnull NSNumber)y width:(nonnull NSNumber)width height:(nonnull NSNumber)height);
RCT_EXTERN_METHOD(strokeRect:(nonnull NSDictionary)canvasRef x:(nonnull NSNumber)x y:(nonnull NSNumber)y width:(nonnull NSNumber)width height:(nonnull NSNumber)height);
RCT_EXTERN_METHOD(rect:(nonnull NSDictionary)canvasRef x:(nonnull NSNumber)x y:(nonnull NSNumber)y width:(nonnull NSNumber)width height:(nonnull NSNumber)height);
RCT_EXTERN_METHOD(arc:(nonnull NSDictionary)canvasRef x:(nonnull NSNumber)x y:(nonnull NSNumber)y radius:(nonnull NSNumber)radius startAngle:(nonnull NSNumber)startAngle endAngle:(nonnull NSNumber)endAngle counterclockwise:(nonnull BOOL)counterclockwise);
RCT_EXTERN_METHOD(clear:(nonnull NSDictionary)canvasRef);
RCT_EXTERN_METHOD(clearRect:(nonnull NSDictionary)canvasRef x:(nonnull NSNumber)x y:(nonnull NSNumber)y width:(nonnull NSNumber)width height:(nonnull NSNumber)height);
RCT_EXTERN_METHOD(invalidate:(nonnull NSDictionary)canvasRef);
RCT_EXTERN_METHOD(stroke:(nonnull NSDictionary)canvasRef);

@end

