/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface TensorWrapper : NSObject

- (instancetype) initFromBlob:(void *)data shape:(NSArray<NSNumber*>*)shapeArray dtype:(NSString *)dtype;
- (void *) buffer;
- (NSArray<NSNumber*>*) shape;
- (int64_t) numel;
- (int) argmax;
- (NSArray *) toFloatArray;
- (NSString *) getDtype;

@end

NS_ASSUME_NONNULL_END
