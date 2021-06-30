/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {useEffect, useState} from 'react';
import {Image, ImageUtil} from 'react-native-pytorch-core';

export default function useImageFromBundle(uri: number) {
  const [image, setImage] = useState<Image>();
  useEffect(() => {
    (async () => {
      const img = await ImageUtil.fromBundle(uri);
      setImage != null && setImage(img);
    })();
  }, [setImage, uri]);
  return image;
}
