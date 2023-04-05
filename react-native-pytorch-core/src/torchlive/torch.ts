/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

// Allows tensor data with arbitrary dimensions
type Item = ItemArray;
interface ItemArray extends Array<Item | number> {}

/**
 * TypedArray type to allow index-based access to tensor data.
 *
 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray}
 *
 * The type should preferrably be `ArrayBufferView`. However, that type includes
 * `DataView`, which itself is not indexable.
 *
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView}
 *
 * A valid TypeScript expression is as follows:
 *
 * ```
 * torch.rand([2, 3]).data[3];
 * ```
 */
type TypedArray =
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array;

/**
 * The [[IValue]] type is a convenient type representative of all possible
 * module input/output values.
 */
export type IValue =
  | null
  | string
  | number
  | boolean
  | Tensor
  | Dict
  | IValue[];

export type Dict = {[key: string]: IValue};

export interface Module {
  /**
   * Module forward function.
   *
   * @param inputs Module inputs. Input could be of type [[IValue]]
   * @returns Module output, which is particular to the model and can be any of
   * the [[IValue]] union types.
   */
  forward<In extends IValue[], Out extends IValue>(
    ...inputs: [...In]
  ): Promise<Out>;
  /**
   * Synchronous module forward function.
   *
   * @param inputs Module inputs. Input could be of type [[IValue]]
   * @returns Module output, which is particular to the model and can be any of
   * the [[IValue]] union types.
   */
  forwardSync<In extends IValue[], Out extends IValue>(...inputs: [...In]): Out;
}

export interface JIT {
  /**
   * Loads a serialized mobile module.
   *
   * @param filePath Path to serialized mobile module.
   * @param device Device on which the model will be loaded.
   * @param extraFiles Load extra files when loading the model.
   * @returns Serialized mobile module of the specified type extending [[Module]],
   * which, if not specified, default to be [[Module]]
   */
  _loadForMobile<T extends Module = Module>(
    filePath: string,
    device?: Device,
    extraFiles?: ExtraFilesMap,
  ): Promise<T>;
  /**
   * Loads a serialized mobile module synchronously.
   *
   * @param filePath Path to serialized mobile module.
   * @param device Device on which the model will be loaded.
   * @param extraFiles Load extra files when loading the model.
   * @returns Serialized mobile module of the specified type extending [[Module]],
   * which, if not specified, default to be [[Module]]
   */
  _loadForMobileSync<T extends Module = Module>(
    filePath: string,
    device?: Device,
    extraFiles?: ExtraFilesMap,
  ): T;
}

/**
 * A [[Dtype]] is an object that represents the data type of a [[Tensor]].
 *
 * :::note
 *
 * The `int64` (a.k.a. `long`) data types are not fully supported in React Native.
 * For now, use `.to({dtype: torch.int32})` to downcast before accessing such
 * methods as `.data()` and `.item()`.
 *
 * :::
 *
 * {@link https://pytorch.org/docs/1.12/tensor_attributes.html#torch-dtype}
 */
export type Dtype =
  | 'double'
  | 'float'
  | 'float32'
  | 'float64'
  | 'int'
  | 'int16'
  | 'int32'
  | 'int64' // Hermes doesn't support BigInt yet (https://github.com/facebook/hermes/issues/510)
  | 'int8'
  | 'long'
  | 'short'
  | 'uint8';

/**
 * Allowed torch devices
 *
 * {@link https://pytorch.org/docs/1.12/tensor_attributes.html#torch-device}
 */
export type Device = 'cpu';

/**
 * Defining type for extra files loaded with `torch.jit._loadForMobile` and
 * `torch.jit._loadForMobileSync`.
 */
export type ExtraFilesMap = {[key: string]: string | null};

export type TensorOptions = {
  /**
   * The desired data type of a tensor.
   */
  dtype?: Dtype;
};

/**
 * A [[MemoryFormat]] is an object representing the memory format on which a [[Tensor]] is or will be allocated.
 *
 * {@link https://pytorch.org/docs/1.12/tensor_attributes.html#torch.torch.memory_format}
 */
export type MemoryFormat =
  | 'channelsLast'
  | 'contiguousFormat'
  | 'preserveFormat';

