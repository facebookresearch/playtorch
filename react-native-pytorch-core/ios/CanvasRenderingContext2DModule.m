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
RCT_EXTERN_METHOD(fill:(nonnull NSDictionary)canvasRef);
RCT_EXTERN_METHOD(scale:(nonnull NSDictionary)canvasRef x:(nonnull NSNumber)x y:(nonnull NSNumber)y);
RCT_EXTERN_METHOD(rotate:(nonnull NSDictionary)canvasRef angle:(nonnull NSNumber)angle x:(nonnull NSNumber)x y:(nonnull NSNumber)y)
RCT_EXTERN_METHOD(translate:(nonnull NSDictionary)canvasRef x:(nonnull NSNumber)x y:(nonnull NSNumber)y);
RCT_EXTERN_METHOD(setTransform:(nonnull NSDictionary)canvasRef a:(nonnull NSNumber)a b:(nonnull NSNumber)b c:(nonnull NSNumber)c d:(nonnull NSNumber)d e:(nonnull NSNumber)e f:(nonnull NSNumber)f);
RCT_EXTERN_METHOD(setFillStyle:(nonnull NSDictionary)canvasRef color:(nonnull CGColor)color);
RCT_EXTERN_METHOD(setStrokeStyle:(nonnull NSDictionary)canvasRef color:(nonnull CGColor)color);
RCT_EXTERN_METHOD(save:(nonnull NSDictionary)canvasRef);
RCT_EXTERN_METHOD(restore:(nonnull NSDictionary)canvasRef);
RCT_EXTERN_METHOD(setLineWidth:(nonnull NSDictionary)canvasRef lineWidth:(nonnull NSNumber)lineWidth);
RCT_EXTERN_METHOD(setLineCap:(nonnull NSDictionary)canvasRef lineCap:(nonnull NSString)lineCap);
RCT_EXTERN_METHOD(setLineJoin:(nonnull NSDictionary)canvasRef lineJoin:(nonnull NSString)lineJoin);
RCT_EXTERN_METHOD(setMiterLimit:(nonnull NSDictionary)canvasRef miterLimit:(nonnull NSNumber)miterLimit);
RCT_EXTERN_METHOD(setFont:(nonnull NSDictionary)canvasRef font:(nonnull NSDictionary)font);
RCT_EXTERN_METHOD(beginPath:(nonnull NSDictionary)canvasRef);
RCT_EXTERN_METHOD(closePath:(nonnull NSDictionary)canvasRef);
RCT_EXTERN_METHOD(lineTo:(nonnull NSDictionary)canvasRef x:(nonnull NSNumber)x y:(nonnull NSNumber)y);
RCT_EXTERN_METHOD(moveTo:(nonnull NSDictionary)canvasRef x:(nonnull NSNumber)x y:(nonnull NSNumber)y);
RCT_EXTERN_METHOD(drawCircle:(nonnull NSDictionary)canvasRef x:(nonnull NSNumber)x y:(nonnull NSNumber)y radius:(nonnull NSNumber)radius);
RCT_EXTERN_METHOD(fillCircle:(nonnull NSDictionary)canvasRef x:(nonnull NSNumber)x y:(nonnull NSNumber)y radius:(nonnull NSNumber)radius);
RCT_EXTERN_METHOD(fillText:(nonnull NSDictionary)canvasRef text:(nonnull NSString)text x:(nonnull NSNumber)x y:(nonnull NSNumber)y);
RCT_EXTERN_METHOD(strokeText:(nonnull NSDictionary)canvasRef text:(nonnull NSString)text x:(nonnull NSNumber)x y:(nonnull NSNumber)y);
RCT_EXTERN_METHOD(setTextAlign:(nonnull NSDictionary)canvasRef textAlign:(nonnull NSString)textAlign);
RCT_EXTERN_METHOD(drawImage:(nonnull NSDictionary)canvasRef image:(nonnull NSDictionary)image sx:(nonnull NSNumber)sx sy:(nonnull NSNumber)sy sWidth:(nonnull NSNumber)sWidth sHeight:(nonnull NSNumber)sHeight dx:(nonnull NSNumber)dx dy:(nonnull NSNumber)dy dWidth:(nonnull NSNumber)dWidth dHeight:(nonnull NSNumber)dHeight);

@end

