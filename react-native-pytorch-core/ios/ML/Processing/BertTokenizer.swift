/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Foundation

class BertTokenizer {

    enum BertTokenizerError: Error {
        case IllegalBertVocabulary
        case QuestionTooLong
        case TokenizeError
        case DecodeError
    }

    private let EXTRA_ID_NUM = 3
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
            throw BertTokenizerError.TokenizeError
        }

        let strs = content.replacingOccurrences(of: CLS, with: SEP).components(separatedBy: SEP)
        let question = strs[1].trimmingCharacters(in: .whitespaces)
        let text = strs[2].trimmingCharacters(in: .whitespaces)
        let tokenIdsQuestion = wordPieceTokenizer(question)
        if tokenIdsQuestion.count >= modelInputLength {
            throw BertTokenizerError.QuestionTooLong
        }
        let tokenIdsText = wordPieceTokenizer(text)
        var tokenIds = Array(repeating: pad, count: modelInputLength)
        tokenIds[0] = cls
        for (i, tokenid) in tokenIdsQuestion.enumerated() {
            tokenIds[i+1] = tokenid
        }
        tokenIds[tokenIdsQuestion.count + 1] = sep
        let maxTextLength = min(tokenIdsText.count, modelInputLength - tokenIdsQuestion.count - EXTRA_ID_NUM)
        for i in 0..<maxTextLength {
            tokenIds[tokenIdsQuestion.count + i + 2] = tokenIdsText[i]
        }
        tokenIds[tokenIdsQuestion.count + maxTextLength + 2] = sep

        return tokenIds
    }

    func decode(tokenIds: [Int]) throws -> String {
        var result = ""
        for (n, tid) in tokenIds.enumerated() {
            guard let token = id2token[tid] else {
                throw BertTokenizerError.DecodeError
            }
            result += token
            if n != tokenIds.count - 1 {
                result += " "
            }
        }
        result = result.replacingOccurrences(of: " ##", with: "").replacingOccurrences(of: #" (?=\p{P})"#, with: "", options: .regularExpression
        )
        return result
    }

    private func wordPieceTokenizer(_ questionOrText: String) -> [Int] {
        var tokenIds = [Int]()
        let pattern = #"(\w+|\S)"#
            let regex = try? NSRegularExpression(pattern: pattern, options: [])
            let nsrange = NSRange(questionOrText.startIndex..<questionOrText.endIndex, in: questionOrText)
            regex!.enumerateMatches(in: questionOrText, options: [], range: nsrange) { (match, _, stop) in
                guard let match = match else { return }
                let range = match.range(at:1)
                if let swiftRange = Range(range, in: questionOrText) {
                    let token = questionOrText[swiftRange].lowercased()
                    if let _ = token2id[token] {
                        tokenIds.append(token2id[token]!)
                    }
                    else {
                        for i in 0 ..< token.count {
                            let str = String(token.prefix(token.count - i - 1))
                            if let tid = token2id[str] {
                                tokenIds.append(tid)
                                var subToken = String(token.suffix(i + 1))
                                var j = 0
                                while j < subToken.count {
                                    if let subTid = token2id["##" + subToken.prefix(subToken.count - j)] {
                                        tokenIds.append(subTid)
                                        subToken = String(subToken.suffix(j))
                                        j = subToken.count - j
                                    }
                                    else if (j == subToken.count - 1) {
                                        tokenIds.append(token2id["##" + subToken]!)
                                        break
                                    }
                                    else {
                                        j += 1
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
