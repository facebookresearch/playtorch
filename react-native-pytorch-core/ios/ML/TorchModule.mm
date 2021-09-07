/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "TorchModule.h"
#import <LibTorch/LibTorch.h>

@implementation TorchModule {
@protected
    torch::jit::script::Module _impl;
}

- (nullable instancetype)initWithFileAtPath:(NSString*)filePath {
    self = [super init];
    if (self) {
        try {
            _impl = torch::jit::load(filePath.UTF8String);
            _impl.eval();
        } catch (const std::exception& exception) {
            NSLog(@"%s", exception.what());
            return nil;
        }
    }
    return self;
}

- (nullable instancetype)initWithFileAtPath:(NSString*)filePath extraFiles:(NSMutableDictionary<NSString *, NSString *>*)extraFiles {
    self = [super init];
    if (self) {
        try {
            std::unordered_map<std::string, std::string> extra_files;

            for (NSString* key in extraFiles) {
                NSString* value = [extraFiles objectForKey: key];
                std::string _key = std::string([key UTF8String]);
                std::string _value = std::string([value UTF8String]);
                extra_files[_key] = _value;
            }

            _impl = torch::jit::load(filePath.UTF8String, torch::kCPU, extra_files);
            _impl.eval();

            for (std::pair<std::string, std::string> element : extra_files) {
                std::string _key = element.first;
                std::string _value = element.second;
                NSString *key = [NSString stringWithCString:_key.c_str() encoding:[NSString defaultCStringEncoding]];
                NSString *value = [NSString stringWithCString:_value.c_str() encoding:[NSString defaultCStringEncoding]];
                [extraFiles setValue: value forKey:key];
            }
        } catch (const std::exception& exception) {
            NSLog(@"%s", exception.what());
            return nil;
        }
    }
    return self;
}

+ (nullable instancetype)load:(NSString *)filePath extraFiles:(NSMutableDictionary<NSString *, NSString *> *)extraFiles {
    return [[TorchModule alloc] initWithFileAtPath:filePath extraFiles: extraFiles];
}


- (TensorWrapper *)predictImage:(TensorWrapper *)tensorWrapper outputType:(NSString *)outputType {
    try {
        std::vector<int64_t> shape = {};
        for (NSNumber * n in [tensorWrapper shape]) {
            int64_t num = n.intValue;
            shape.push_back(num);
        }
        at::Tensor tensor;
        if([[tensorWrapper getDtype] isEqualToString:@"float"]) { //eventually add other cases that do the same thing, but with a different third parameter
            tensor = torch::from_blob([tensorWrapper buffer], shape, at::kFloat);
        } else {
            NSException* exception = [NSException exceptionWithName:@"InvalidDtype" reason:@"The provided dtype is not a recognized data type" userInfo:nil];
            throw exception;
        }
        torch::autograd::AutoGradMode guard(false);
        at::AutoNonVariableTypeMode non_var_type_mode(true);
        auto outputTensor = _impl.forward({tensor}).toTensor();
        NSMutableArray * shapeArray = [NSMutableArray new];
        std::vector<int64_t> shapeVector = outputTensor.sizes().vec();
        for (int i = 0; i < shapeVector.size(); i++) {
            NSNumber * n = @(shapeVector[i]);
            [shapeArray addObject:(n)];
        }
        TensorWrapper* outputTensorWrapper;
        if([outputType isEqualToString:@"float"]) { //eventually add other cases that do the same thing, but with a different type for the data pointer
            outputTensorWrapper = [[TensorWrapper new] initFromBlob:outputTensor.data_ptr<float>() shape: shapeArray dtype:@"float"];
        } else {
            NSException* exception = [NSException exceptionWithName:@"InvalidDtype" reason:@"The provided dtype is not a recognized data type" userInfo:nil];
            throw exception;
        }
        return outputTensorWrapper;
    } catch (const std::exception& exception) {
        NSLog(@"%s", exception.what());
    }
    return nil;
}

@end