// Adopt the notion of a Scalar
export type Scalar = number;
export interface Tensor {
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.__and__.html}
   * @param other
   */
  _And_(other: Scalar): Tensor;
  /**
   * @param other
   */
  _And_(other: Tensor): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.__lshift__.html}
   * @param other
   */
  _Lshift_(other: Scalar): Tensor;
  /**
   * @param other
   */
  _Lshift_(other: Tensor): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.__or__.html}
   * @param other
   */
  _Or_(other: Scalar): Tensor;
  /**
   * @param other
   */
  _Or_(other: Tensor): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.__rshift__.html}
   * @param other
   */
  _Rshift_(other: Scalar): Tensor;
  /**
   * @param other
   */
  _Rshift_(other: Tensor): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.__xor__.html}
   * @param other
   */
  _Xor_(other: Scalar): Tensor;
  /**
   * @param other
   */
  _Xor_(other: Tensor): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor._addmm_activation.html}
   * @param mat1
   * @param mat2
   * @param options.beta
   * @param options.alpha
   * @param options.useGelu
   */
  _addmmActivation(
    mat1: Tensor,
    mat2: Tensor,
    options?: {beta?: Number; alpha?: Number; useGelu?: boolean},
  ): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor._conj.html}

   */
  _conj(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor._conj_physical.html}

   */
  _conjPhysical(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor._fw_primal.html}
   * @param level
   */
  _fwPrimal(level: number): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor._indices.html}

   */
  _indices(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor._neg_view.html}

   */
  _negView(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor._nested_tensor_size.html}

   */
  _nestedTensorSize(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor._nested_tensor_strides.html}

   */
  _nestedTensorStrides(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor._reshape_alias.html}
   * @param size
   * @param stride
   */
  _reshapeAlias(size: number[], stride: number[]): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor._values.html}

   */
  _values(): Tensor;
  /**
   * Computes the absolute value of each element in input.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.abs.html}
   */
  abs(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.absolute.html}

   */
  absolute(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.acos.html}

   */
  acos(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.acosh.html}

   */
  acosh(): Tensor;
  /**
   * Add a scalar or tensor to this tensor.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.add.html}
   *
   * @param other Scalar or tensor to be added to each element in this tensor.
   * @param options.alpha The multiplier for `other`. Default: `1`.
   */
  add(other: Scalar | Tensor, options?: {alpha?: Number}): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.addbmm.html}
   * @param batch1
   * @param batch2
   * @param options.beta
   * @param options.alpha
   */
  addbmm(
    batch1: Tensor,
    batch2: Tensor,
    options?: {beta?: Number; alpha?: Number},
  ): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.addcdiv.html}
   * @param tensor1
   * @param tensor2
   * @param options.value
   */
  addcdiv(tensor1: Tensor, tensor2: Tensor, options?: {value?: Number}): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.addcmul.html}
   * @param tensor1
   * @param tensor2
   * @param options.value
   */
  addcmul(tensor1: Tensor, tensor2: Tensor, options?: {value?: Number}): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.addmm.html}
   * @param mat1
   * @param mat2
   * @param options.beta
   * @param options.alpha
   */
  addmm(
    mat1: Tensor,
    mat2: Tensor,
    options?: {beta?: Number; alpha?: Number},
  ): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.addmv.html}
   * @param mat
   * @param vec
   * @param options.beta
   * @param options.alpha
   */
  addmv(
    mat: Tensor,
    vec: Tensor,
    options?: {beta?: Number; alpha?: Number},
  ): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.addr.html}
   * @param vec1
   * @param vec2
   * @param options.beta
   * @param options.alpha
   */
  addr(
    vec1: Tensor,
    vec2: Tensor,
    options?: {beta?: Number; alpha?: Number},
  ): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.adjoint.html}

   */
  adjoint(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.alias.html}

   */
  alias(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.align_as.html}
   * @param other
   */
  alignAs(other: Tensor): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.aminmax.html}
   * @param options.dim
   * @param options.keepdim
   */
  aminmax(options?: {dim?: number; keepdim?: boolean}): [Tensor, Tensor];
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.angle.html}

   */
  angle(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.arccos.html}

   */
  arccos(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.arccosh.html}

   */
  arccosh(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.arcsin.html}

   */
  arcsin(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.arcsinh.html}

   */
  arcsinh(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.arctan.html}

   */
  arctan(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.arctan2.html}
   * @param other
   */
  arctan2(other: Tensor): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.arctanh.html}

   */
  arctanh(): Tensor;
  /**
   * Returns the indices of the maximum value of all elements in the input
   * tensor.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.argmax.html}
   *
   * @param options argmax Options as keywords argument in pytorch
   * @param options.dim The dimension to reduce. If `undefined`, the argmax of the flattened input is returned.
   * @param options.keepdim Whether the output tensor has `dim` retained or not. Ignored if `dim` is `undefined`.
   */
  argmax(options?: {dim?: number; keepdim?: boolean}): Tensor;
  /**
   * Returns the indices of the minimum value(s) of the flattened tensor or along a dimension
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.argmin.html}
   *
   * @param options argmin Options as keywords argument in pytorch
   * @param options.dim The dimension to reduce. If `undefined`, the argmin of the flattened input is returned.
   * @param options.keepdim Whether the output tensor has `dim` retained or not. Ignored if `dim` is `undefined`.
   */
  argmin(options?: {dim?: number; keepdim?: boolean}): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.argwhere.html}

   */
  argwhere(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.as_strided.html}
   * @param size
   * @param stride
   * @param options.storageOffset
   */
  asStrided(
    size: number[],
    stride: number[],
    options?: {storageOffset?: number},
  ): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.as_strided_scatter.html}
   * @param src
   * @param size
   * @param stride
   * @param options.storageOffset
   */
  asStridedScatter(
    src: Tensor,
    size: number[],
    stride: number[],
    options?: {storageOffset?: number},
  ): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.asin.html}

   */
  asin(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.asinh.html}

   */
  asinh(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.atan.html}

   */
  atan(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.atan2.html}
   * @param other
   */
  atan2(other: Tensor): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.atanh.html}

   */
  atanh(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.baddbmm.html}
   * @param batch1
   * @param batch2
   * @param options.beta
   * @param options.alpha
   */
  baddbmm(
    batch1: Tensor,
    batch2: Tensor,
    options?: {beta?: Number; alpha?: Number},
  ): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.bitwise_and.html}
   * @param other
   */
  bitwiseAnd(other: Scalar): Tensor;
  /**
   * @param other
   */
  bitwiseAnd(other: Tensor): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.bitwise_left_shift.html}
   * @param other
   */
  bitwiseLeftShift(other: Tensor): Tensor;
  /**
   * @param other
   */
  bitwiseLeftShift(other: Scalar): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.bitwise_not.html}

   */
  bitwiseNot(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.bitwise_or.html}
   * @param other
   */
  bitwiseOr(other: Scalar): Tensor;
  /**
   * @param other
   */
  bitwiseOr(other: Tensor): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.bitwise_right_shift.html}
   * @param other
   */
  bitwiseRightShift(other: Tensor): Tensor;
  /**
   * @param other
   */
  bitwiseRightShift(other: Scalar): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.bitwise_xor.html}
   * @param other
   */
  bitwiseXor(other: Scalar): Tensor;
  /**
   * @param other
   */
  bitwiseXor(other: Tensor): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.bmm.html}
   * @param mat2
   */
  bmm(mat2: Tensor): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.broadcast_to.html}
   * @param size
   */
  broadcastTo(size: number[]): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.ccol_indices.html}

   */
  ccolIndices(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.ceil.html}

   */
  ceil(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.cholesky.html}
   * @param options.upper
   */
  cholesky(options?: {upper?: boolean}): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.cholesky_inverse.html}
   * @param options.upper
   */
  choleskyInverse(options?: {upper?: boolean}): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.cholesky_solve.html}
   * @param input2
   * @param options.upper
   */
  choleskySolve(input2: Tensor, options?: {upper?: boolean}): Tensor;
  /**
   * Clamps all elements in input into the range `[ min, max ]`.
   *
   * If `min` is `undefined`, there is no lower bound. Or, if `max` is `undefined` there is no upper bound.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.clamp.html}
   *
   * @param min Lower-bound of the range to be clamped to
   * @param max Upper-bound of the range to be clamped to
   */
  clamp(min: Scalar | Tensor, max?: Scalar | Tensor): Tensor;
  /**
   * Clamps all elements in input into the range `[ min, max ]`.
   *
   * If `min` is `undefined`, there is no lower bound. Or, if `max` is `undefined` there is no upper bound.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.clamp.html}
   *
   * @param options.min Lower-bound of the range to be clamped to
   * @param options.max Upper-bound of the range to be clamped to
   */
  clamp(options: {min?: Scalar | Tensor; max?: Scalar | Tensor}): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.clamp_max.html}
   * @param max
   */
  clampMax(max: Scalar): Tensor;
  /**
   * @param max
   */
  clampMax(max: Tensor): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.clamp_min.html}
   * @param min
   */
  clampMin(min: Scalar): Tensor;
  /**
   * @param min
   */
  clampMin(min: Tensor): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.coalesce.html}

   */
  coalesce(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.col_indices.html}

   */
  colIndices(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.conj.html}

   */
  conj(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.conj_physical.html}

   */
  conjPhysical(): Tensor;
  /**
   * Returns a contiguous in memory tensor containing the same data as this
   * tensor. If this tensor is already in the specified memory format, this
   * function returns this tensor.
   *
   * @param options.memoryFormat The desired memory format of returned Tensor. Default: torch.contiguousFormat.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.contiguous.html}
   */
  contiguous(options?: {memoryFormat: MemoryFormat}): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.copysign.html}
   * @param other
   */
  copysign(other: Tensor): Tensor;
  /**
   * @param other
   */
  copysign(other: Scalar): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.corrcoef.html}

   */
  corrcoef(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.cos.html}

   */
  cos(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.cosh.html}

   */
  cosh(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.count_nonzero.html}
   * @param dim
   */
  countNonzero(dim: number[]): Tensor;
  /**
   * @param options.dim
   */
  countNonzero(options?: {dim?: number}): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.cross.html}
   * @param other
   * @param options.dim
   */
  cross(other: Tensor, options?: {dim?: number}): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.crow_indices.html}

   */
  crowIndices(): Tensor;
  /**
   * Returns the tensor data as `TypedArray` buffer.
   *
   * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray}
   *
   * A valid TypeScript expression is as follows:
   *
   * ```typescript
   * torch.rand([2, 3]).data()[3];
   * ```
   *
   * :::note
   *
   * The function only exists in JavaScript.
   *
   * :::
   *
   * @experimental
   */
  data(): TypedArray;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.deg2rad.html}

   */
  deg2rad(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.dequantize.html}

   */
  dequantize(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.det.html}

   */
  det(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.detach.html}

   */
  detach(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.diag.html}
   * @param options.diagonal
   */
  diag(options?: {diagonal?: number}): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.diag_embed.html}
   * @param options.offset
   * @param options.dim1
   * @param options.dim2
   */
  diagEmbed(options?: {offset?: number; dim1?: number; dim2?: number}): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.diagflat.html}
   * @param options.offset
   */
  diagflat(options?: {offset?: number}): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.diagonal_scatter.html}
   * @param src
   * @param options.offset
   * @param options.dim1
   * @param options.dim2
   */
  diagonalScatter(
    src: Tensor,
    options?: {offset?: number; dim1?: number; dim2?: number},
  ): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.digamma.html}

   */
  digamma(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.dist.html}
   * @param other
   * @param options.p
   */
  dist(other: Tensor, options?: {p?: Number}): Tensor;
  /**
   * Divides each element of the input input by the corresponding element of
   * other.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.div.html}
   *
   * @param other Scalar or tensor that divides each element in this tensor.
   * @param options.roundingMode Type of rounding applied to the result
   */
  div(
    other: Scalar | Tensor,
    options?: {roundingMode?: 'trunc' | 'floor'},
  ): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.dot.html}
   * @param tensor
   */
  dot(tensor: Tensor): Tensor;
  /**
   * A dtype is an string that represents the data type of a torch.Tensor.
   *
   * {@link https://pytorch.org/docs/1.12/tensor_attributes.html}
   */
  dtype: Dtype;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.eq.html}
   * @param other
   */
  eq(other: Scalar): Tensor;
  /**
   * @param other
   */
  eq(other: Tensor): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.erf.html}

   */
  erf(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.erfc.html}

   */
  erfc(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.erfinv.html}

   */
  erfinv(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.exp.html}

   */
  exp(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.exp2.html}

   */
  exp2(): Tensor;
  /**
   * Returns a new view of the tensor expanded to a larger size.
   *
   * {@link https://pytorch.org/docs/stable/generated/torch.Tensor.expand.html}
   *
   * @param sizes The expanded size, eg: ([3, 4]).
   */
  expand(sizes: number[]): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.expand_as.html}
   * @param other
   */
  expandAs(other: Tensor): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.expm1.html}

   */
  expm1(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.fix.html}

   */
  fix(): Tensor;
  /**
   * Reverse the order of a n-D tensor along given axis in dims.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.flip.html}
   *
   * @param dims Axis to flip on.
   */
  flip(dims: number[]): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.fliplr.html}

   */
  fliplr(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.flipud.html}

   */
  flipud(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.float_power.html}
   * @param exponent
   */
  floatPower(exponent: Tensor): Tensor;
  /**
   * @param exponent
   */
  floatPower(exponent: Scalar): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.floor.html}

   */
  floor(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.floor_divide.html}
   * @param other
   */
  floorDivide(other: Tensor): Tensor;
  /**
   * @param other
   */
  floorDivide(other: Scalar): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.fmax.html}
   * @param other
   */
  fmax(other: Tensor): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.fmin.html}
   * @param other
   */
  fmin(other: Tensor): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.fmod.html}
   * @param other
   */
  fmod(other: Scalar): Tensor;
  /**
   * @param other
   */
  fmod(other: Tensor): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.frac.html}

   */
  frac(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.frexp.html}

   */
  frexp(): [Tensor, Tensor];
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.gcd.html}
   * @param other
   */
  gcd(other: Tensor): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.ge.html}
   * @param other
   */
  ge(other: Scalar): Tensor;
  /**
   * @param other
   */
  ge(other: Tensor): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.geqrf.html}

   */
  geqrf(): [Tensor, Tensor];
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.ger.html}
   * @param vec2
   */
  ger(vec2: Tensor): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.greater.html}
   * @param other
   */
  greater(other: Scalar): Tensor;
  /**
   * @param other
   */
  greater(other: Tensor): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.greater_equal.html}
   * @param other
   */
  greaterEqual(other: Scalar): Tensor;
  /**
   * @param other
   */
  greaterEqual(other: Tensor): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.gt.html}
   * @param other
   */
  gt(other: Scalar): Tensor;
  /**
   * @param other
   */
  gt(other: Tensor): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.hardshrink.html}
   * @param options.lambd
   */
  hardshrink(options?: {lambd?: Number}): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.heaviside.html}
   * @param values
   */
  heaviside(values: Tensor): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.histc.html}
   * @param options.bins
   * @param options.min
   * @param options.max
   */
  histc(options?: {bins?: number; min?: Number; max?: Number}): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.hypot.html}
   * @param other
   */
  hypot(other: Tensor): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.i0.html}

   */
  i0(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.igamma.html}
   * @param other
   */
  igamma(other: Tensor): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.igammac.html}
   * @param other
   */
  igammac(other: Tensor): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.indices.html}

   */
  indices(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.inner.html}
   * @param other
   */
  inner(other: Tensor): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.int_repr.html}

   */
  intRepr(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.inverse.html}

   */
  inverse(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.isfinite.html}

   */
  isfinite(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.isinf.html}

   */
  isinf(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.isnan.html}

   */
  isnan(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.isneginf.html}

   */
  isneginf(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.isposinf.html}

   */
  isposinf(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.isreal.html}

   */
  isreal(): Tensor;
  /**
   * Returns the value of this tensor as a `number`. This only works for
   * tensors with one element.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.item.html}
   */
  item(): number;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.kron.html}
   * @param other
   */
  kron(other: Tensor): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.lcm.html}
   * @param other
   */
  lcm(other: Tensor): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.ldexp.html}
   * @param other
   */
  ldexp(other: Tensor): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.le.html}
   * @param other
   */
  le(other: Scalar): Tensor;
  /**
   * @param other
   */
  le(other: Tensor): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.lerp.html}
   * @param end
   * @param weight
   */
  lerp(end: Tensor, weight: Scalar): Tensor;
  /**
   * @param end
   * @param weight
   */
  lerp(end: Tensor, weight: Tensor): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.less.html}
   * @param other
   */
  less(other: Scalar): Tensor;
  /**
   * @param other
   */
  less(other: Tensor): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.less_equal.html}
   * @param other
   */
  lessEqual(other: Scalar): Tensor;
  /**
   * @param other
   */
  lessEqual(other: Tensor): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.lgamma.html}

   */
  lgamma(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.log.html}

   */
  log(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.log10.html}

   */
  log10(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.log1p.html}

   */
  log1p(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.log2.html}

   */
  log2(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.logaddexp.html}
   * @param other
   */
  logaddexp(other: Tensor): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.logaddexp2.html}
   * @param other
   */
  logaddexp2(other: Tensor): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.logdet.html}

   */
  logdet(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.logical_and.html}
   * @param other
   */
  logicalAnd(other: Tensor): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.logical_not.html}

   */
  logicalNot(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.logical_or.html}
   * @param other
   */
  logicalOr(other: Tensor): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.logical_xor.html}
   * @param other
   */
  logicalXor(other: Tensor): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.lt.html}
   * @param other
   */
  lt(other: Scalar): Tensor;
  /**
   * @param other
   */
  lt(other: Tensor): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.lu_solve.html}
   * @param LUData
   * @param LUPivots
   */
  luSolve(LUData: Tensor, LUPivots: Tensor): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.mH.html}

   */
  mH(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.mT.html}

   */
  mT(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.masked_fill.html}
   * @param mask
   * @param value
   */
  maskedFill(mask: Tensor, value: Scalar): Tensor;
  /**
   * @param mask
   * @param value
   */
  maskedFill(mask: Tensor, value: Tensor): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.masked_scatter.html}
   * @param mask
   * @param source
   */
  maskedScatter(mask: Tensor, source: Tensor): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.masked_select.html}
   * @param mask
   */
  maskedSelect(mask: Tensor): Tensor;
  /**
   * Performs matrix multiplication with other tensor.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.matmul.html}
   *
   * @param other tensor matrix multiplied this tensor.
   */
  matmul(other: Tensor): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.matrix_exp.html}

   */
  matrixExp(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.matrix_H.html}

   */
  matrixH(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.matrix_power.html}
   * @param n
   */
  matrixPower(n: number): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.maximum.html}
   * @param other
   */
  maximum(other: Tensor): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.minimum.html}
   * @param other
   */
  minimum(other: Tensor): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.mm.html}
   * @param mat2
   */
  mm(mat2: Tensor): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.moveaxis.html}
   * @param source
   * @param destination
   */
  moveaxis(source: number[], destination: number[]): Tensor;
  /**
   * @param source
   * @param destination
   */
  moveaxis(source: number, destination: number): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.movedim.html}
   * @param source
   * @param destination
   */
  movedim(source: number[], destination: number[]): Tensor;
  /**
   * @param source
   * @param destination
   */
  movedim(source: number, destination: number): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.msort.html}

   */
  msort(): Tensor;
  /**
   * Multiplies input by other scalar or tensor.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.mul.html}
   *
   * @param other Scalar or tensor multiplied with each element in this tensor.
   */
  mul(other: Scalar | Tensor): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.multiply.html}
   * @param other
   */
  multiply(other: Tensor): Tensor;
  /**
   * @param other
   */
  multiply(other: Scalar): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.mv.html}
   * @param vec
   */
  mv(vec: Tensor): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.mvlgamma.html}
   * @param p
   */
  mvlgamma(p: number): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.narrow.html}
   * @param dim
   * @param start
   * @param length
   */
  narrow(dim: number, start: number, length: number): Tensor;
  /**
   * @param dim
   * @param start
   * @param length
   */
  narrow(dim: number, start: Tensor, length: number): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.narrow_copy.html}
   * @param dim
   * @param start
   * @param length
   */
  narrowCopy(dim: number, start: number, length: number): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.ne.html}
   * @param other
   */
  ne(other: Scalar): Tensor;
  /**
   * @param other
   */
  ne(other: Tensor): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.neg.html}

   */
  neg(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.negative.html}

   */
  negative(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.nextafter.html}
   * @param other
   */
  nextafter(other: Tensor): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.nonzero.html}

   */
  nonzero(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.not_equal.html}
   * @param other
   */
  notEqual(other: Scalar): Tensor;
  /**
   * @param other
   */
  notEqual(other: Tensor): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.numpy_T.html}

   */
  numpyT(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.orgqr.html}
   * @param input2
   */
  orgqr(input2: Tensor): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.ormqr.html}
   * @param input2
   * @param input3
   * @param options.left
   * @param options.transpose
   */
  ormqr(
    input2: Tensor,
    input3: Tensor,
    options?: {left?: boolean; transpose?: boolean},
  ): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.outer.html}
   * @param vec2
   */
  outer(vec2: Tensor): Tensor;
  /**
   * Returns a view of the original tensor input with its dimensions permuted.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.permute.html}
   *
   * @param dims The desired ordering of dimensions.
   */
  permute(dims: number[]): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.positive.html}

   */
  positive(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.pow.html}
   * @param exponent
   */
  pow(exponent: Tensor): Tensor;
  /**
   * @param exponent
   */
  pow(exponent: Scalar): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.prelu.html}
   * @param weight
   */
  prelu(weight: Tensor): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.put.html}
   * @param index
   * @param source
   * @param options.accumulate
   */
  put(index: Tensor, source: Tensor, options?: {accumulate?: boolean}): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.q_per_channel_scales.html}

   */
  qPerChannelScales(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.q_per_channel_zero_points.html}

   */
  qPerChannelZeroPoints(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.qr.html}
   * @param options.some
   */
  qr(options?: {some?: boolean}): [Tensor, Tensor];
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.rad2deg.html}

   */
  rad2deg(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.ravel.html}

   */
  ravel(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.reciprocal.html}

   */
  reciprocal(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.relu.html}

   */
  relu(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.remainder.html}
   * @param other
   */
  remainder(other: Scalar): Tensor;
  /**
   * @param other
   */
  remainder(other: Tensor): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.renorm.html}
   * @param p
   * @param dim
   * @param maxnorm
   */
  renorm(p: Scalar, dim: number, maxnorm: Scalar): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.repeat.html}
   * @param repeats
   */
  repeat(repeats: number[]): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.repeat_interleave.html}
   * @param repeats
   * @param options.dim
   * @param options.outputSize
   */
  repeatInterleave(
    repeats: Tensor,
    options?: {dim?: number; outputSize?: number},
  ): Tensor;
  /**
   * @param repeats
   * @param options.dim
   * @param options.outputSize
   */
  repeatInterleave(
    repeats: number,
    options?: {dim?: number; outputSize?: number},
  ): Tensor;
  /**
   * Returns a tensor with the same data and number of elements as input, but
   * with the specified shape.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.reshape.html}
   *
   * @param shape The new shape.
   */
  reshape(shape: number[]): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.reshape_as.html}
   * @param other
   */
  reshapeAs(other: Tensor): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.resolve_conj.html}

   */
  resolveConj(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.resolve_neg.html}

   */
  resolveNeg(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.row_indices.html}

   */
  rowIndices(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.rsqrt.html}

   */
  rsqrt(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.select_scatter.html}
   * @param src
   * @param dim
   * @param index
   */
  selectScatter(src: Tensor, dim: number, index: number): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.sgn.html}

   */
  sgn(): Tensor;
  /**
   * Returns the size of the tensor.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.size.html}
   */
  shape: number[];
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.sigmoid.html}

   */
  sigmoid(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.sign.html}

   */
  sign(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.signbit.html}

   */
  signbit(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.sin.html}

   */
  sin(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.sinc.html}

   */
  sinc(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.sinh.html}

   */
  sinh(): Tensor;
  /**
   * Returns the size of the tensor.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.size.html}
   */
  size(): number[];
  /**
   * Returns the size of the tensor.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.size.html}
   */
  size(): number[];
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.slice.html}
   * @param options.dim
   * @param options.start
   * @param options.end
   * @param options.step
   */
  slice(options?: {
    dim?: number;
    start?: number;
    end?: number;
    step?: number;
  }): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.slice_scatter.html}
   * @param src
   * @param options.dim
   * @param options.start
   * @param options.end
   * @param options.step
   */
  sliceScatter(
    src: Tensor,
    options?: {dim?: number; start?: number; end?: number; step?: number},
  ): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.slogdet.html}

   */
  slogdet(): [Tensor, Tensor];
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.smm.html}
   * @param mat2
   */
  smm(mat2: Tensor): Tensor;
  /**
   * Applies a softmax function. It is applied to all slices along dim, and
   * will re-scale them so that the elements lie in the range `[0, 1]` and sum
   * to `1`.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.nn.functional.softmax.html}
   *
   * @param dim A dimension along which softmax will be computed.
   */
  softmax(dim: number): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.sparse_mask.html}
   * @param mask
   */
  sparseMask(mask: Tensor): Tensor;
  /**
   * Computes the square-root value of each element in input.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.sqrt.html}
   */
  sqrt(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.square.html}

   */
  square(): Tensor;
  /**
   * Returns a tensor with all the dimensions of input of size 1 removed.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.squeeze.html}
   *
   * @param dim If given, the input will be squeezed only in this dimension.
   */
  squeeze(dim?: number): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.sspaddmm.html}
   * @param mat1
   * @param mat2
   * @param options.beta
   * @param options.alpha
   */
  sspaddmm(
    mat1: Tensor,
    mat2: Tensor,
    options?: {beta?: Number; alpha?: Number},
  ): Tensor;
  /**
   * Returns the stride of the tensor.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.stride.html}
   */
  stride(): number[];
  /**
   * Returns the stride of the tensor.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.stride.html}
   *
   * @param dim The desired dimension in which stride is required.
   */
  stride(dim: number): number;
  /**
   * Subtracts other from input.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.sub.html}
   *
   * @param other The scalar or tensor to subtract from input.
   * @param options.alpha The multiplier for `other`. Default: `1`.
   */
  sub(other: Scalar | Tensor, options?: {alpha?: Number}): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.subtract.html}
   * @param other
   * @param options.alpha
   */
  subtract(other: Tensor, options?: {alpha?: Number}): Tensor;
  /**
   * @param other
   * @param options.alpha
   */
  subtract(other: Scalar, options?: {alpha?: Number}): Tensor;
  /**
   * Returns the sum of all elements in the input tensor.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.sum.html}
   */
  sum(): Tensor;
  /**
   * Returns the sum of each row of the input tensor in the given dimension dim.
   * If dim is a list of dimensions, reduce over all of them.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.sum.html}
   *
   * @param dim The dimension or dimensions to reduce.
   * @param options.keepdim Whether the output tensor has `dim` retained or not.
   */
  sum(dim: number | number[], options?: {keepdim?: boolean}): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.sum_to_size.html}
   * @param size
   */
  sumToSize(size: number[]): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.swapaxes.html}
   * @param axis0
   * @param axis1
   */
  swapaxes(axis0: number, axis1: number): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.swapdims.html}
   * @param dim0
   * @param dim1
   */
  swapdims(dim0: number, dim1: number): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.symeig.html}
   * @param options.eigenvectors
   * @param options.upper
   */
  symeig(options?: {eigenvectors?: boolean; upper?: boolean}): [Tensor, Tensor];
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.t.html}

   */
  t(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.take.html}
   * @param index
   */
  take(index: Tensor): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.take_along_dim.html}
   * @param indices
   * @param options.dim
   */
  takeAlongDim(indices: Tensor, options?: {dim?: number}): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.tan.html}

   */
  tan(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.tanh.html}

   */
  tanh(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.tile.html}
   * @param dims
   */
  tile(dims: number[]): Tensor;
  /**
   * Performs Tensor conversion.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.to.html}
   *
   * @param options Tensor options.
   */
  to(options: TensorOptions): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.to_sparse.html}
   * @param sparseDim
   */
  toSparse(sparseDim: number): Tensor;
  /**

   */
  toSparse(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.to_sparse_bsc.html}
   * @param blocksize
   */
  toSparseBsc(blocksize: number[]): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.to_sparse_bsr.html}
   * @param blocksize
   */
  toSparseBsr(blocksize: number[]): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.to_sparse_csc.html}

   */
  toSparseCsc(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.to_sparse_csr.html}

   */
  toSparseCsr(): Tensor;
  /**
   * Returns a list of two Tensors where the first represents the k largest elements of the given input tensor,
   * and the second represents the indices of the k largest elements.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.topk.html}
   *
   * @param k The k in "top-k"
   * @param options topk Options as keywords argument in pytorch
   * @param options.dim The dimension to sort along. If dim is not given, the last dimension of the input is chosen.
   * @param options.largest Controls whether to return largest or smallest elements. It is set to True by default.
   * @param options.sorted Controls whether to return the elements in sorted order. It is set to True by default.
   */
  topk(
    k: number,
    options?: {dim?: number; largest?: boolean; sorted?: boolean},
  ): [Tensor, Tensor];
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.trace.html}

   */
  trace(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.triangular_solve.html}
   * @param A
   * @param options.upper
   * @param options.transpose
   * @param options.unitriangular
   */
  triangularSolve(
    A: Tensor,
    options?: {upper?: boolean; transpose?: boolean; unitriangular?: boolean},
  ): [Tensor, Tensor];
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.tril.html}
   * @param options.diagonal
   */
  tril(options?: {diagonal?: number}): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.triu.html}
   * @param options.diagonal
   */
  triu(options?: {diagonal?: number}): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.true_divide.html}
   * @param other
   */
  trueDivide(other: Tensor): Tensor;
  /**
   * @param other
   */
  trueDivide(other: Scalar): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.trunc.html}

   */
  trunc(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.type_as.html}
   * @param other
   */
  typeAs(other: Tensor): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.unfold.html}
   * @param dimension
   * @param size
   * @param step
   */
  unfold(dimension: number, size: number, step: number): Tensor;
  /**
   * Returns a new tensor with a dimension of size one inserted at the
   * specified position.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.unsqueeze.html}
   *
   * @param dim The index at which to insert the singleton dimension.
   */
  unsqueeze(dim: number): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.values.html}

   */
  values(): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.vdot.html}
   * @param other
   */
  vdot(other: Tensor): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.view_as.html}
   * @param other
   */
  viewAs(other: Tensor): Tensor;
  /**
   * @experimental
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.xlogy.html}
   * @param other
   */
  xlogy(other: Tensor): Tensor;
  /**
   * @param other
   */
  xlogy(other: Scalar): Tensor;
  /**
   * Access tensor with index.
   *
   * ```typescript
   * const tensor = torch.rand([2]);
   * console.log(tensor.data, tensor[0].data);
   * // [0.8339180946350098, 0.17733973264694214], [0.8339180946350098]
   * ```
   *
   * {@link https://pytorch.org/cppdocs/notes/tensor_indexing.html}
   */
  [index: number]: Tensor;
} // Tensor

