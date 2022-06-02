/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Foundation

class BertTokenizer {

    enum BertTokenizerError: Error {
        case illegalBertVocabulary
        case questionTooLong
        case tokenizeError
        case decodeError
    }

    private let EXTRAIDNUM = 3
    private let CLS = "[CLS]"
    private let SEP = "[SEP]"
    private let PAD = "[PAD]"

    private var token2id = [String: Int]()
    private var id2token = [Int: String]()

    init(vocabulary: String) throws {
        let lines = vocabulary.components(separatedBy: .newlines)
        for (index, line) in lines.enumerated() {
            token2id[line] = index
            id2token[index] = line
        }
    }

    func tokenize(content: String, modelInputLength: Int) throws -> [Int] {
        guard let pad = token2id[PAD],
              let cls = token2id[CLS],
              let sep = token2id[SEP] else {
            throw BertTokenizerError.tokenizeError
        }

        let strs = content.replacingOccurrences(of: CLS, with: SEP).components(separatedBy: SEP)
        let question = strs[1].trimmingCharacters(in: .whitespaces)
        let text = strs[2].trimmingCharacters(in: .whitespaces)
        let tokenIdsQuestion = wordPieceTokenizer(question)
        if tokenIdsQuestion.count >= modelInputLength {
            throw BertTokenizerError.questionTooLong
        }
        let tokenIdsText = wordPieceTokenizer(text)
        var tokenIds = Array(repeating: pad, count: modelInputLength)
        tokenIds[0] = cls
        for (idx, tokenid) in tokenIdsQuestion.enumerated() {
            tokenIds[idx+1] = tokenid
        }
        tokenIds[tokenIdsQuestion.count + 1] = sep
        let maxTextLength = min(tokenIdsText.count, modelInputLength - tokenIdsQuestion.count - EXTRAIDNUM)
        for idx in 0..<maxTextLength {
            tokenIds[tokenIdsQuestion.count + idx + 2] = tokenIdsText[idx]
        }
        tokenIds[tokenIdsQuestion.count + maxTextLength + 2] = sep

        return tokenIds
    }

    func decode(tokenIds: [Int]) throws -> String {
        var result = ""
        for (nIdx, tid) in tokenIds.enumerated() {
            guard let token = id2token[tid] else {
                throw BertTokenizerError.decodeError
            }
            result += token
            if nIdx != tokenIds.count - 1 {
                result += " "
            }
        }
        result = result.replacingOccurrences(of: " ##",
                                             with: "")
                                             .replacingOccurrences(of: #" (?=\p{P})"#,
                                                                   with: "",
                                                                   options: .regularExpression
        )
        return result
    }

    private func wordPieceTokenizer(_ questionOrText: String) -> [Int] {
        var tokenIds = [Int]()
        let pattern = #"(\w+|\S)"#
            let regex = try? NSRegularExpression(pattern: pattern, options: [])
            let nsrange = NSRange(questionOrText.startIndex..<questionOrText.endIndex, in: questionOrText)
            regex!.enumerateMatches(in: questionOrText, options: [], range: nsrange) { (match, _, _) in
                guard let match = match else { return }
                let range = match.range(at: 1)
                if let swiftRange = Range(range, in: questionOrText) {
                    let token = questionOrText[swiftRange].lowercased()
                    if token2id[token] != nil {
                        tokenIds.append(token2id[token]!)
                    } else {
                        for tIdx in 0 ..< token.count {
                            let str = String(token.prefix(token.count - tIdx - 1))
                            if let tid = token2id[str] {
                                tokenIds.append(tid)
                                var subToken = String(token.suffix(tIdx + 1))
                                var cur = 0
                                while cur < subToken.count {
                                    if let subTid = token2id["##" + subToken.prefix(subToken.count - cur)] {
                                        tokenIds.append(subTid)
                                        subToken = String(subToken.suffix(cur))
                                        cur = subToken.count - cur
                                    } else if cur == subToken.count - 1 {
                                        tokenIds.append(token2id["##" + subToken]!)
                                        break
                                    } else {
                                        cur += 1
                                    }
                                }
                                break
                            }
                        }
                    }
                }
            }

        return tokenIds
    }

}
