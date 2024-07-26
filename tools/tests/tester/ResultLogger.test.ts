/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { ConsoleResultLogger } from "tester/ResultLogger"
import { Result } from "tester/types/eval.types"
import * as ansi from 'tester/Ansi'
import MergedOpenApiSpec from "tester/MergedOpenApiSpec"
import TestResults from "tester/TestResults"

describe('ConsoleResultLogger', () => {
  let log: jest.Mock

  beforeEach(() => {
    log = console.log = jest.fn()
  })

  afterEach(() => {
    log.mockClear()
  })

  const tab_width = 3

  describe('verbose=true', () => {
    const logger = new ConsoleResultLogger(tab_width, true)

    test('log', () => {
      logger.log({
        result: Result.PASSED,
        display_path: 'path',
        full_path: 'full_path',
        description: 'description',
        message: 'message',
        chapters: [{
          title: 'title',
          overall: {
            result: Result.PASSED
          }
        }],
        epilogues: [],
        prologues: []
      })

      expect(log.mock.calls).toEqual([
        [],
        [`${ansi.green('PASSED ')} ${ansi.cyan(ansi.b('path'))} ${ansi.gray('(message)')}`],
        [`   ${ansi.green('PASSED ')} CHAPTERS`],
        [`      ${ansi.green('PASSED ')} ${ansi.i('title')}`],
        []
      ])
    })

    test('log_coverage', () => {
      const spec = new MergedOpenApiSpec('tools/tests/tester/fixtures/specs/complete')
      const test_results = new TestResults(spec, { evaluations: [{
        result: Result.PASSED,
        display_path: 'path',
        full_path: 'path',
        description: 'description',
        chapters: [
          {
            title: 'title',
            overall: { result: Result.PASSED },
            path: 'path'
          }
        ]
      }] })

      logger.log_coverage(test_results)

      expect(log.mock.calls).toEqual([
        [],
        ['Tested 1/6 paths.']
      ])
    })
  })

  describe('verbose=false', () => {
    const logger = new ConsoleResultLogger(tab_width, false)

    test('log', () => {
      logger.log({
        result: Result.PASSED,
        display_path: 'path',
        full_path: 'full_path',
        description: 'description',
        message: 'message',
        chapters: [{
          title: 'title',
          overall: {
            result: Result.PASSED
          }
        }],
        epilogues: [],
        prologues: []
      })

      expect(log.mock.calls).toEqual([
        [`${ansi.green('PASSED ')} ${ansi.cyan(ansi.b('path'))} ${ansi.gray('(message)')}`]
      ])
    })
  })
})
