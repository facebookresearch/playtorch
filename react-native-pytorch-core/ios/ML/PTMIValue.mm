/*
 * Copyright (c) Facebook, Inc. and its affiliates.
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

@end
