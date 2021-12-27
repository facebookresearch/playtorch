/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Foundation

class JSContext {

    enum JSContextError : Error {
        case invalidParam
    }

    public static var ID_KEY = "ID"

    public static var refs: [String: NativeJSRef] = [:]

    public static func setRef(ref: NativeJSRef) -> String {
        let id = UUID().uuidString
        JSContext.refs[id] = ref
        return id
    }

    public static func getRef(id: String) throws -> NativeJSRef {
        guard let unwrappedNativeJSRef = JSContext.refs[id] else { throw JSContextError.invalidParam }
        return unwrappedNativeJSRef
    }

    public static func get(jsRef: [ String : String ]) throws -> NativeJSRef {
        guard let id = jsRef[ID_KEY] else { throw JSContextError.invalidParam }
        return try JSContext.getRef(id: id)
    }

    public static func release(jsRef: [ String : String ]) throws {
        guard let id = jsRef[ID_KEY] else { throw JSContextError.invalidParam }
        let removedJSRef = refs.removeValue(forKey: id)
        try removedJSRef?.release()
    }

    public static func wrapObject(object: Any) -> NativeJSRef {
        return NativeJSRef(object: object)
    }

    public static func unwrapObject(jsRef: [ String : String ]) throws -> Any {
        guard let id = jsRef[ID_KEY] else { throw JSContextError.invalidParam }
        let ref = try JSContext.getRef(id: id)
        return ref.getObject()
    }

    class NativeJSRef {
        //initialized mId and mJSRef to empty values to allow self to be used to set id in init()
        private var mId: String? = ""
        private var mObject: Any?
        private var mJSRef: [String : String]? = [:]

        init(object: Any){
            mObject = object
            mId = JSContext.setRef(ref: self)
            mJSRef?[JSContext.ID_KEY] = mId
        }

        public func getJSRef() -> [String:String] {
            return mJSRef ?? [:]
        }

        public func getObject() -> Any {
            return mObject as Any
        }

        public func release() throws -> Void {
            if let image = mObject as? Image {
                try image.close()
            }
            mId = nil
            mObject = nil
            mJSRef = nil
        }
    }
}
