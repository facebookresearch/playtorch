/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "PTMIValue.h"
#import "PTMTensor.h"
#import "PTMIValue+Internal.h"
#import "PTMTensor+Internal.h"

@implementation PTMIValue {
    at::IValue _ivalue;
}

+ (instancetype)fromIValue:(const at::IValue&)ivalue {
    PTMIValue *ptmIValue = [PTMIValue new];
    ptmIValue->_ivalue = ivalue;
    return ptmIValue;
}

+ (instancetype)fromTensor:(PTMTensor*)tensor {
    PTMIValue *ptmIValue = [PTMIValue new];
    ptmIValue->_ivalue = tensor.tensor;
    return ptmIValue;
}

- (BOOL)isTensor {
    return _ivalue.isTensor();
}

- (nullable PTMTensor*)toTensor {
    if (_ivalue.isTensor() == NO) {
        return nil;
    }
    
    at::Tensor tensor = _ivalue.toTensor();
    return [PTMTensor fromTensor:tensor];
}

- (nullable NSString*)toString {
    if (_ivalue.toString() == NO) {
        return nil;
    }
    
    auto answer = _ivalue.toString();
    return [NSString stringWithUTF8String:answer->string().c_str()];
}

- (nullable NSDictionary<NSString*, PTMIValue*>*)toDictStringKey {
    if (_ivalue.isGenericDict() == NO) {
        return nil;
    }
    
    auto dict = _ivalue.toGenericDict();
    auto keyType = dict.keyType();
    auto keyTypeKind = keyType->kind();

    if (keyTypeKind != c10::TypeKind::StringType) {
        return nil;
    }

    NSMutableDictionary<NSString*, PTMIValue*> *result = [NSMutableDictionary dictionary];
    for (auto const& pair : dict) {
        auto key = pair.key().toString()->string().c_str();
        auto value = pair.value();
        PTMIValue *valueIValue = [PTMIValue fromIValue:value];
        NSString *keyString = [NSString stringWithUTF8String:key];
        result[keyString] = valueIValue;
    }
    return [result copy];
}

@end
