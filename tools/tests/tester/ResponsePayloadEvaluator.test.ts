/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { Result } from "tester/types/eval.types";
import ResponsePayloadEvaluator from "tester/ResponsePayloadEvaluator";
import { Logger } from "Logger";
import { ActualResponse } from "tester/types/story.types";

function create_response(payload: any): ActualResponse {
  return {
    status: 200,
    content_type: 'application/json',
    payload
  }
}

describe('ResponsePayloadEvaluator', () => {
  const evaluator = new ResponsePayloadEvaluator(new Logger())

  describe('evaluate', () => {
    test('succeeds without an expected payload', () => {
      expect(evaluator.evaluate(create_response({}), undefined)).toEqual({ result: Result.PASSED })
    })

    test('fails with a non-matching payload', () => {
      expect(evaluator.evaluate(create_response({}), { x: 1 })).toEqual({ result: Result.FAILED, message: "missing x='1'" })
    })

    test('succeeds with a matching payload', () => {
      expect(evaluator.evaluate(create_response({ x: 1 }), { x: 1 })).toEqual({ result: Result.PASSED })
    })
  })
})
