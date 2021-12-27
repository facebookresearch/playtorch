/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <Foundation/Foundation.h>

@class PTMIValue;

NS_ASSUME_NONNULL_BEGIN

NS_SWIFT_NAME(Module)
@interface PTMModule : NSObject

+ (instancetype)new NS_UNAVAILABLE;
- (instancetype)init NS_UNAVAILABLE;

+ (nullable instancetype)load:(NSString *)filePath extraFiles:(NSMutableDictionary<NSString *, NSString *> *)extraFiles;
- (nullable PTMIValue *)forward:(NSArray<PTMIValue *> *)ivalues;
@end

NS_ASSUME_NONNULL_END
