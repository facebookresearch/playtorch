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

export default function useImageFromURL(url: string) {
  const [image, setImage] = useState<Image>();
  useEffect(() => {
    let isMounted = true;
    (async () => {
      const img = await ImageUtil.fromURL(url);
      // The isMounted is needed to check if the component using the React hook
      // was unmounted between the async image load call and until it returned.
      // Without this it will cause an error when React tries to set a state on
      // an unmounted component.
      isMounted && setImage(img);
    })();
    return function () {
      isMounted = false;
    };
  }, [setImage, url]);
  return image;
}
