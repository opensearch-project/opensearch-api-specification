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
        [`${ansi.green('PASSED ')} ${ansi.cyan(ansi.b('description'))} ${ansi.gray('(message)')}`],
        [`   ${ansi.green('PASSED ')} CHAPTERS `],
        [`      ${ansi.green('PASSED ')} ${ansi.i('title')} `],
        ["\n"]
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
        [`${ansi.green('PASSED ')} ${ansi.cyan(ansi.b('description'))} ${ansi.gray('(message)')}`],
        ["\n"]
      ])
    })
  })
})
