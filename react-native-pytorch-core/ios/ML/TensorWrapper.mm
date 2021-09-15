/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "TensorWrapper.h"
#import <LibTorch/LibTorch.h>

@implementation TensorWrapper {
    @protected
    at::Tensor _tensor;
    NSString* _dtype;
}

- (instancetype) initFromBlob:(void *)data shape:(NSArray<NSNumber*>*)shapeArray dtype:(NSString *)dtype {
    self = [super init];
    if (self) {
      try {
          std::vector<int64_t> shape = {};
          for (NSNumber * n in shapeArray) {
            int64_t num = n.intValue;
            shape.push_back(num);
          }
          _dtype = dtype;
          _tensor = at::empty(shape);
          if([_dtype isEqualToString:@"float"]){
              //eventually add other cases that do essentially the same thing, but with another type
              memcpy(_tensor.data_ptr<float>(), data, sizeof(float) * _tensor.numel());;
          } else {
              NSException* exception = [NSException exceptionWithName:@"InvalidDtype" reason:@"The provided dtype is not a recognized data type" userInfo:nil];
              throw exception;
          }
          
      } catch (const std::exception& exception) {
        NSLog(@"%s", exception.what());
        return nil;
      }
    }
    return self;
}

- (void *) buffer {
    if([_dtype isEqualToString:@"float"]){ //eventually add other cases that return the same thing, but with a different type of data pointer
            return _tensor.data_ptr<float>();
    } else {
        NSException* exception = [NSException exceptionWithName:@"InvalidDtype" reason:@"The provided dtype is not a recognized data type" userInfo:nil];
        throw exception;
    }
}

- (NSArray<NSNumber*>*) shape {
    NSMutableArray * shapeArray = [NSMutableArray new];
    std::vector<int64_t> shapeVector = _tensor.sizes().vec();
    for (int i = 0; i < shapeVector.size(); i++) {
        NSNumber * n = @(shapeVector[i]);
        [shapeArray addObject:(n)];
    }
    return shapeArray;
}

- (int64_t) numel {
    return _tensor.numel();
}

- (int) argmax {
    int maxIdx = 0;
    if ([_dtype isEqualToString:@"float"]){ //eventually add other cases with different types for buffer and maxVal
        float* buffer = _tensor.data_ptr<float>();
        float maxVal = buffer[0];
        for(int i = 0; i < _tensor.numel(); i++) {
            if (buffer[i] > maxVal) {
                maxVal = buffer[i];
                maxIdx = i;
            }
        }
    } else {
        NSException* exception = [NSException exceptionWithName:@"InvalidDtype" reason:@"The provided dtype is not a recognized data type" userInfo:nil];
        throw exception;
    }
    return maxIdx;
}

- (NSArray *) toFloatArray {
    if ([_dtype isEqualToString:@"float"]){ //eventually add other cases with different types for buffer and maxVal
        NSMutableArray *values = [[NSMutableArray alloc] initWithCapacity: 0];
        float* buffer = _tensor.data_ptr<float>();
        for(int i = 0; i < _tensor.numel(); i++) {
            [values addObject: [NSNumber numberWithFloat: buffer[i]]];
        }
        return values;
    } else {
        NSException* exception = [NSException exceptionWithName:@"InvalidDtype" reason:@"The provided dtype is not a recognized data type" userInfo:nil];
        throw exception;
    }
}

- (NSString *) getDtype {
    return _dtype;
}

@end
