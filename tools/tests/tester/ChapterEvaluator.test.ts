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

describe('ChapterEvaluator', () => {
  var mock = new AxiosMockAdapter(axios)
  const { chapter_evaluator } = construct_tester_components('tools/tests/tester/fixtures/specs/excerpt.yaml')

  afterEach(() => {
    mock.reset()
  })

  test('instance', () => {
    expect(chapter_evaluator).toBeDefined();
  });

  describe('evaluate', () => {
    const story_outputs = new StoryOutputs()

    test('a path not found in spec', async () => {
      expect(
        await chapter_evaluator.evaluate({
          synopsis: 'Perform a GET on an invalid path.',
          path: '/invalid',
          method: 'GET'
        }, 'GET', false, story_outputs)).toEqual(
        {
          title: 'Perform a GET on an invalid path.',
          overall: {
            result: Result.FAILED,
            message: 'Operation "GET /invalid" not found in the spec.'
          }
        }
      )
    })

    test('a successful response', async () => {
      mock.onAny().reply(200, '{"acknowledged":true}', { "content-type": "application/json" })

      expect(
        await chapter_evaluator.evaluate({
          synopsis: 'Perform a PUT /{index}.',
          path: '/{index}',
          method: 'PUT',
          parameters: {
            index: 'test'
          },
          request: {
            payload: {}
          }
        }, 'PUT', false, story_outputs)).toEqual(
        {
          title: 'Perform a PUT /{index}.',
          path: 'PUT /{index}',
          operation: { method: 'PUT', path: '/{index}' },
          request: { parameters: { index: { result: 'PASSED' } }, request: { result: 'PASSED' } },
          response: { output_values: { result: 'SKIPPED' }, payload_body: { result: 'PASSED' }, payload_schema: { result: 'PASSED' }, status: { result: 'PASSED' } },
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

      var result = await chapter_evaluator.evaluate({
        synopsis: 'Perform a PUT /{index}.',
        path: '/{index}',
        method: 'PUT',
        retry: {
          count: 4,
          wait: 0
        },
        parameters: {
          index: 'test'
        },
        request: {
          payload: {}
        }
      }, 'PUT', false, story_outputs)

      expect(result.overall.result).toEqual(Result.ERROR)
      expect(count).toEqual(5)
    })
  })
})
