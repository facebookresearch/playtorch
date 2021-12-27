/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

typedef NS_ENUM(NSUInteger, PTMTensorType) {
    PTMTensorTypeLong,
    PTMTensorTypeFloat,
    PTMTensorTypeUndefined,
};

NS_SWIFT_NAME(Tensor)

@interface PTMTensor : NSObject

@property(nonatomic, readonly) PTMTensorType dtype;
@property(nonatomic, readonly) NSArray<NSNumber*> *shape;
@property(nonatomic, readonly) int64_t numel;
@property(nonatomic, readonly) void* buffer;

+ (instancetype)new NS_UNAVAILABLE;
- (instancetype)init NS_UNAVAILABLE;

+ (nullable instancetype)fromBlob:(void *)data shape:(NSArray<NSNumber*>*)shape dtype:(PTMTensorType)dtype NS_SWIFT_NAME(fromBlob(data:shape:dtype:));

- (nullable NSArray<NSNumber *> *)getDataAsArray;
- (nullable NSArray<NSNumber *> *)getDataAsArrayBert;

@end

NS_ASSUME_NONNULL_END
