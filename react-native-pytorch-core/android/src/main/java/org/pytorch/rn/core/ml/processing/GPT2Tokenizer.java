/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package org.pytorch.rn.core.ml.processing;

import java.io.UnsupportedEncodingException;
import java.nio.ByteBuffer;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import org.json.JSONException;
import org.json.JSONObject;

public class GPT2Tokenizer {
  private static final String UNKNOWN_TOKEN = "<|endoftext|>";
  private final Long mUnknownTokenId;

  private HashMap<ByteBuffer, Long> mMapBytesToId = new HashMap<>();
  private HashMap<Long, String> mMapIdToString = new HashMap<>();

  public GPT2Tokenizer(JSONObject vocabulary) throws JSONException, UnsupportedEncodingException {
    for (Iterator<String> it = vocabulary.keys(); it.hasNext(); ) {
      final String key = it.next();
      final long value = vocabulary.getLong(key);
      mMapBytesToId.put(mapKey(key), value);
      mMapIdToString.put(value, key);
    }

    mUnknownTokenId = mMapBytesToId.get(mapKey(UNKNOWN_TOKEN));
  }

  private static ByteBuffer mapKey(String key) throws UnsupportedEncodingException {
    return ByteBuffer.wrap(key.getBytes("UTF-8"));
  }

  public long[] tokenize(String text) throws UnsupportedEncodingException {
    final long[] ret = new long[text.length()];

    int pw = 0;
    boolean first = true;
    for (String t : text.split("\\s+")) {
      final String token = first ? t : "\u0120" + t;
      boolean isBad = false;
      first = false;

      int start = 0;
      final int n = token.length();
      Long curSubStrTokenId = null;
      List<Long> subTokenIds = new ArrayList<>();
      while (start < n) {
        int end = n;
        while (start < end) {
          final String subStr = token.substring(start, end);
          final Long id = mMapBytesToId.get(mapKey(subStr));
          if (id != null) {
            curSubStrTokenId = id;
            break;
          }
          end -= 1;
        }

        if (curSubStrTokenId == null) {
          isBad = true;
          break;
        }

        subTokenIds.add(curSubStrTokenId);
        start = end;
      }

      if (isBad) {
        ret[pw++] = mUnknownTokenId;
      } else {
        for (long id : subTokenIds) {
          ret[pw++] = id;
        }
      }
    }
    return Arrays.copyOf(ret, pw);
  }

  public String decode(long[] tokenIds) {
    StringBuilder sb = new StringBuilder();
    for (long tokenId : tokenIds) {
      sb.append(mMapIdToString.get(tokenId));
    }
    return sb.toString().replaceAll("\u0120", " ");
  }
}
