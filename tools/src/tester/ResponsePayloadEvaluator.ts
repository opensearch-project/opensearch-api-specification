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

  evaluate(response: ActualResponse, expected_payload?: Payload, response_contains?: string[]): Evaluation {
    const payload = response.payload
    this.logger.info(`${to_json(payload)}`)

    let messages: string[] = [];

    if (response_contains && response_contains.length > 0) {
        const payloadStr = JSON.stringify(payload);
        const missingValues = response_contains.filter(value => !payloadStr.includes(value));

        if (missingValues.length > 0) {
            messages.push(`Response payload is missing required values: ${missingValues.join(', ')}`);
        }
    }

    if (!!expected_payload) {
      const delta = atomizeChangeset(diff(expected_payload, payload))
      const diffMessages: string[] = _.compact(delta.map((value, _index, _array) => {
        switch (value.type) {
          case Operation.UPDATE:
            return `expected ${value.path.replace('$.', '')}='${value.oldValue}', got '${value.value}'`
          case Operation.REMOVE:
            return `missing ${value.path.replace('$.', '')}='${value.value}'`
        }
      }))

      messages = [...messages, ...diffMessages];
    }

    return messages.length > 0 ? { result: Result.FAILED, message: _.join(messages, ', ') } : { result: Result.PASSED }
  }
}