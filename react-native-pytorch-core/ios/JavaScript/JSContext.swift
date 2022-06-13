/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Foundation

@objc(PTLJSContext)
public class JSContext: NSObject {

    enum JSContextError: Error {
        case invalidParam
    }

    public static let idKey = "ID"

    public static var refs: [String: NativeJSRef] = [:]

    public static func setRef(ref: NativeJSRef) -> String {
        let refId = UUID().uuidString
        JSContext.refs[refId] = ref
        return refId
    }

    public static func getRef(refId: String) throws -> NativeJSRef {
        guard let unwrappedNativeJSRef = JSContext.refs[refId] else { throw JSContextError.invalidParam }
        return unwrappedNativeJSRef
    }

    public static func get(jsRef: [ String: String ]) throws -> NativeJSRef {
        guard let refId = jsRef[idKey] else { throw JSContextError.invalidParam }
        return try JSContext.getRef(refId: refId)
    }

    @objc
    public static func release(jsRef: [ String: String ]) throws {
        guard let refId = jsRef[idKey] else { throw JSContextError.invalidParam }
        let removedJSRef = refs.removeValue(forKey: refId)
        try removedJSRef?.release()
    }

    public static func wrapObject(object: Any) -> NativeJSRef {
        return NativeJSRef(object: object)
    }

    public static func unwrapObject(jsRef: [ String: String ]) throws -> Any {
        guard let refId = jsRef[idKey] else { throw JSContextError.invalidParam }
        let ref = try JSContext.getRef(refId: refId)
        return ref.getObject()
    }

    public class NativeJSRef {
        // initialized mId and mJSRef to empty values to allow self to be used to set id in init()
        private var mId: String? = ""
        private var mObject: Any?
        private var mJSRef: [String: String]? = [:]

        init(object: Any) {
            mObject = object
            mId = JSContext.setRef(ref: self)
            mJSRef?[JSContext.idKey] = mId
        }

        public func getJSRef() -> [String: String] {
            return mJSRef ?? [:]
        }

        public func getObject() -> Any {
            return mObject as Any
        }

        public func release() throws {
            if let image = mObject as? Image {
                try image.close()
            }
            mId = nil
            mObject = nil
            mJSRef = nil
        }
    }
}
