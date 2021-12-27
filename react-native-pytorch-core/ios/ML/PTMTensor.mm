/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "PTMTensor.h"
#import "PTMTensor+Internal.h"

@implementation PTMTensor {
    at::Tensor _tensor;
}

+ (instancetype)fromTensor:(const at::Tensor&)tensor {
    PTMTensor *ptmTensor = [PTMTensor new];
    ptmTensor->_tensor = tensor;
    return ptmTensor;
}

+ (nullable instancetype)fromBlob:(void *)data shape:(NSArray<NSNumber*>*)shape dtype:(PTMTensorType)dtype {
    std::vector<int64_t> shapeVector = {};
    for (NSNumber * n in shape) {
        int64_t num = n.intValue;
        shapeVector.push_back(num);
    }
    at::Tensor tensor;
    switch (dtype) {
      case PTMTensorTypeFloat:
          tensor = torch::from_blob(data, shapeVector, at::kFloat);
          break;
      case PTMTensorTypeLong:
          tensor = torch::from_blob(data, shapeVector, at::kLong);
          break;
      case PTMTensorTypeUndefined:
        return nil;
    }
    return [PTMTensor fromTensor:tensor.clone()];
}

- (void *)buffer {
    switch ([self dtype]) {
        case PTMTensorTypeFloat:
            return _tensor.data_ptr<float>();
        case PTMTensorTypeLong:
            return _tensor.data_ptr<int64_t>();
        case PTMTensorTypeUndefined:
        return nil;
    }
    return nil;
}

- (NSArray<NSNumber*>*)shape {
    NSMutableArray * shapeArray = [NSMutableArray new];
    std::vector<int64_t> shapeVector = _tensor.sizes().vec();
    for (int i = 0; i < shapeVector.size(); i++) {
        NSNumber *n = @(shapeVector[i]);
        [shapeArray addObject:n];
    }
    return [shapeArray copy];
}

- (int64_t)numel {
    return _tensor.numel();
}

- (PTMTensorType)dtype {
    auto type = _tensor.dtype();
    if (type == at::kFloat) {
        return PTMTensorTypeFloat;
    } else if (type == at::kLong) {
        return PTMTensorTypeLong;
    }
    return PTMTensorTypeUndefined;
}

- (nullable NSArray<NSNumber *> *)getDataAsArray {
    NSMutableArray *values = [NSMutableArray array];
    switch ([self dtype]) {
        case PTMTensorTypeFloat: {
            float* buffer = _tensor.data_ptr<float>();
            for (int i = 0; i < _tensor.numel(); i++) {
                [values addObject: [NSNumber numberWithFloat:buffer[i]]];
            }
            break;
        }
        case PTMTensorTypeLong: {
            int64_t* buffer = _tensor.data_ptr<int64_t>();
            for (int i = 0; i < _tensor.numel(); i++) {
                [values addObject: [NSNumber numberWithLongLong:buffer[i]]];
            }
            break;
        }
        case PTMTensorTypeUndefined: {
          return nil;
        }
    }
    return [values copy];
}

- (nullable NSArray<NSNumber *> *)getDataAsArrayBert {
    if (_tensor.dtype() != at::kFloat) {
        return nil;
    }
    
    NSMutableArray *values = [NSMutableArray array];
    float* buffer = _tensor.data_ptr<float>();
    for (int i = 0; i < _tensor.numel(); i++) {
        [values addObject: [NSNumber numberWithFloat:buffer[i*2]]];
    }
    return [values copy];
}

@end
