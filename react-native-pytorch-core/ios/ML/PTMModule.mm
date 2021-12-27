/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "PTMModule.h"
#import "PTMTensor.h"
#import "PTMIValue.h"
#import "PTMIValue+Internal.h"
#import <LibTorch-Lite/LibTorch-Lite.h>

@implementation PTMModule {
    torch::jit::mobile::Module _module;
}

+ (nullable instancetype)load:(NSString *)filePath extraFiles:(NSMutableDictionary<NSString *, NSString *> *)extraFiles {
    if (filePath.length == 0) {
        return nil;
    }
    try {
        std::unordered_map<std::string, std::string> extra_files;

        for (NSString* key in extraFiles) {
            NSString* value = [extraFiles objectForKey: key];
            std::string _key = std::string([key UTF8String]);
            std::string _value = std::string([value UTF8String]);
            extra_files[_key] = _value;
        }

        PTMModule *module = [PTMModule new];
        module->_module = torch::jit::_load_for_mobile(filePath.UTF8String, torch::kCPU, extra_files);

        for (std::pair<std::string, std::string> element : extra_files) {
            std::string _key = element.first;
            std::string _value = element.second;
            NSString *key = [NSString stringWithCString:_key.c_str() encoding:[NSString defaultCStringEncoding]];
            NSString *value = [NSString stringWithCString:_value.c_str() encoding:[NSString defaultCStringEncoding]];
            [extraFiles setValue: value forKey:key];
        }
        return module;
    } catch (const std::exception& exception) {
        NSLog(@"%s", exception.what());
        return nil;
    }
}

- (PTMIValue *)forward:(NSArray<PTMIValue *> *)ivalues {
    std::vector<at::IValue> inputs;
    for (PTMIValue *value in ivalues) {
        at::IValue atValue = value.ivalue;
        inputs.push_back(atValue);
    }
    try {
        c10::InferenceMode guard;
        auto result = _module.forward(inputs);
        PTMIValue *ptmIValue = [PTMIValue fromIValue:result];
        return ptmIValue;
    } catch (const std::exception& exception) {
        NSLog(@"%s", exception.what());
    }
    return nil;
}

@end
