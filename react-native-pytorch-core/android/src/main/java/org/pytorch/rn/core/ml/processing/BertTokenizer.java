/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package org.pytorch.rn.core.ml.processing;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class BertTokenizer {
  private static final String UNKNOWN_TOKEN = "[UNK]";
  private static final String PADDING_TOKEN = "[PAD]";

  private final Map<String, Long> mTokenIdMap = new HashMap<>();
  private final Map<Long, String> mIdTokenMap = new HashMap<>();
  private final Long mUnknownTokenId;
  private final Long mPaddingTokenId;

  public BertTokenizer(String vocabulary) throws IOException {
    final Reader reader = new InputStreamReader(new ByteArrayInputStream(vocabulary.getBytes()));
    final BufferedReader br = new BufferedReader(reader);
    String line;
    long lineNumber = 0;
    while ((line = br.readLine()) != null) {
      mTokenIdMap.put(line, lineNumber);
      mIdTokenMap.put(lineNumber, line);
      lineNumber++;
    }

    mUnknownTokenId = mTokenIdMap.get(UNKNOWN_TOKEN);
    mPaddingTokenId = mTokenIdMap.get(PADDING_TOKEN);
    if (mUnknownTokenId == null) {
      throw new IllegalStateException("Illegal BERT vocabulary: '[UNK]' token is missing");
    }
  }

  public long[] tokenize(String text, int modelInputLength) {
    final long[] ret = new long[modelInputLength];
    int pw = 0;
    for (String t : text.split("\\s+")) {
      final String token = t.charAt(0) == '[' ? t : t.toLowerCase();
      boolean isBad = false;
      int start = 0;

      final int n = token.length();
      Long curSubStrTokenId = null;
      List<Long> subTokenIds = new ArrayList<>();
      while (start < n) {
        int end = n;
        while (start < end) {
          String subStr = token.substring(start, end);
          if (start > 0) {
            subStr = "##" + subStr;
          }
          final Long tokenId = mTokenIdMap.get(subStr);
          if (tokenId != null) {
            curSubStrTokenId = tokenId;
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
        if (pw < modelInputLength) {
          ret[pw++] = mUnknownTokenId;
        }
      } else {
        for (long id : subTokenIds) {
          if (pw < modelInputLength) {
            ret[pw++] = id;
          }
        }
      }
    }

    if (pw < modelInputLength) {
      for (int i = pw; i < modelInputLength; ++i) {
        ret[pw] = mPaddingTokenId;
      }
    }
    return ret;
  }

  public String decode(long[] tokenIds) {
    StringBuilder sb = new StringBuilder();
    for (long tokenId : tokenIds) {
      sb.append(' ').append(mIdTokenMap.get(tokenId));
    }
    return sb.toString().replaceAll(" ##", "").trim();
  }
}
