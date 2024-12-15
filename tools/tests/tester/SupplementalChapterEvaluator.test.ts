/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import axios from "axios";
import { StoryOutputs } from 'tester/StoryOutputs';
import { construct_tester_components } from './helpers'
import AxiosMockAdapter from "axios-mock-adapter";
import { Result } from "tester/types/eval.types";

describe('SupplementalChapterEvaluator', () => {
  var mock = new AxiosMockAdapter(axios)
  const { supplemental_chapter_evaluator } = construct_tester_components('tools/tests/tester/fixtures/specs/excerpt.yaml')

  afterEach(() => {
    mock.reset()
  })

  test('instance', () => {
    expect(supplemental_chapter_evaluator).toBeDefined();
  });

  describe('evaluate', () => {
    const story_outputs = new StoryOutputs()

    test('a path not found in spec', async () => {
      expect(
        await supplemental_chapter_evaluator.evaluate({
          path: '/invalid',
          method: 'GET'
        }, story_outputs)).toEqual(
        {
          title: 'GET /invalid',
          overall: {
            result: Result.ERROR,
          }
        }
      )
    })

    test('a successful response', async () => {
      mock.onAny().reply(200, '{"acknowledged":true}', { "content-type": "application/json" })

      expect(
        await supplemental_chapter_evaluator.evaluate({
          path: '/test',
          method: 'PUT',
          request: {
            payload: {}
          }
        }, story_outputs)).toEqual(
        {
          title: 'PUT /test',
          overall: {
            result: Result.PASSED
          }
        }
      )
    })

    test('retries', async () => {
      var count = 0

      mock.onAny().reply((_config) => {
        count += 1
        return [400, 'Bad Request']
      })

      var result = await supplemental_chapter_evaluator.evaluate({
        path: '/test',
        method: 'PUT',
        retry: {
          count: 4,
          wait: 0
        },
        request: {
          payload: {}
        }
      }, story_outputs)

      expect(result.overall.result).toEqual(Result.ERROR)
      expect(count).toEqual(5)
    })
  })
})
