/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@class PTMTensor;

NS_SWIFT_NAME(IValue)
@interface PTMIValue : NSObject

+ (instancetype)new NS_UNAVAILABLE;
- (instancetype)init NS_UNAVAILABLE;

+ (instancetype)fromTensor:(PTMTensor*)tensor;

- (BOOL)isTensor;

- (nullable PTMTensor*)toTensor;

- (nullable NSDictionary<NSString*, PTMIValue*>*)toDictStringKey;

- (nullable NSString*)toString;

@end

NS_ASSUME_NONNULL_END
