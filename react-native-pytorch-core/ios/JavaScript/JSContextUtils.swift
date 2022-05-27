/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Foundation

class JSContextUtils {
  enum JSContextUtilsError<T>: Error {
    case castingObject(T.Type)
    case castingDict(T.Type)
  }

  public static func unwrapObject<T>(_ objRef: String, _ objType: T.Type) throws -> T {
      guard let obj = try JSContext.unwrapObject(jsRef: ["ID": objRef]) as? T else {
        throw JSContextUtilsError.castingObject(objType)
      }
      return obj
  }

  public static func unwrapObject<T>(_ objRef: NSDictionary, _ objType: T.Type) throws -> T {
      guard let ref = objRef["ID"] as? String else { throw JSContextUtilsError.castingDict(objType) }
      return try unwrapObject(ref, T.self)
  }
}
