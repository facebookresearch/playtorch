/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "PTLEventEmitter.h"

@implementation PTLEventEmitter {
  BOOL _hasListeners;
}

RCT_EXPORT_MODULE();

// Singleton is needed here to make things work
// https://github.com/facebook/react-native/issues/15421
+ (instancetype)allocWithZone:(NSZone*)zone {
  static PTLEventEmitter* sharedInstance = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    sharedInstance = [super allocWithZone:zone];
  });
  return sharedInstance;
}

- (void)addGestureRecognizerToUIView:(UIView*)view {
  UILongPressGestureRecognizer* longPressRecognizer =
      [[UILongPressGestureRecognizer alloc]
          initWithTarget:self
                  action:@selector(_handleLongPress:)];
  longPressRecognizer.numberOfTouchesRequired = 2;
  [view addGestureRecognizer:longPressRecognizer];
}

- (NSArray<NSString*>*)supportedEvents {
  return @[ @"onTwoFingerLongPress" ];
}

// Will be called when this module's first listener is added.
- (void)startObserving {
  _hasListeners = YES;
  // Set up any upstream listeners or background tasks as necessary
}

// Will be called when this module's last listener is removed, or on dealloc.
- (void)stopObserving {
  _hasListeners = NO;
  // Remove upstream listeners, stop unnecessary background tasks
}

- (void)_handleLongPress:(UILongPressGestureRecognizer*)recognizer {
  // Only send events if anyone is listening
  if (_hasListeners) {
    [self sendEventWithName:@"onTwoFingerLongPress" body:nil];
  }
}

@end
