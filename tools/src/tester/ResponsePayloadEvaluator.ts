/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import _ from "lodash"
import { Evaluation, Result } from './types/eval.types'
import { Logger } from "../Logger"
import { to_json } from "../helpers"
import { ActualResponse, Payload } from "./types/story.types"
import { atomizeChangeset, diff, Operation } from "json-diff-ts"

export default class ResponsePayloadEvaluator {
  private readonly logger: Logger

  constructor(logger: Logger) {
    this.logger = logger
  }

  evaluate(response: ActualResponse, expected_payload?: Payload): Evaluation {
    if (expected_payload == null) return { result: Result.PASSED }
    const payload = response.payload
    this.logger.info(`${to_json(payload)}`)
    const delta = atomizeChangeset(diff(expected_payload, payload))
    const messages: string[] = _.compact(delta.map((value, _index, _array) => {
      switch (value.type) {
        case Operation.UPDATE:
          return `expected ${value.path.replace('$.', '')}='${value.oldValue}', got '${value.value}'`
        case Operation.REMOVE:
          return `missing ${value.path.replace('$.', '')}='${value.value}'`
      }
    }))
    return messages.length > 0 ? { result: Result.FAILED, message: _.join(messages, ', ') } : { result: Result.PASSED }
  }
}