export interface Torch {
  /**
   * Returns a 1-D tensor of size `(end - 0) / 1` with values from the interval
   * `[0, end)` taken with common difference step beginning from start.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.arange.html}
   *
   * @param end The ending value for the set of points.
   * @param options
   */
  arange(end: number, options?: TensorOptions): Tensor;
  /**
   * Returns a 1-D tensor of size `(end - start) / 1` with values from the
   * interval `[start, end)` taken with common difference 1 beginning from
   * `start`.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.arange.html}
   *
   * @param start The starting value for the set of points.
   * @param end The ending value for the set of points.
   * @param options
   */
  arange(start: number, end: number, options?: TensorOptions): Tensor;
  /**
   * Returns a 1-D tensor of size `(end - start) / step` with values from the
   * interval `[start, end)` taken with common difference `step` beginning from
   * `start`.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.arange.html}
   *
   * @param start The starting value for the set of points.
   * @param end The ending value for the set of points.
   * @param step The gap between each pair of adjacent points.
   * @param options
   */
  arange(
    start: number,
    end: number,
    step: number,
    options?: TensorOptions,
  ): Tensor;
  /**
   * Concatenate a list of tensors along the specified axis, which default to be axis 0
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.cat.html}
   *
   * @param tensors A sequence of Tensor to be concatenated.
   * @param options used to specify the dimenstion to concate.
   */
  cat(tensors: Tensor[], options?: {dim?: number}): Tensor;
  /**
   * Returns a tensor filled with uninitialized data. The shape of the tensor
   * is defined by the variable argument size.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.empty.html}
   *
   * @param size A sequence of integers defining the shape of the output
   * tensor.
   */
  empty(size: number[], options?: TensorOptions): Tensor;
  /**
   * Returns a tensor filled with ones on the diagonal, and zeroes elsewhere.
   * The shape of the tensor is defined by the arguments n and m.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.eye.html}
   *
   * @param n An integer defining the number of rows in the result.
   * @param m An integer defining the number of columns in the result. Optional, defaults to n.
   */
  eye(n: number, m?: number, options?: TensorOptions): Tensor;
  /**
   * Exposes the given data as a Tensor without taking ownership of the
   * original data.
   *
   * :::note
   *
   * The function exists in JavaScript and C++ (torch::from_blob).
   *
   * :::
   *
   * @param blob The blob holding the data.
   * @param sizes Should specify the shape of the tensor, strides the stride
   * @param options Tensor options
   * in each dimension.
   */
  fromBlob(blob: any, sizes?: number[], options?: TensorOptions): Tensor;
  /**
   * Creates a tensor of size `size` filled with `fillValue`. The tensor’s dtype is default to be `torch.float32`,
   * unless specified with `options`.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.full.html}
   *
   * @param size  A list of integers defining the shape of the output tensor.
   * @param fillValue The value to fill the output tensor with.
   * @param options Object to customizing dtype, etc. default to be {dtype: torch.float32}
   */
  full(size: number[], fillValue: number, options?: TensorOptions): Tensor;
  /**
   * Creates a one-dimensional tensor of size steps whose values are evenly spaced from `start` to `end`,
   * inclusive.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.linspace.html}
   *
   * @param start Starting value for the set of points
   * @param end Ending value for the set of points
   * @param steps Size of the constructed tensor
   * @param options Object to customizing dtype. default to be {dtype: torch.float32}
   */
  linspace(
    start: number,
    end: number,
    steps: number,
    options?: TensorOptions,
  ): Tensor;
  /**
   * Returns a one-dimensional tensor of size steps whose values are evenly spaced from
   * base^start to base^end, inclusive, on a logarithmic scale with base.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.logspace.html}
   *
   * @param start Starting value for the set of points
   * @param end Ending value for the set of points
   * @param steps Size of the constructed tensor
   * @param options Object to customizing base and dtype. default to be {base: 10, dtype: torch.float32}
   */
  logspace(
    start: number,
    end: number,
    steps: number,
    options?: TensorOptions & {base: number},
  ): Tensor;
  /**
   * Returns a tensor filled with the scalar value 1, with the shape defined
   * by the argument `size`.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.ones.html}
   *
   * @param size A sequence of integers defining the shape of the output tensor.
   * @param options Tensor options.
   */
  ones(size: number[], options?: TensorOptions): Tensor;
  /**
   * Returns a tensor filled with random numbers from a uniform distribution on
   * the interval `[0, 1)`.
   *
   * @param size A sequence of integers defining the shape of the output tensor.
   * @param options Tensor options.
   */
  rand(size: number[], options?: TensorOptions): Tensor;
  /**
   * Returns a tensor filled with random integers generated uniformly between
   * `0` (inclusive) and `high` (exclusive).
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.randint.html}
   *
   * @param high One above the highest integer to be drawn from the distribution.
   * @param size A tuple defining the shape of the output tensor.
   */
  randint(high: number, size: number[]): Tensor;
  /**
   * Returns a tensor filled with random integers generated uniformly between
   * `low` (inclusive) and `high` (exclusive).
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.randint.html}
   *
   * @param low Lowest integer to be drawn from the distribution.
   * @param high One above the highest integer to be drawn from the distribution.
   * @param size A tuple defining the shape of the output tensor.
   */
  randint(low: number, high: number, size: number[]): Tensor;
  /**
   * Returns a tensor filled with random numbers from a normal distribution
   * with mean 0 and variance 1 (also called the standard normal distribution).
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.randn.html}
   *
   * @param size A sequence of integers defining the shape of the output tensor.
   * @param options Tensor options.
   */
  randn(size: number[], options?: TensorOptions): Tensor;
  /**
   * Returns a random permutation of integers from 0 to n - 1
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.randperm.html}
   *
   * @param n The upper bound (exclusive)
   * @param options Object to customizing dtype, etc. default to be {dtype: torch.int64}.
   */
  randperm(n: number, options?: TensorOptions): Tensor;
  /**
   * Constructs a tensor with no autograd history.
   *
   * @param data Tensor data as multi-dimensional array.
   * @param options Tensor options.
   */
  tensor(data: Scalar | ItemArray, options?: TensorOptions): Tensor;
  /**
   * Returns a tensor filled with the scalar value 0, with the shape defined
   * by the argument `size`.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.zeros.html}
   *
   * @param size A sequence of integers defining the shape of the output tensor.
   * @param options Tensor options.
   */
  zeros(size: number[], options?: TensorOptions): Tensor;

  /**
   * JIT module
   */
  jit: JIT;

  // Tensor Data Type
  double: 'double';
  float: 'float';
  float32: 'float32';
  float64: 'float64';
  int: 'int';
  int16: 'int16';
  int32: 'int32';
  int64: 'int64';
  int8: 'int8';
  long: 'long';
  short: 'short';
  uint8: 'uint8';

  // Memory Format
  channelsLast: 'channelsLast';
  contiguousFormat: 'contiguousFormat';
  preserveFormat: 'preserveFormat';
}

type Torchlive = {
  torch: Torch;
};

declare const __torchlive__: Torchlive;

export const torch: Torch = __torchlive__.torch;
