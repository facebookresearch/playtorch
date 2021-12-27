/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

/**
 * @packageDocumentation
 *
 * The [[NativeJSRef]] is an interface for large native objects or objects that
 * cannot be serialized. Instead of serializing an object and sending it over
 * the React Native Bridge, an object will be assigned ID on native and this ID
 * will be sent over the React Native Bridge instead. The ID will be used to
 * reference the native object when calling function on the object in
 * JavaScript.
 *
 * ```typescript
 * const {PingPongModule} = NativeModules;
 *
 * interface PingPongMessage {
 *   ping(name: string): Promise<string>;
 * }
 *
 * const wrapRef = (ref: NativeJSRef): PingPongMessage => {
 *   return {
 *     async ping(name: string): Promise<string> {
 *       return await PingPongModule.ping(ref, name);
 *     }
 *   };
 * };
 *
 * interface PingPongProps extends ViewProps {
 *   onMessage(message: PingPongMessage): void;
 * }
 *
 * const PingPongView = requireNativeComponent<PingPongProps>('PingPongView');
 *
 * export function PingPong({onMessage, ...otherProps}: PingPongProps) {
 *   const handleMessage = useCallback(
 *     (event: any) => {
 *       const {nativeEvent} = event;
 *       const {ID} = nativeEvent;
 *       const ref: NativeJSRef = {ID};
 *       const message = wrapRef(ref);
 *       onMessage(message);
 *     },
 *     [onMessage],
 *   );
 *   return <PingPongView {...otherProps} onMessage={handleMessage} />;
 * }
 * ```
 */
export interface NativeJSRef {
  /**
   * The internal ID for the object instance in native. Instead of serializing
   * the object in native and sending it via the React Native Bridge, each
   * native object will be assigned an ID which is sent to JavaScript instead.
   * The ID will be used to reference the native object instance when calling
   * functions on the JavaScript object.
   */
  ID: string;
}
