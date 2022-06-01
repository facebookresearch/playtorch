/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package org.pytorch.rn.core.javascript;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import java.util.UUID;
import java.util.WeakHashMap;

public class JSContext {

  protected static final String ID_KEY = "ID";

  private static final WeakHashMap<String, NativeJSRef> refs = new WeakHashMap<>();

  public static String setRef(NativeJSRef ref) {
    String id = UUID.randomUUID().toString();
    JSContext.refs.put(id, ref);
    return id;
  }

  public static NativeJSRef getRef(String id) {
    return JSContext.refs.get(id);
  }

  public static NativeJSRef get(ReadableMap jsRef) {
    String id = jsRef.getString(ID_KEY);
    return JSContext.getRef(id);
  }

  public static void release(String id) throws Exception {
    NativeJSRef ref = JSContext.getRef(id);
    ref.release();
    JSContext.refs.remove(id);
  }

  public static void release(ReadableMap jsRef) throws Exception {
    String id = jsRef.getString(ID_KEY);
    JSContext.release(id);
  }

  public static NativeJSRef wrapObject(Object object) {
    return new NativeJSRef(object);
  }

  public static <T> T unwrapObject(ReadableMap jsRef) {
    String id = jsRef.getString(ID_KEY);
    NativeJSRef ref = JSContext.getRef(id);
    return (T) ref.getObject();
  }

  public static final class NativeJSRef {

    private String mId;
    private Object mObject;
    private WritableMap mJSRef;

    protected NativeJSRef(Object object) {
      mObject = object;
      mId = JSContext.setRef(this);
      mJSRef = Arguments.createMap();
      mJSRef.putString(JSContext.ID_KEY, mId);
    }

    public WritableMap getJSRef() {
      return mJSRef;
    }

    public Object getObject() {
      return mObject;
    }

    /**
     * This method is deliberately private to only allow the outer class to release a NativeJSRef
     * instance.
     *
     * @throws Exception Forwarding any exception that is raised during the close call of the
     *     wrapped object.
     */
    private void release() throws Exception {
      if (mObject instanceof AutoCloseable) {
        ((AutoCloseable) mObject).close();
      }
      // Remove reference to id, which will release the associated NativeJSRef object stored as
      // value for the ID key.
      mId = null;
      mJSRef = null;
      mObject = null;
    }
  }
}
