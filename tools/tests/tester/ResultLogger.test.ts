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
            path: 'path',
            operation: {
              method: 'GET',
              path: '/_nodes/{id}'
            }
          }
        ]
      }] })

      logger.log_coverage(test_results)

      expect(log.mock.calls).toEqual([
        [],
        ['Tested 1/6 paths.']
      ])
    })

    test('log_coverage_report', () => {
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
            path: 'GET /_nodes/{id}',
            operation: {
              method: 'GET',
              path: '/_nodes/{id}'
            }
          }
        ]
      }] })

      logger.log_coverage_report(test_results)

      expect(log.mock.calls).not.toContain(["GET /_nodes/{id}"])
      expect(log.mock.calls).toEqual([
        [],
        ["5 paths remaining."],
        ["  /_nodes (1)"],
        ["   /{id} (1)"],
        ["     POST /_nodes/{id}"],
        ["  /cluster_manager (2)"],
        ["    GET /cluster_manager"],
        ["    POST /cluster_manager"],
        ["  /index (1)"],
        ["    GET /index"],
        ["  /nodes (1)"],
        ["    GET /nodes"]
      ])
    })

    test('with retries', () => {
      logger.log({
        result: Result.PASSED,
        display_path: 'path',
        full_path: 'full_path',
        description: 'description',
        message: 'message',
        chapters: [{
          title: 'title',
          retries: 3,
          overall: {
            result: Result.PASSED,
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
        [`         ${ansi.green('RETRIES')} 3`],
        []
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

    test('with a very long error message', () => {
      logger.log({
        result: Result.PASSED,
        display_path: 'path',
        full_path: 'full_path',
        description: 'description',
        message: "x".repeat(257),
        chapters: [{
          title: 'title',
          overall: {
            result: Result.PASSED
          }
        }],
        epilogues: [],
        prologues: []
      })

      const truncated_error = `(${"x".repeat(256)}, ...)`
      expect(log.mock.calls).toEqual([
        [`${ansi.green('PASSED ')} ${ansi.cyan(ansi.b('path'))} ${ansi.gray(truncated_error)}`]
      ])
    })

    describe('with warnings', () => {
      const logger = new ConsoleResultLogger(tab_width, true)

      test('log', () => {
        logger.log({
          result: Result.PASSED,
          display_path: 'path',
          full_path: 'full_path',
          description: 'description',
          message: 'message',
          warnings: ['warn1', 'warn2'],
          epilogues: [],
          prologues: []
        })

        expect(log.mock.calls).toEqual([
          [],
          [`${ansi.green('PASSED ')} ${ansi.cyan(ansi.b('path'))} ${ansi.gray('(message)')}`],
          [ansi.gray("WARNING warn1")],
          [ansi.gray("WARNING warn2")],
          []
        ])
      })
    })
  })
})
